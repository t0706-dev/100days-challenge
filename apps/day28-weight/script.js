'use strict';

// ===== 定数 =====
const STORAGE_KEYS = {
  records: 'wn_records',
  goal: 'wn_goal',
  height: 'wn_height',
  theme: 'wn_theme',
  lang: 'wn_lang',
};

// ===== 多言語翻訳 =====
const TRANSLATIONS = {
  ja: {
    appTitle: 'たいじゅうノート',
    navHome: 'ホーム',
    navGraph: 'グラフ',
    navHistory: '記録',
    navSettings: '設定',
    todayWeight: '今日の体重',
    todayWeightRecorded: '記録済み',
    pastWeight: '%sの体重',
    pastWeightRecorded: '%s（記録済み）',
    prevSame: '前回と同じ',
    prevDiff: '前回比',
    memoPlaceholder: 'ひとことメモ（任意）',
    saveBtn: '体重を記録する',
    saveBtn2: '保存',
    avg7: '7日平均',
    streak: '連続記録',
    streakUnit: '日',
    goalDiff: '目標まで',
    goalNotSet: '未設定',
    miniChartTitle: '直近14日の推移',
    weeklyTitle: '今週のふり返り',
    thisWeekAvg: '今週の平均',
    lastWeekDiff: '先週比',
    thisWeekDays: '今週の記録日数',
    trend: '傾向',
    trendDown: '減少傾向 ↓',
    trendFlat: '横ばい',
    trendUp: '上昇傾向 ↑',
    range7: '7日',
    range30: '30日',
    range90: '90日',
    rangeAll: '全期間',
    legend7avg: '7日移動平均',
    legendRaw: '実測値',
    statsTitle: '期間の統計',
    statMin: '最小',
    statMax: '最大',
    statAvg: '平均',
    statCount: '記録件数',
    historyEmpty: '記録がまだありません',
    editBtn: '編集',
    deleteBtn: '削除',
    settingGoal: '目標体重（kg）',
    goalPlaceholder: '例：65.0',
    settingHeight: '身長（cm）',
    heightPlaceholder: '例：170.0',
    settingData: 'データ管理',
    exportCSV: 'CSVエクスポート',
    importCSV: 'CSVインポート',
    dangerZone: '危険ゾーン',
    clearAll: 'すべての記録を削除',
    editModalTitle: '記録を編集',
    editDateLabel: '日付',
    editWeightLabel: '体重（kg）',
    editMemoLabel: 'メモ',
    cancelBtn: 'キャンセル',
    manualTitle: '使い方ガイド',
    toastSaved: '記録しました ✓',
    toastUpdated: '更新しました ✓',
    toastDeleted: '削除しました',
    toastGoalSaved: '目標体重を保存しました',
    toastHeightSaved: '身長を保存しました',
    toastExported: 'CSVをエクスポートしました',
    toastNoData: '記録がありません',
    toastImported: '%s件インポートしました',
    toastImportFail: 'インポートに失敗しました',
    toastAllDeleted: 'すべての記録を削除しました',
    toastInvalidInput: '入力内容を確認してください',
    toastInvalidCSV: 'CSVの形式が正しくありません',
    confirmOverwrite: '%sはすでに記録があります。\n上書きしますか？',
    confirmDelete: 'この記録を削除しますか？',
    confirmClearAll: 'すべての記録を削除します。\nこの操作は元に戻せません。本当によろしいですか？',
    bmiLabel: 'BMI: %s（%s）　標準体重: %skg',
    bmiUnderweight: '低体重',
    bmiNormal: '普通体重',
    bmiObese1: '肥満（1度）',
    bmiObese2: '肥満（2度以上）',
    calDayNames: ['日','月','火','水','木','金','土'],
    calMonthTitle: '%s年%s月',
    gentleMessages: [
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
    ],
    saveMsgPlus: [
      '少し増えていますが、よくある変動です 🌿',
      '水分やむくみで1〜2kgは普通に変動します',
      '7日平均で見ると落ち着いていますよ',
    ],
    manualSections: [
      {
        icon: '⚖️',
        title: '体重の記録',
        items: [
          '前回の体重がデフォルト表示されます',
          '±0.1・±0.5ボタンで微調整できます',
          '長押しで連続加算・減算ができます',
          '数値をタップすると直接入力できます',
          '変化がなければそのまま「記録する」を押すだけ',
        ],
      },
      {
        icon: '📅',
        title: '日付の変更',
        items: [
          '入力カードの日付をタップして変更できます',
          '左右の矢印ボタンで前後の日に移動できます',
          '過去の日付にさかのぼって記録できます',
        ],
      },
      {
        icon: '📊',
        title: 'グラフ・統計',
        items: [
          'グラフタブで体重推移を確認できます',
          '緑の線が7日移動平均（傾向）です',
          '7日・30日・90日・全期間で切替できます',
        ],
      },
      {
        icon: '📝',
        title: '記録の管理',
        items: [
          '記録タブで一覧表示・編集・削除ができます',
          'メモ欄に「外食」「運動した」などを記録できます',
        ],
      },
      {
        icon: '⚙️',
        title: '設定',
        items: [
          '目標体重を設定するとホームに差分が表示されます',
          '身長を設定するとBMIが計算されます',
          'CSVで記録のエクスポート・インポートができます',
        ],
      },
    ],
  },
  en: {
    appTitle: 'Weight Note',
    navHome: 'Home',
    navGraph: 'Graph',
    navHistory: 'Records',
    navSettings: 'Settings',
    todayWeight: "Today's Weight",
    todayWeightRecorded: 'Saved',
    pastWeight: 'Weight on %s',
    pastWeightRecorded: '%s (Saved)',
    prevSame: 'Same as last',
    prevDiff: 'vs. last',
    memoPlaceholder: 'Note (optional)',
    saveBtn: 'Save Weight',
    saveBtn2: 'Save',
    avg7: '7-Day Avg',
    streak: 'Streak',
    streakUnit: 'days',
    goalDiff: 'To Goal',
    goalNotSet: 'Not set',
    miniChartTitle: 'Last 14 Days',
    weeklyTitle: 'Weekly Review',
    thisWeekAvg: 'This Week Avg',
    lastWeekDiff: 'vs. Last Week',
    thisWeekDays: 'Days Logged',
    trend: 'Trend',
    trendDown: 'Decreasing ↓',
    trendFlat: 'Stable',
    trendUp: 'Increasing ↑',
    range7: '7d',
    range30: '30d',
    range90: '90d',
    rangeAll: 'All',
    legend7avg: '7-Day Avg',
    legendRaw: 'Actual',
    statsTitle: 'Period Stats',
    statMin: 'Min',
    statMax: 'Max',
    statAvg: 'Average',
    statCount: 'Records',
    historyEmpty: 'No records yet',
    editBtn: 'Edit',
    deleteBtn: 'Delete',
    settingGoal: 'Goal Weight (kg)',
    goalPlaceholder: 'e.g. 65.0',
    settingHeight: 'Height (cm)',
    heightPlaceholder: 'e.g. 170.0',
    settingData: 'Data Management',
    exportCSV: 'Export CSV',
    importCSV: 'Import CSV',
    dangerZone: 'Danger Zone',
    clearAll: 'Delete All Records',
    editModalTitle: 'Edit Record',
    editDateLabel: 'Date',
    editWeightLabel: 'Weight (kg)',
    editMemoLabel: 'Note',
    cancelBtn: 'Cancel',
    manualTitle: 'How to Use',
    toastSaved: 'Saved ✓',
    toastUpdated: 'Updated ✓',
    toastDeleted: 'Deleted',
    toastGoalSaved: 'Goal weight saved',
    toastHeightSaved: 'Height saved',
    toastExported: 'CSV exported',
    toastNoData: 'No records',
    toastImported: '%s records imported',
    toastImportFail: 'Import failed',
    toastAllDeleted: 'All records deleted',
    toastInvalidInput: 'Please check your input',
    toastInvalidCSV: 'Invalid CSV format',
    confirmOverwrite: 'A record for %s already exists.\nOverwrite it?',
    confirmDelete: 'Delete this record?',
    confirmClearAll: 'This will delete all records.\nThis cannot be undone. Are you sure?',
    bmiLabel: 'BMI: %s (%s)  Standard: %skg',
    bmiUnderweight: 'Underweight',
    bmiNormal: 'Normal',
    bmiObese1: 'Obese (Class I)',
    bmiObese2: 'Obese (Class II+)',
    calDayNames: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    calMonthTitle: '%s/%s',
    gentleMessages: [
      'Great job logging today! 🌿',
      "Day-to-day changes are normal — don't worry",
      'Consistency is what matters most',
      'Slow and steady is perfectly fine ✨',
      'Focus on the trend, not the number',
      'Just keeping the habit is enough',
      "You're doing great — keep going",
      'Every small step counts 🌱',
      'Be kind to yourself today',
      'Bodies fluctuate. Look at the big picture',
    ],
    saveMsgPlus: [
      "A slight increase is totally normal 🌿",
      "Water retention can add 1–2kg easily",
      "The 7-day average tells the real story",
    ],
    manualSections: [
      {
        icon: '⚖️',
        title: 'Logging Weight',
        items: [
          'Your last weight is pre-filled by default',
          'Use ±0.1 / ±0.5 buttons to fine-tune',
          'Long-press a button for continuous adjustment',
          'Tap the number to type directly',
          'No change? Just tap "Save Weight" once',
        ],
      },
      {
        icon: '📅',
        title: 'Changing the Date',
        items: [
          'Tap the date field to pick a different date',
          'Use ‹ › arrows to move day by day',
          'You can log past dates any time',
        ],
      },
      {
        icon: '📊',
        title: 'Graph & Stats',
        items: [
          'See your trend in the Graph tab',
          'The green line is the 7-day moving average',
          'Switch between 7d / 30d / 90d / All time',
        ],
      },
      {
        icon: '📝',
        title: 'Managing Records',
        items: [
          'Edit or delete any record in the Records tab',
          'Add notes like "ate out" or "exercised"',
        ],
      },
      {
        icon: '⚙️',
        title: 'Settings',
        items: [
          'Set a goal weight to see progress on Home',
          'Enter your height to calculate BMI',
          'Export or import records as CSV',
        ],
      },
    ],
  },
};

