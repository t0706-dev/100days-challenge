'use strict';

// ===== 定数 =====
const STORAGE_KEYS = {
  records: 'wn_records',
  goal: 'wn_goal',
  height: 'wn_height',
  theme: 'wn_theme',
};

const GENTLE_MESSAGES = [
  '今日も記録できてえらいです 🌿',
  '1日の変動は気にしすぎなくて大丈夫です',
  '継続できているのが一番大事です',
  '焦らずコツコツでOKです ✨',
  '数字より流れを見ていきましょう',
  '記録を続けること、それだけで十分です',
  'ゆっくりでいい。続けていることがすごい',
  '小さな一歩を積み重ねているあなたへ 🌱',
  '今日も自分を大切にできましたね',
  '体は毎日変動します。長い目で見ていきましょう',
];

const SAVE_MESSAGES_PLUS = [
  '少し増えていますが、よくある変動です 🌿',
  '水分やむくみで1〜2kgは普通に変動します',
  '7日平均で見ると落ち着いていますよ',
];

// ===== データ管理 =====
const Store = {
  getRecords() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.records) || '[]');
    } catch { return []; }
  },
  saveRecords(records) {
    localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(records));
  },
  getGoal() {
    const v = localStorage.getItem(STORAGE_KEYS.goal);
    return v ? parseFloat(v) : null;
  },
  setGoal(v) { localStorage.setItem(STORAGE_KEYS.goal, String(v)); },
  getHeight() {
    const v = localStorage.getItem(STORAGE_KEYS.height);
    return v ? parseFloat(v) : null;
  },
  setHeight(v) { localStorage.setItem(STORAGE_KEYS.height, String(v)); },
  getTheme() { return localStorage.getItem(STORAGE_KEYS.theme) || 'auto'; },
  setTheme(v) { localStorage.setItem(STORAGE_KEYS.theme, v); },
};

// ===== ユーティリティ =====
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${m}/${d}`;
}

function formatDateFull(dateStr) {
  const [y, m, d] = dateStr.split('-');
  const days = ['日','月','火','水','木','金','土'];
  const dow = new Date(Number(y), Number(m)-1, Number(d)).getDay();
  return `${Number(m)}月${Number(d)}日（${days[dow]}）`;
}

function weightStr(w) {
  return w == null ? '—' : Number(w).toFixed(1);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ===== テーマ =====
const Theme = {
  init() {
    const saved = Store.getTheme();
    this.apply(saved === 'auto' ? this.getOSTheme() : saved);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (Store.getTheme() === 'auto') this.apply(this.getOSTheme());
    });
  },
  getOSTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const metaTheme = document.getElementById('meta-theme-color');
    metaTheme.content = theme === 'dark' ? '#1a1f2e' : '#4caf82';
    document.getElementById('btn-theme').textContent = theme === 'dark' ? '☀️' : '🌙';
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    Store.setTheme(next);
    this.apply(next);
  },
};

// ===== トースト =====
function showToast(msg, duration = 2500) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), duration);
}

// ===== 体重入力 =====
const WeightInput = {
  currentWeight: 60.0,
  lastWeight: null,

  init() {
    const records = Store.getRecords().sort((a,b) => b.date.localeCompare(a.date));
    const last = records[0];
    if (last) {
      this.lastWeight = last.weight;
      this.currentWeight = last.weight;
    } else {
      this.currentWeight = 60.0;
    }

    // 今日すでに記録があるか
    const todayRecord = records.find(r => r.date === todayStr());
    if (todayRecord) {
      this.currentWeight = todayRecord.weight;
      document.getElementById('memo-input').value = todayRecord.memo || '';
      document.getElementById('today-label').textContent = '今日の体重（記録済み）';
    }

    this.render();
    this.bindAdjBtns();
    this.bindDirectInput();
    this.showMessage();
  },

  render() {
    const el = document.getElementById('weight-input');
    el.value = weightStr(this.currentWeight);
    this.updateDiff();
  },

  updateDiff() {
    const diff = this.lastWeight != null ? this.currentWeight - this.lastWeight : null;
    const el = document.getElementById('weight-diff');
    if (diff == null) { el.textContent = ''; el.className = 'weight-diff'; return; }
    const sign = diff > 0 ? '+' : '';
    if (Math.abs(diff) < 0.05) {
      el.textContent = '前回と同じ';
      el.className = 'weight-diff';
    } else if (diff > 0) {
      el.textContent = `前回比 ${sign}${diff.toFixed(1)}kg`;
      el.className = 'weight-diff plus';
    } else {
      el.textContent = `前回比 ${sign}${diff.toFixed(1)}kg`;
      el.className = 'weight-diff minus';
    }
  },

  adjust(delta) {
    this.currentWeight = Math.max(20, Math.min(300, Math.round((this.currentWeight + delta) * 10) / 10));
    this.render();
    // ポップアニメーション
    const el = document.getElementById('weight-input');
    el.classList.remove('weight-pop');
    void el.offsetWidth;
    el.classList.add('weight-pop');
  },

  bindAdjBtns() {
    document.querySelectorAll('.adj-btn').forEach(btn => {
      const delta = parseFloat(btn.dataset.delta);
      let interval = null;
      let timeout = null;

      const start = () => {
        this.adjust(delta);
        btn.classList.add('pressed');
        timeout = setTimeout(() => {
          interval = setInterval(() => this.adjust(delta), 80);
        }, 500);
      };
      const stop = () => {
        btn.classList.remove('pressed');
        clearTimeout(timeout);
        clearInterval(interval);
      };

      btn.addEventListener('pointerdown', e => { e.preventDefault(); start(); });
      btn.addEventListener('pointerup', stop);
      btn.addEventListener('pointerleave', stop);
      btn.addEventListener('pointercancel', stop);
    });
  },

  bindDirectInput() {
    const el = document.getElementById('weight-input');
    el.addEventListener('change', () => {
      const v = parseFloat(el.value);
      if (!isNaN(v) && v >= 20 && v <= 300) {
        this.currentWeight = Math.round(v * 10) / 10;
      }
      this.render();
    });
    el.addEventListener('blur', () => {
      const v = parseFloat(el.value);
      if (!isNaN(v) && v >= 20 && v <= 300) {
        this.currentWeight = Math.round(v * 10) / 10;
      }
      this.render();
    });
  },

  showMessage() {
    const msg = GENTLE_MESSAGES[Math.floor(Math.random() * GENTLE_MESSAGES.length)];
    document.getElementById('gentle-message').textContent = msg;
  },

  getWeight() { return this.currentWeight; },
};

// ===== 保存処理 =====
function saveRecord() {
  const weight = WeightInput.getWeight();
  const memo = document.getElementById('memo-input').value.trim();
  const today = todayStr();
  const records = Store.getRecords();
  const existing = records.find(r => r.date === today);

  if (existing) {
    const confirmed = confirm(`今日（${formatDateFull(today)}）はすでに記録があります。\n上書きしますか？`);
    if (!confirmed) return;
    existing.weight = weight;
    existing.memo = memo;
    existing.updatedAt = new Date().toISOString();
  } else {
    records.push({
      id: generateId(),
      date: today,
      weight,
      memo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  Store.saveRecords(records);
  WeightInput.lastWeight = weight;

  // メッセージ選定
  const diff = existing ? 0 : (records.length > 1 ? weight - records[records.length-2]?.weight : 0);
  const isPlus = diff > 0.2;
  let msg;
  if (isPlus) {
    msg = SAVE_MESSAGES_PLUS[Math.floor(Math.random() * SAVE_MESSAGES_PLUS.length)];
  } else {
    msg = GENTLE_MESSAGES[Math.floor(Math.random() * GENTLE_MESSAGES.length)];
  }
  document.getElementById('gentle-message').textContent = msg;
  document.getElementById('today-label').textContent = '今日の体重（記録済み）';

  showToast('記録しました ✓');
  refreshAll();
}

// ===== 統計計算 =====
function calcStats(records) {
  const sorted = [...records].sort((a,b) => a.date.localeCompare(b.date));

  // 7日平均
  const today = todayStr();
  const cutoff7 = new Date(); cutoff7.setDate(cutoff7.getDate() - 6);
  const last7 = sorted.filter(r => r.date >= cutoff7.toISOString().slice(0,10));
  const avg7 = last7.length ? last7.reduce((s,r) => s+r.weight, 0) / last7.length : null;

  // 連続記録日数
  let streak = 0;
  const today_ = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today_);
    d.setDate(d.getDate() - i);
    const s = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (sorted.find(r => r.date === s)) { streak++; } else { break; }
  }

  // 目標差分
  const goal = Store.getGoal();
  const latest = sorted[sorted.length - 1];
  const goalDiff = goal != null && latest ? latest.weight - goal : null;

  return { avg7, streak, goalDiff, sorted };
}

// ===== 7日移動平均 =====
function movingAverage(data, window = 7) {
  return data.map((_, i) => {
    const slice = data.slice(Math.max(0, i - window + 1), i + 1);
    return slice.reduce((s,v) => s + v, 0) / slice.length;
  });
}

// ===== チャート =====
let miniChartInst = null;
let mainChartInst = null;

function getChartColors() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    green: '#4caf82',
    blue: '#5b9bd5',
    gridColor: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
    textColor: dark ? '#9aa3b0' : '#9aa3b0',
    tooltipBg: dark ? '#1e2330' : '#ffffff',
    tooltipText: dark ? '#e8ecf0' : '#2c3340',
  };
}

function renderMiniChart(records) {
  const canvas = document.getElementById('mini-chart');
  const ctx = canvas.getContext('2d');
  const sorted = [...records].sort((a,b) => a.date.localeCompare(b.date));
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 13);
  const filtered = sorted.filter(r => r.date >= cutoff.toISOString().slice(0,10));

  const labels = filtered.map(r => formatDate(r.date));
  const weights = filtered.map(r => r.weight);
  const avgs = movingAverage(weights);
  const colors = getChartColors();

  if (miniChartInst) miniChartInst.destroy();
  miniChartInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '実測値',
          data: weights,
          borderColor: colors.blue,
          borderWidth: 1.5,
          pointRadius: 3,
          pointBackgroundColor: colors.blue,
          tension: 0.3,
          fill: false,
          borderDash: [],
          order: 2,
        },
        {
          label: '7日平均',
          data: avgs,
          borderColor: colors.green,
          borderWidth: 3,
          pointRadius: 0,
          tension: 0.4,
          fill: {
            target: 'origin',
            above: 'rgba(76,175,130,0.07)',
          },
          order: 1,
        },
      ],
    },
    options: miniChartOptions(colors),
  });
}

function miniChartOptions(colors) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: colors.tooltipBg,
        titleColor: colors.textColor,
        bodyColor: colors.tooltipText,
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}kg`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: colors.textColor, font: { size: 10, family: "'M PLUS Rounded 1c'" } },
        grid: { color: colors.gridColor },
      },
      y: {
        ticks: {
          color: colors.textColor,
          font: { size: 10, family: "'M PLUS Rounded 1c'" },
          callback: v => `${v.toFixed(1)}`,
        },
        grid: { color: colors.gridColor },
      },
    },
  };
}