// ===== 言語管理 =====
const Lang = {
  current: 'ja',
  init() {
    this.current = localStorage.getItem(STORAGE_KEYS.lang) || 'ja';
    this.apply();
  },
  t(key, ...args) {
    const tr = TRANSLATIONS[this.current];
    let val = tr[key] ?? TRANSLATIONS.ja[key] ?? key;
    if (typeof val === 'string') {
      args.forEach(a => { val = val.replace('%s', a); });
    }
    return val;
  },
  toggle() {
    this.current = this.current === 'ja' ? 'en' : 'ja';
    localStorage.setItem(STORAGE_KEYS.lang, this.current);
    this.apply();
    refreshAll();
  },
  apply() {
    document.documentElement.lang = this.current;
    document.getElementById('btn-lang').textContent = this.current === 'ja' ? 'EN' : 'JP';
    // data-i18n 属性を持つ要素を一括更新
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = this.t(key);
      if (typeof val === 'string') el.textContent = val;
    });
    // placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });
    // title
    document.title = this.t('appTitle');
  },
};
// 短縮アクセス
function t(key, ...args) { return Lang.t(key, ...args); }

// ===== データ管理 =====
const Store = {
  getRecords() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.records) || '[]'); }
    catch { return []; }
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
  const days = t('calDayNames');
  const dow = new Date(Number(y), Number(m)-1, Number(d)).getDay();
  if (Lang.current === 'en') {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[Number(m)-1]} ${Number(d)} (${days[dow]})`;
  }
  return `${Number(m)}月${Number(d)}日（${days[dow]}）`;
}

function weightStr(w) {
  return w == null ? '—' : Number(w).toFixed(1);
}

function parseWeight(str) {
  const v = parseFloat(String(str).replace(/[^\d.]/g, ''));
  return isNaN(v) ? null : Math.round(v * 10) / 10;
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
    document.getElementById('meta-theme-color').content = theme === 'dark' ? '#1a1f2e' : '#4caf82';
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
  selectedDate: todayStr(),

  init() {
    this.selectedDate = todayStr();
    document.getElementById('record-date').value = this.selectedDate;
    this.loadForDate(this.selectedDate);
    this.bindAdjBtns();
    this.bindDirectInput();
    this.bindDateControls();
    this.showMessage();
  },

  loadForDate(dateStr) {
    const records = Store.getRecords().sort((a,b) => b.date.localeCompare(a.date));
    const existing = records.find(r => r.date === dateStr);

    // 前回値: 選択日より前の最新レコード
    const prev = records.find(r => r.date < dateStr);
    this.lastWeight = prev ? prev.weight : null;

    if (existing) {
      this.currentWeight = existing.weight;
      document.getElementById('memo-input').value = existing.memo || '';
    } else {
      // 前回値をデフォルトに（なければ60.0）
      this.currentWeight = this.lastWeight ?? 60.0;
      document.getElementById('memo-input').value = '';
    }

    this.updateLabel(dateStr, !!existing);
    this.render();
  },

  updateLabel(dateStr, isRecorded) {
    const today = todayStr();
    const label = document.getElementById('today-label');
    if (dateStr === today) {
      label.textContent = isRecorded ? t('todayWeightRecorded') : t('todayWeight');
    } else {
      const short = formatDateFull(dateStr);
      label.textContent = isRecorded ? t('pastWeightRecorded', short) : t('pastWeight', short);
    }
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
      el.textContent = t('prevSame');
      el.className = 'weight-diff';
    } else {
      el.textContent = `${t('prevDiff')} ${sign}${diff.toFixed(1)}kg`;
      el.className = `weight-diff ${diff > 0 ? 'plus' : 'minus'}`;
    }
  },

  adjust(delta) {
    this.currentWeight = Math.max(20, Math.min(300, Math.round((this.currentWeight + delta) * 10) / 10));
    this.render();
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
    const commit = () => {
      const v = parseWeight(el.value);
      if (v != null && v >= 20 && v <= 300) {
        this.currentWeight = v;
      }
      this.render();
    };
    el.addEventListener('blur', commit);
    el.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); commit(); el.blur(); } });
  },

  bindDateControls() {
    const dateEl = document.getElementById('record-date');
    dateEl.addEventListener('change', () => {
      this.selectedDate = dateEl.value;
      this.loadForDate(this.selectedDate);
    });
    document.getElementById('date-prev').addEventListener('click', () => this.moveDate(-1));
    document.getElementById('date-next').addEventListener('click', () => this.moveDate(1));
  },

  moveDate(delta) {
    const d = new Date(this.selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + delta);
    const next = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    // 未来日は今日まで
    if (next > todayStr()) return;
    this.selectedDate = next;
    document.getElementById('record-date').value = next;
    this.loadForDate(next);
  },

  showMessage() {
    const msgs = t('gentleMessages');
    document.getElementById('gentle-message').textContent = msgs[Math.floor(Math.random() * msgs.length)];
  },

  getWeight() { return this.currentWeight; },
  getDate() { return this.selectedDate; },
};

// ===== 保存処理 =====
function saveRecord() {
  const weight = WeightInput.getWeight();
  const memo = document.getElementById('memo-input').value.trim();
  const dateStr = WeightInput.getDate();
  const records = Store.getRecords();
  const existing = records.find(r => r.date === dateStr);

  if (existing) {
    const confirmed = confirm(t('confirmOverwrite', formatDateFull(dateStr)));
    if (!confirmed) return;
    existing.weight = weight;
    existing.memo = memo;
    existing.updatedAt = new Date().toISOString();
  } else {
    records.push({
      id: generateId(),
      date: dateStr,
      weight,
      memo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  Store.saveRecords(records);
  WeightInput.lastWeight = weight;
  WeightInput.updateLabel(dateStr, true);

  const plusMsgs = t('saveMsgPlus');
  const genMsgs = t('gentleMessages');
  const sorted = Store.getRecords().sort((a,b) => a.date.localeCompare(b.date));
  const idx = sorted.findIndex(r => r.date === dateStr);
  const prev = sorted[idx - 1];
  const isPlus = prev && weight - prev.weight > 0.2;
  document.getElementById('gentle-message').textContent =
    isPlus ? plusMsgs[Math.floor(Math.random() * plusMsgs.length)]
           : genMsgs[Math.floor(Math.random() * genMsgs.length)];

  showToast(t('toastSaved'));
  refreshAll();
}

// ===== 統計計算 =====
function calcStats(records) {
  const sorted = [...records].sort((a,b) => a.date.localeCompare(b.date));
  const cutoff7 = new Date(); cutoff7.setDate(cutoff7.getDate() - 6);
  const last7 = sorted.filter(r => r.date >= cutoff7.toISOString().slice(0,10));
  const avg7 = last7.length ? last7.reduce((s,r) => s+r.weight, 0) / last7.length : null;

  // 連続記録
  let streak = 0;
  const now = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(now); d.setDate(now.getDate() - i);
    const s = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (sorted.find(r => r.date === s)) streak++; else break;
  }

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
        { label: t('legendRaw'), data: weights, borderColor: colors.blue, borderWidth: 1.5, pointRadius: 3, pointBackgroundColor: colors.blue, tension: 0.3, fill: false, order: 2 },
        { label: t('legend7avg'), data: avgs, borderColor: colors.green, borderWidth: 3, pointRadius: 0, tension: 0.4, fill: { target: 'origin', above: 'rgba(76,175,130,0.07)' }, order: 1 },
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
        callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}kg` },
      },
    },
    scales: {
      x: { ticks: { color: colors.textColor, font: { size: 10, family: "'M PLUS Rounded 1c'" } }, grid: { color: colors.gridColor } },
      y: { ticks: { color: colors.textColor, font: { size: 10, family: "'M PLUS Rounded 1c'" }, callback: v => `${v.toFixed(1)}` }, grid: { color: colors.gridColor } },
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
        { label: t('legendRaw'), data: weights, borderColor: colors.blue, borderWidth: 1.5, pointRadius: 3, pointBackgroundColor: colors.blue, tension: 0.3, fill: false, order: 2 },
        { label: t('legend7avg'), data: avgs, borderColor: colors.green, borderWidth: 3.5, pointRadius: 0, tension: 0.4, fill: { target: 'origin', above: 'rgba(76,175,130,0.07)' }, order: 1 },
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
          callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}kg` },
        },
      },
      scales: {
        x: { ticks: { color: colors.textColor, font: { size: 11, family: "'M PLUS Rounded 1c'" }, maxRotation: 45 }, grid: { color: colors.gridColor } },
        y: { ticks: { color: colors.textColor, font: { size: 11, family: "'M PLUS Rounded 1c'" }, callback: v => `${v.toFixed(1)}kg` }, grid: { color: colors.gridColor } },
      },
    },
  });
  renderStatsGrid(filtered);
}

function renderStatsGrid(filtered) {
  const weights = filtered.map(r => r.weight);
  if (!weights.length) {
    document.getElementById('stats-grid').innerHTML = `<div style="color:var(--text-sub)">${t('historyEmpty')}</div>`;
    return;
  }
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const avg = weights.reduce((s,v)=>s+v,0)/weights.length;
  const minR = filtered.find(r=>r.weight===min);
  const maxR = filtered.find(r=>r.weight===max);
  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-item"><div class="stat-item-label">${t('statMin')}</div><div class="stat-item-value">${min.toFixed(1)}kg <small style="font-size:.72rem;color:var(--text-sub)">${formatDate(minR?.date||'')}</small></div></div>
    <div class="stat-item"><div class="stat-item-label">${t('statMax')}</div><div class="stat-item-value">${max.toFixed(1)}kg <small style="font-size:.72rem;color:var(--text-sub)">${formatDate(maxR?.date||'')}</small></div></div>
    <div class="stat-item"><div class="stat-item-label">${t('statAvg')}</div><div class="stat-item-value">${avg.toFixed(1)}kg</div></div>
    <div class="stat-item"><div class="stat-item-label">${t('statCount')}</div><div class="stat-item-value">${filtered.length}</div></div>
  `;
}

// ===== ホームサマリー =====
function updateHomeSummary(records) {
  const { avg7, streak, goalDiff } = calcStats(records);
  document.getElementById('avg7').textContent = avg7 != null ? avg7.toFixed(1) : '—';
  document.getElementById('streak').textContent = streak;
  if (goalDiff != null) {
    document.getElementById('goal-diff').textContent = (goalDiff > 0 ? '+' : '') + goalDiff.toFixed(1);
    document.getElementById('goal-diff-unit').textContent = 'kg';
  } else {
    document.getElementById('goal-diff').textContent = '—';
    document.getElementById('goal-diff-unit').textContent = t('goalNotSet');
  }
}

// ===== 週間ふり返り =====
function updateWeeklySummary(records) {
  const sorted = [...records].sort((a,b) => a.date.localeCompare(b.date));
  const now = new Date();
  const dow = now.getDay();
  const thisMonday = new Date(now); thisMonday.setDate(now.getDate() - ((dow + 6) % 7));
  const lastMonday = new Date(thisMonday); lastMonday.setDate(thisMonday.getDate() - 7);
  const thisSunday = new Date(thisMonday); thisSunday.setDate(thisMonday.getDate() + 6);
  const lastSunday = new Date(lastMonday); lastSunday.setDate(lastMonday.getDate() + 6);
  const toStr = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  const thisWeek = sorted.filter(r => r.date >= toStr(thisMonday) && r.date <= toStr(thisSunday));
  const lastWeek = sorted.filter(r => r.date >= toStr(lastMonday) && r.date <= toStr(lastSunday));
  const thisAvg = thisWeek.length ? thisWeek.reduce((s,r)=>s+r.weight,0)/thisWeek.length : null;
  const lastAvg = lastWeek.length ? lastWeek.reduce((s,r)=>s+r.weight,0)/lastWeek.length : null;
  const weekDiff = thisAvg != null && lastAvg != null ? thisAvg - lastAvg : null;

  let trend = t('trendFlat');
  let trendClass = 'trend-flat';
  if (weekDiff != null) {
    if (weekDiff < -0.3) { trend = t('trendDown'); trendClass = 'trend-down'; }
    else if (weekDiff > 0.3) { trend = t('trendUp'); trendClass = 'trend-up'; }
  }

  document.getElementById('weekly-summary').innerHTML = `
    <div class="weekly-item"><div class="weekly-item-label">${t('thisWeekAvg')}</div><div class="weekly-item-value">${thisAvg != null ? thisAvg.toFixed(1)+'kg' : '—'}</div></div>
    <div class="weekly-item"><div class="weekly-item-label">${t('lastWeekDiff')}</div><div class="weekly-item-value">${weekDiff != null ? (weekDiff>0?'+':'')+weekDiff.toFixed(1)+'kg' : '—'}</div></div>
    <div class="weekly-item"><div class="weekly-item-label">${t('thisWeekDays')}</div><div class="weekly-item-value">${thisWeek.length}${Lang.current === 'ja' ? '日' : 'd'}</div></div>
    <div class="weekly-item"><div class="weekly-item-label">${t('trend')}</div><div class="weekly-item-value"><span class="trend-badge ${trendClass}">${trend}</span></div></div>
  `;
}