function renderMainChart(records, range) {
  const canvas = document.getElementById('main-chart');
  const ctx = canvas.getContext('2d');
  const sorted = [...records].sort((a,b) => a.date.localeCompare(b.date));

  let filtered = sorted;
  if (range > 0) {
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - range + 1);
    filtered = sorted.filter(r => r.date >= cutoff.toISOString().slice(0,10));
  }

  const labels = filtered.map(r => formatDate(r.date));
  const weights = filtered.map(r => r.weight);
  const avgs = movingAverage(weights);
  const colors = getChartColors();

  if (mainChartInst) mainChartInst.destroy();
  mainChartInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '実測値',
          data: weights,
          borderColor: colors.blue,
          borderWidth: 1.5,
          pointRadius: 3,
          pointBackgroundColor: colors.blue,
          tension: 0.3,
          fill: false,
          order: 2,
          borderOpacity: 0.6,
        },
        {
          label: '7日移動平均',
          data: avgs,
          borderColor: colors.green,
          borderWidth: 3.5,
          pointRadius: 0,
          tension: 0.4,
          fill: {
            target: 'origin',
            above: 'rgba(76,175,130,0.07)',
          },
          order: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          titleColor: colors.textColor,
          bodyColor: colors.tooltipText,
          borderColor: 'rgba(0,0,0,0.1)',
          borderWidth: 1,
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}kg`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: colors.textColor, font: { size: 11, family: "'M PLUS Rounded 1c'" }, maxRotation: 45 },
          grid: { color: colors.gridColor },
        },
        y: {
          ticks: {
            color: colors.textColor,
            font: { size: 11, family: "'M PLUS Rounded 1c'" },
            callback: v => `${v.toFixed(1)}kg`,
          },
          grid: { color: colors.gridColor },
        },
      },
    },
  });

  // 統計
  renderStatsGrid(filtered, colors);
}

function renderStatsGrid(filtered, colors) {
  const weights = filtered.map(r => r.weight);
  if (!weights.length) { document.getElementById('stats-grid').innerHTML = '<div style="color:var(--text-sub)">データがありません</div>'; return; }

  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const avg = weights.reduce((s,v)=>s+v,0)/weights.length;
  const latest = weights[weights.length-1];
  const minRecord = filtered.find(r=>r.weight===min);
  const maxRecord = filtered.find(r=>r.weight===max);

  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-item"><div class="stat-item-label">最小</div><div class="stat-item-value">${min.toFixed(1)}kg <small style="font-size:.72rem;color:var(--text-sub)">${formatDate(minRecord?.date||'')}</small></div></div>
    <div class="stat-item"><div class="stat-item-label">最大</div><div class="stat-item-value">${max.toFixed(1)}kg <small style="font-size:.72rem;color:var(--text-sub)">${formatDate(maxRecord?.date||'')}</small></div></div>
    <div class="stat-item"><div class="stat-item-label">平均</div><div class="stat-item-value">${avg.toFixed(1)}kg</div></div>
    <div class="stat-item"><div class="stat-item-label">記録件数</div><div class="stat-item-value">${filtered.length}件</div></div>
  `;
}

// ===== ホームサマリー更新 =====
function updateHomeSummary(records) {
  const { avg7, streak, goalDiff } = calcStats(records);
  document.getElementById('avg7').textContent = avg7 != null ? avg7.toFixed(1) : '—';
  document.getElementById('streak').textContent = streak;

  if (goalDiff != null) {
    const sign = goalDiff > 0 ? '+' : '';
    document.getElementById('goal-diff').textContent = `${sign}${goalDiff.toFixed(1)}`;
    document.getElementById('goal-diff-unit').textContent = 'kg';
  } else {
    document.getElementById('goal-diff').textContent = '—';
    document.getElementById('goal-diff-unit').textContent = '未設定';
  }
}

// ===== 週間ふり返り =====
function updateWeeklySummary(records) {
  const sorted = [...records].sort((a,b) => a.date.localeCompare(b.date));

  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=日
  const thisMonday = new Date(now); thisMonday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  const lastMonday = new Date(thisMonday); lastMonday.setDate(thisMonday.getDate() - 7);
  const thisSunday = new Date(thisMonday); thisSunday.setDate(thisMonday.getDate() + 6);
  const lastSunday = new Date(lastMonday); lastSunday.setDate(lastMonday.getDate() + 6);

  const toStr = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  const thisWeek = sorted.filter(r => r.date >= toStr(thisMonday) && r.date <= toStr(thisSunday));
  const lastWeek = sorted.filter(r => r.date >= toStr(lastMonday) && r.date <= toStr(lastSunday));

  const thisAvg = thisWeek.length ? thisWeek.reduce((s,r)=>s+r.weight,0)/thisWeek.length : null;
  const lastAvg = lastWeek.length ? lastWeek.reduce((s,r)=>s+r.weight,0)/lastWeek.length : null;
  const weekDiff = thisAvg != null && lastAvg != null ? thisAvg - lastAvg : null;

  let trend = '横ばい';
  let trendClass = 'trend-flat';
  if (weekDiff != null) {
    if (weekDiff < -0.3) { trend = '減少傾向 ↓'; trendClass = 'trend-down'; }
    else if (weekDiff > 0.3) { trend = '上昇傾向 ↑'; trendClass = 'trend-up'; }
  }

  document.getElementById('weekly-summary').innerHTML = `
    <div class="weekly-item"><div class="weekly-item-label">今週の平均</div><div class="weekly-item-value">${thisAvg != null ? thisAvg.toFixed(1)+'kg' : '—'}</div></div>
    <div class="weekly-item"><div class="weekly-item-label">先週比</div><div class="weekly-item-value">${weekDiff != null ? (weekDiff>0?'+':'')+weekDiff.toFixed(1)+'kg' : '—'}</div></div>
    <div class="weekly-item"><div class="weekly-item-label">今週の記録日数</div><div class="weekly-item-value">${thisWeek.length}日</div></div>
    <div class="weekly-item"><div class="weekly-item-label">傾向</div><div class="weekly-item-value"><span class="trend-badge ${trendClass}">${trend}</span></div></div>
  `;
}