// ===== カレンダー =====
const Calendar = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  render(records) {
    const recordDates = new Set(records.map(r => r.date));
    const today = todayStr();
    const dayNames = t('calDayNames');
    const title = Lang.current === 'ja'
      ? `${this.year}年${this.month + 1}月`
      : `${new Date(this.year, this.month).toLocaleString('en', {month:'long'})} ${this.year}`;
    document.getElementById('cal-title').textContent = title;

    const first = new Date(this.year, this.month, 1);
    const last = new Date(this.year, this.month + 1, 0);
    const startDow = first.getDay();

    let html = dayNames.map(d => `<div class="cal-day-name">${d}</div>`).join('');
    for (let i = 0; i < startDow; i++) {
      const prev = new Date(this.year, this.month, -startDow + i + 1);
      html += `<div class="cal-day other-month">${prev.getDate()}</div>`;
    }
    for (let d = 1; d <= last.getDate(); d++) {
      const ds = `${this.year}-${String(this.month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      let cls = 'cal-day';
      if (recordDates.has(ds)) cls += ' has-record';
      if (ds === today) cls += ' today';
      html += `<div class="${cls}">${d}</div>`;
    }
    document.getElementById('calendar-grid').innerHTML = html;
  },
  prev(records) { if (this.month === 0) { this.month = 11; this.year--; } else this.month--; this.render(records); },
  next(records) { if (this.month === 11) { this.month = 0; this.year++; } else this.month++; this.render(records); },
};

// ===== 記録一覧 =====
function renderHistory(records) {
  const sorted = [...records].sort((a,b) => b.date.localeCompare(a.date));
  const list = document.getElementById('history-list');
  const empty = document.getElementById('history-empty');
  if (!sorted.length) { list.innerHTML = ''; empty.style.display = ''; return; }
  empty.style.display = 'none';

  list.innerHTML = sorted.map((r, i) => {
    const prev = sorted[i + 1];
    const diff = prev ? r.weight - prev.weight : null;
    const diffCls = diff == null ? '' : diff > 0 ? 'plus' : diff < 0 ? 'minus' : '';
    const diffStr = diff == null ? '—' : (diff > 0 ? '+' : '') + diff.toFixed(1) + 'kg';
    const memoText = r.memo ? ` · ${r.memo}` : '';
    return `
      <div class="history-item" data-id="${r.id}">
        <div class="hist-date">${formatDateFull(r.date)}</div>
        <div class="hist-main">
          <div class="hist-weight">${r.weight.toFixed(1)}<span>kg</span></div>
          <div class="hist-diff ${diffCls}">${diffStr}${memoText}</div>
        </div>
        <div class="hist-actions">
          <button class="btn-hist" onclick="openEditModal('${r.id}')">${t('editBtn')}</button>
          <button class="btn-hist btn-hist-del" onclick="deleteRecord('${r.id}')">${t('deleteBtn')}</button>
        </div>
      </div>`;
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
  let label = bmi < 18.5 ? t('bmiUnderweight') : bmi < 25 ? t('bmiNormal') : bmi < 30 ? t('bmiObese1') : t('bmiObese2');
  info.innerHTML = `BMI: <strong>${bmi.toFixed(1)}</strong>（${label}）　${Lang.current === 'ja' ? '標準体重' : 'Standard'}: <strong>${std.toFixed(1)}kg</strong>`;
}

// ===== 編集モーダル =====
function openEditModal(id) {
  const r = Store.getRecords().find(r => r.id === id);
  if (!r) return;
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-date').value = r.date;
  document.getElementById('edit-weight').value = r.weight.toFixed(1);
  document.getElementById('edit-memo').value = r.memo || '';
  document.getElementById('edit-modal').style.display = 'flex';
}
function closeEditModal() { document.getElementById('edit-modal').style.display = 'none'; }
function saveEditModal() {
  const id = document.getElementById('edit-id').value;
  const date = document.getElementById('edit-date').value;
  const weight = parseWeight(document.getElementById('edit-weight').value);
  const memo = document.getElementById('edit-memo').value.trim();
  if (!date || weight == null || weight < 20 || weight > 300) { showToast(t('toastInvalidInput')); return; }
  const records = Store.getRecords();
  const r = records.find(r => r.id === id);
  if (!r) return;
  r.date = date; r.weight = weight; r.memo = memo; r.updatedAt = new Date().toISOString();
  Store.saveRecords(records);
  closeEditModal();
  showToast(t('toastUpdated'));
  refreshAll();
}
function deleteRecord(id) {
  if (!confirm(t('confirmDelete'))) return;
  Store.saveRecords(Store.getRecords().filter(r => r.id !== id));
  showToast(t('toastDeleted'));
  refreshAll();
}

// ===== マニュアルモーダル =====
function openManual() {
  const sections = t('manualSections');
  document.getElementById('manual-content').innerHTML = sections.map(s => `
    <div class="manual-section">
      <h4>${s.icon} ${s.title}</h4>
      <ul>${s.items.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>`).join('');
  document.getElementById('manual-modal').style.display = 'flex';
}
function closeManual() { document.getElementById('manual-modal').style.display = 'none'; }

// ===== CSV =====
function exportCSV() {
  const records = Store.getRecords().sort((a,b) => a.date.localeCompare(b.date));
  if (!records.length) { showToast(t('toastNoData')); return; }
  const header = 'id,date,weight,memo,createdAt,updatedAt';
  const rows = records.map(r => [r.id, r.date, r.weight, `"${(r.memo||'').replace(/"/g,'""')}"`, r.createdAt, r.updatedAt].join(','));
  const csv = '\uFEFF' + [header, ...rows].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  a.download = `weight_${todayStr()}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast(t('toastExported'));
}
function importCSV(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const text = e.target.result.replace(/^\uFEFF/, '');
      const lines = text.split(/\r?\n/).filter(Boolean);
      const header = lines[0].toLowerCase();
      if (!header.includes('date') || !header.includes('weight')) { showToast(t('toastInvalidCSV')); return; }
      const cols = header.split(',');
      const dIdx = cols.indexOf('date'), wIdx = cols.indexOf('weight'), mIdx = cols.indexOf('memo');
      const records = Store.getRecords();
      let added = 0;
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        const date = parts[dIdx]?.trim();
        const weight = parseFloat(parts[wIdx]);
        const memo = (parts[mIdx] || '').replace(/^"|"$/g, '').trim();
        if (!date || isNaN(weight)) continue;
        if (!records.find(r => r.date === date)) {
          records.push({ id: generateId(), date, weight, memo, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
          added++;
        }
      }
      Store.saveRecords(records);
      showToast(t('toastImported', added));
      refreshAll();
    } catch { showToast(t('toastImportFail')); }
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
  // 日付に対応したラベルも再更新
  const existing = records.find(r => r.date === WeightInput.selectedDate);
  WeightInput.updateLabel(WeightInput.selectedDate, !!existing);
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
  Lang.init();
  WeightInput.init();
  refreshAll();

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
    const records = Store.getRecords();
    renderMiniChart(records);
    renderMainChart(records, currentRange);
  });

  // 言語
  document.getElementById('btn-lang').addEventListener('click', () => {
    Lang.toggle();
    // 入力カードのラベルも再描画
    WeightInput.updateDiff();
    WeightInput.showMessage();
  });

  // マニュアル
  document.getElementById('btn-manual').addEventListener('click', openManual);
  document.getElementById('btn-manual-close').addEventListener('click', closeManual);
  document.getElementById('manual-modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeManual(); });

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

  // 設定
  document.getElementById('btn-save-goal').addEventListener('click', () => {
    const v = parseWeight(document.getElementById('goal-input').value);
    if (v == null || v < 20 || v > 300) { showToast(t('toastInvalidInput')); return; }
    Store.setGoal(v);
    showToast(t('toastGoalSaved'));
    refreshAll();
  });
  document.getElementById('btn-save-height').addEventListener('click', () => {
    const v = parseWeight(document.getElementById('height-input').value);
    if (v == null || v < 100 || v > 250) { showToast(t('toastInvalidInput')); return; }
    Store.setHeight(v);
    showToast(t('toastHeightSaved'));
    updateBMI();
  });

  // CSV
  document.getElementById('btn-export').addEventListener('click', exportCSV);
  document.getElementById('csv-import').addEventListener('change', e => { importCSV(e.target.files[0]); e.target.value = ''; });

  // 全削除
  document.getElementById('btn-clear-all').addEventListener('click', () => {
    if (!confirm(t('confirmClearAll'))) return;
    Store.saveRecords([]);
    showToast(t('toastAllDeleted'));
    location.reload();
  });

  // 編集モーダル
  document.getElementById('btn-edit-cancel').addEventListener('click', closeEditModal);
  document.getElementById('btn-edit-save').addEventListener('click', saveEditModal);
  document.getElementById('edit-modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeEditModal(); });
}

document.addEventListener('DOMContentLoaded', init);

// ===== Service Worker 登録 =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}