// ===== カレンダー =====
const Calendar = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),

  render(records) {
    const recordDates = new Set(records.map(r => r.date));
    const today = todayStr();
    const dayNames = ['日','月','火','水','木','金','土'];
    const title = `${this.year}年${this.month + 1}月`;
    document.getElementById('cal-title').textContent = title;

    const first = new Date(this.year, this.month, 1);
    const last = new Date(this.year, this.month + 1, 0);
    const startDow = first.getDay();

    let html = dayNames.map(d => `<div class="cal-day-name">${d}</div>`).join('');

    // 前月の空白
    for (let i = 0; i < startDow; i++) {
      const prevDate = new Date(this.year, this.month, -startDow + i + 1);
      html += `<div class="cal-day other-month">${prevDate.getDate()}</div>`;
    }

    for (let d = 1; d <= last.getDate(); d++) {
      const dateStr = `${this.year}-${String(this.month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      let cls = 'cal-day';
      if (recordDates.has(dateStr)) cls += ' has-record';
      if (dateStr === today) cls += ' today';
      html += `<div class="${cls}">${d}</div>`;
    }

    document.getElementById('calendar-grid').innerHTML = html;
  },

  prev(records) {
    this.month--;
    if (this.month < 0) { this.month = 11; this.year--; }
    this.render(records);
  },
  next(records) {
    this.month++;
    if (this.month > 11) { this.month = 0; this.year++; }
    this.render(records);
  },
};

// ===== 記録一覧 =====
function renderHistory(records) {
  const sorted = [...records].sort((a,b) => b.date.localeCompare(a.date));
  const list = document.getElementById('history-list');
  const empty = document.getElementById('history-empty');

  if (!sorted.length) {
    list.innerHTML = '';
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';

  list.innerHTML = sorted.map((r, i) => {
    const prev = sorted[i + 1];

    const memoText = r.memo ? ` · ${r.memo}` : '';
    const diff = prev ? r.weight - prev.weight : null;
    const diffCls = diff == null ? '' : diff > 0 ? 'plus' : diff < 0 ? 'minus' : '';
    const diffStr = diff == null ? '—' : (diff > 0 ? '+' : '') + diff.toFixed(1) + 'kg';
    return `
      <div class="history-item" data-id="${r.id}">
        <div class="hist-date">${formatDateFull(r.date)}</div>
        <div class="hist-main">
          <div class="hist-weight">${r.weight.toFixed(1)}<span>kg</span></div>
          <div class="hist-diff ${diffCls}">${diffStr}${memoText}</div>
        </div>
        <div class="hist-actions">
          <button class="btn-hist" onclick="openEditModal('${r.id}')">編集</button>
          <button class="btn-hist btn-hist-del" onclick="deleteRecord('${r.id}')">削除</button>
        </div>
      </div>
    `;
  }).join('');
}

// ===== BMI =====
function updateBMI() {
  const height = Store.getHeight();
  const records = Store.getRecords().sort((a,b) => b.date.localeCompare(a.date));
  const latest = records[0];
  const info = document.getElementById('bmi-info');
  if (!height || !latest) { info.textContent = ''; return; }

  const h = height / 100;
  const bmi = latest.weight / (h * h);
  const std = 22 * h * h;
  let label = '';
  if (bmi < 18.5) label = '低体重';
  else if (bmi < 25) label = '普通体重';
  else if (bmi < 30) label = '肥満（1度）';
  else label = '肥満（2度以上）';

  info.innerHTML = `BMI: <strong>${bmi.toFixed(1)}</strong>（${label}）　標準体重: <strong>${std.toFixed(1)}kg</strong>`;
}

// ===== 編集モーダル =====
function openEditModal(id) {
  const records = Store.getRecords();
  const r = records.find(r => r.id === id);
  if (!r) return;
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-date').value = r.date;
  document.getElementById('edit-weight').value = r.weight.toFixed(1);
  document.getElementById('edit-memo').value = r.memo || '';
  document.getElementById('edit-modal').style.display = 'flex';
}

function closeEditModal() {
  document.getElementById('edit-modal').style.display = 'none';
}

function saveEditModal() {
  const id = document.getElementById('edit-id').value;
  const date = document.getElementById('edit-date').value;
  const weight = parseFloat(document.getElementById('edit-weight').value);
  const memo = document.getElementById('edit-memo').value.trim();

  if (!date || isNaN(weight) || weight < 20 || weight > 300) {
    showToast('入力内容を確認してください'); return;
  }

  const records = Store.getRecords();
  const r = records.find(r => r.id === id);
  if (!r) return;
  r.date = date;
  r.weight = Math.round(weight * 10) / 10;
  r.memo = memo;
  r.updatedAt = new Date().toISOString();
  Store.saveRecords(records);
  closeEditModal();
  showToast('更新しました ✓');
  refreshAll();
}

function deleteRecord(id) {
  if (!confirm('この記録を削除しますか？')) return;
  const records = Store.getRecords().filter(r => r.id !== id);
  Store.saveRecords(records);
  showToast('削除しました');
  refreshAll();
}

// ===== CSV =====
function exportCSV() {
  const records = Store.getRecords().sort((a,b) => a.date.localeCompare(b.date));
  if (!records.length) { showToast('記録がありません'); return; }

  const header = 'id,date,weight,memo,createdAt,updatedAt';
  const rows = records.map(r =>
    [r.id, r.date, r.weight, `"${(r.memo||'').replace(/"/g,'""')}"`, r.createdAt, r.updatedAt].join(',')
  );
  const csv = '\uFEFF' + [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `weight_${todayStr()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSVをエクスポートしました');
}

function importCSV(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const text = e.target.result.replace(/^\uFEFF/, '');
      const lines = text.split(/\r?\n/).filter(Boolean);
      const header = lines[0].toLowerCase();
      if (!header.includes('date') || !header.includes('weight')) {
        showToast('CSVの形式が正しくありません'); return;
      }
      const cols = header.split(',');
      const dateIdx = cols.indexOf('date');
      const weightIdx = cols.indexOf('weight');
      const memoIdx = cols.indexOf('memo');

      const records = Store.getRecords();
      let added = 0;
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        const date = parts[dateIdx]?.trim();
        const weight = parseFloat(parts[weightIdx]);
        const memo = (parts[memoIdx] || '').replace(/^"|"$/g, '').trim();
        if (!date || isNaN(weight)) continue;
        if (!records.find(r => r.date === date)) {
          records.push({ id: generateId(), date, weight, memo, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
          added++;
        }
      }
      Store.saveRecords(records);
      showToast(`${added}件インポートしました`);
      refreshAll();
    } catch { showToast('インポートに失敗しました'); }
  };
  reader.readAsText(file, 'UTF-8');
}

// ===== 全体リフレッシュ =====
let currentRange = 7;

function refreshAll() {
  const records = Store.getRecords();
  updateHomeSummary(records);
  updateWeeklySummary(records);
  renderMiniChart(records);
  Calendar.render(records);
  renderMainChart(records, currentRange);
  renderHistory(records);
  updateBMI();
}

// ===== タブ切替 =====
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(`tab-${tabName}`)?.classList.add('active');
  document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
}

// ===== 初期化 =====
function init() {
  Theme.init();
  WeightInput.init();
  refreshAll();

  // 設定値読み込み
  const goal = Store.getGoal();
  if (goal) document.getElementById('goal-input').value = goal.toFixed(1);
  const height = Store.getHeight();
  if (height) document.getElementById('height-input').value = height.toFixed(1);

  // タブ
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // テーマ
  document.getElementById('btn-theme').addEventListener('click', () => {
    Theme.toggle();
    // チャート再描画
    const records = Store.getRecords();
    renderMiniChart(records);
    renderMainChart(records, currentRange);
  });

  // 保存
  document.getElementById('btn-save').addEventListener('click', saveRecord);

  // グラフレンジ
  document.querySelectorAll('.range-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.range-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRange = parseInt(btn.dataset.range);
      renderMainChart(Store.getRecords(), currentRange);
    });
  });

  // カレンダー
  document.getElementById('cal-prev').addEventListener('click', () => Calendar.prev(Store.getRecords()));
  document.getElementById('cal-next').addEventListener('click', () => Calendar.next(Store.getRecords()));

  // 設定保存
  document.getElementById('btn-save-goal').addEventListener('click', () => {
    const v = parseFloat(document.getElementById('goal-input').value);
    if (isNaN(v) || v < 20 || v > 300) { showToast('正しい数値を入力してください'); return; }
    Store.setGoal(v);
    showToast('目標体重を保存しました');
    refreshAll();
  });
  document.getElementById('btn-save-height').addEventListener('click', () => {
    const v = parseFloat(document.getElementById('height-input').value);
    if (isNaN(v) || v < 100 || v > 250) { showToast('正しい数値を入力してください'); return; }
    Store.setHeight(v);
    showToast('身長を保存しました');
    updateBMI();
  });

  // CSV
  document.getElementById('btn-export').addEventListener('click', exportCSV);
  document.getElementById('csv-import').addEventListener('change', e => {
    importCSV(e.target.files[0]);
    e.target.value = '';
  });

  // 全削除
  document.getElementById('btn-clear-all').addEventListener('click', () => {
    if (!confirm('すべての記録を削除します。\nこの操作は元に戻せません。本当によろしいですか？')) return;
    Store.saveRecords([]);
    showToast('すべての記録を削除しました');
    location.reload();
  });

  // 編集モーダル
  document.getElementById('btn-edit-cancel').addEventListener('click', closeEditModal);
  document.getElementById('btn-edit-save').addEventListener('click', saveEditModal);
  document.getElementById('edit-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeEditModal();
  });
}

document.addEventListener('DOMContentLoaded', init);

// ===== Service Worker 登録 =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}
