/**
 * カウントダウンアプリ - メインスクリプト
 *
 * 設計方針:
 *   - 1秒ごとの setInterval でカウントダウンを更新
 *   - 現在アクティブな表示スタイルのレンダラーのみ実行（CPU節約）
 *   - フリップアニメーションは数字が変わる瞬間のみ実行（不要な描画を排除）
 *   - データ管理・描画・PWA登録を関数単位で分離
 */

'use strict';

/* ============================================================
   1. 定数
============================================================ */
const STORAGE_KEY = 'countdown_app_v1';

const CATEGORIES = {
  other:       { label: 'その他',     color: '#8b5cf6' },
  work:        { label: '仕事',       color: '#3b82f6' },
  private:     { label: 'プライベート', color: '#10b981' },
  anniversary: { label: '記念日',     color: '#f59e0b' },
};

// SVGリングの円周 (2 * π * r)
const RING_R_OUTER = 90;
const RING_R_INNER = 68;
const RING_CIRC_OUTER = 2 * Math.PI * RING_R_OUTER; // ≈ 565.49
const RING_CIRC_INNER = 2 * Math.PI * RING_R_INNER; // ≈ 427.26

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

/* ============================================================
   2. アプリ状態
============================================================ */
let state = {
  events: [],
  selectedEventId: null,
  displayStyle: 'digital',
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  animationEnabled: true,
  sortOrder: 'nearest',
};

// フリップ時計: 前フレームの値（変化があった時のみアニメーション発火）
const flipPrev = { Days: null, Hours: null, Minutes: null, Seconds: null };

// 更新タイマーID
let updateIntervalId = null;

// 削除対象のイベントID
let deleteTargetId = null;

/* ============================================================
   3. ストレージ
============================================================ */
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('[Storage] 保存失敗:', e);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // マージ（新しいキーがあってもデフォルト値を保持）
      state = { ...state, ...parsed };
    }
  } catch (e) {
    console.warn('[Storage] 読込失敗:', e);
  }
}

/* ============================================================
   4. イベント CRUD
============================================================ */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function addEvent(data) {
  const evt = {
    id:         generateId(),
    name:       data.name,
    targetDate: data.date,
    targetTime: data.time || '',
    memo:       data.memo || '',
    category:   data.category || 'other',
    color:      data.color || '#6366f1',
    createdAt:  data.createdAt || Date.now(),
  };
  state.events.push(evt);
  if (!state.selectedEventId) state.selectedEventId = evt.id;
  saveState();
  return evt;
}

function updateEvent(id, data) {
  const idx = state.events.findIndex(e => e.id === id);
  if (idx === -1) return;
  state.events[idx] = {
    ...state.events[idx],
    name:       data.name,
    targetDate: data.date,
    targetTime: data.time || '',
    memo:       data.memo || '',
    category:   data.category || 'other',
    color:      data.color || state.events[idx].color,
  };
  saveState();
}

function deleteEvent(id) {
  state.events = state.events.filter(e => e.id !== id);
  if (state.selectedEventId === id) {
    state.selectedEventId = state.events.length > 0 ? state.events[0].id : null;
  }
  saveState();
}

function getSelectedEvent() {
  return state.events.find(e => e.id === state.selectedEventId) || null;
}

/* ============================================================
   5. カウントダウン計算
   全ての描画モードはこの結果オブジェクトを受け取る
============================================================ */
function calculateCountdown(evt) {
  const now = Date.now();

  // 目標タイムスタンプ（時刻未指定なら 23:59:59 扱い）
  const dtStr = evt.targetTime
    ? `${evt.targetDate}T${evt.targetTime}:00`
    : `${evt.targetDate}T23:59:59`;
  const target = new Date(dtStr).getTime();
  if (isNaN(target)) {
    return { days:0, hours:0, minutes:0, seconds:0, totalMs:0, totalSeconds:0,
             isPast:false, isToday:false, isUrgent:false,
             percentComplete:0, percentRemaining:100, target };
  }

  const diff    = target - now;
  const isPast  = diff < 0;
  const absDiff = Math.abs(diff);

  const totalSeconds = Math.floor(absDiff / 1000);
  const days    = Math.floor(totalSeconds / 86400);
  const hours   = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // 今日かどうか
  const targetDay = new Date(evt.targetDate);
  const today     = new Date();
  const isToday   = targetDay.toDateString() === today.toDateString();

  // 残り24時間未満（かつ今日でもない）
  const isUrgent = !isPast && !isToday && days === 0;

  // バー表示用: 登録日→目標日の進捗率
  const start    = evt.createdAt || (target - 86400000 * 30);
  const span     = target - start;
  const elapsed  = now - start;
  const percentComplete  = span > 0 ? Math.min(100, Math.max(0, (elapsed / span) * 100)) : 0;
  const percentRemaining = Math.max(0, 100 - percentComplete);

  return { days, hours, minutes, seconds, totalMs: absDiff, totalSeconds,
           isPast, isToday, isUrgent, percentComplete, percentRemaining, target };
}

/* ============================================================
   6. 共通ヘルパー
============================================================ */
function pad2(n) { return String(n).padStart(2, '0'); }

function formatDateJP(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}（${WEEKDAYS[date.getDay()]}）`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getStatusText(cd, evt) {
  if (cd.isToday) return `🎉 本日です！「${evt.name}」の日が来ました！`;
  if (cd.isPast)  return `${cd.days}日 ${pad2(cd.hours)}時間 ${pad2(cd.minutes)}分が経過しました`;
  if (cd.isUrgent) return `⚠️ あと ${pad2(cd.hours)}時間 ${pad2(cd.minutes)}分 ${pad2(cd.seconds)}秒`;
  return `あと ${cd.days}日 ${pad2(cd.hours)}時間 ${pad2(cd.minutes)}分 ${pad2(cd.seconds)}秒`;
}

function getStatusClass(cd) {
  if (cd.isToday)  return 'status-today';
  if (cd.isUrgent) return 'status-urgent';
  if (cd.isPast)   return 'status-past';
  return '';
}

function setStatusEl(id, cd, evt) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = getStatusText(cd, evt);
  el.className = `status-text ${getStatusClass(cd)}`;
}

/* ============================================================
   7a. 描画: デジタル
============================================================ */
function renderDigital(cd) {
  document.querySelector('#dDays .digital-value').textContent    = cd.isPast ? `-${cd.days}` : cd.days;
  document.querySelector('#dHours .digital-value').textContent   = pad2(cd.hours);
  document.querySelector('#dMinutes .digital-value').textContent = pad2(cd.minutes);
  document.querySelector('#dSeconds .digital-value').textContent = pad2(cd.seconds);

  const grid = document.getElementById('digitalGrid');
  grid.classList.toggle('is-past',   cd.isPast);
  grid.classList.toggle('is-urgent', cd.isUrgent);
  grid.classList.toggle('is-today',  cd.isToday);
}

/* ============================================================
   7b. 描画: リング
   外側リング = 全体進捗（残り率）
   内側リング = 秒プログレス（0-59秒）
============================================================ */
function renderRing(cd) {
  const outerPct = cd.isPast ? 0 : cd.percentRemaining / 100;
  const innerPct = cd.isPast ? 0 : cd.seconds / 60;

  const outerOffset = RING_CIRC_OUTER * (1 - outerPct);
  const innerOffset = RING_CIRC_INNER * (1 - innerPct);

  const rp  = document.getElementById('ringProgress');
  const rsp = document.getElementById('ringSecProgress');
  if (rp)  rp.style.strokeDashoffset  = outerOffset;
  if (rsp) rsp.style.strokeDashoffset = innerOffset;

  const cls = getStatusClass(cd);
  if (rp) {
    rp.classList.remove('is-today', 'is-urgent', 'is-past');
    if (cls) rp.classList.add(cls);
  }

  const ringDays = document.getElementById('ringDays');
  const ringTime = document.getElementById('ringTime');
  if (ringDays) ringDays.textContent = cd.isPast ? `-${cd.days}` : cd.days;
  if (ringTime) ringTime.textContent = `${pad2(cd.hours)}:${pad2(cd.minutes)}:${pad2(cd.seconds)}`;
}

/* ============================================================
   7c. 描画: アナログ
   3本針で残り時間を視覚化:
     日針  (太):  30日サイクル  → days % 30 / 30 * 360°
     時針  (中):  24時間サイクル → hours / 24 * 360°
     分針  (細):  60分サイクル  → (minutes + seconds/60) / 60 * 360°
============================================================ */
function renderAnalog(cd) {
  const dayAngle  = (cd.days  % 30) / 30 * 360;
  const hourAngle = cd.hours / 24 * 360;
  const minAngle  = (cd.minutes + cd.seconds / 60) / 60 * 360;

  const setRotate = (id, deg) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute('transform', `rotate(${deg.toFixed(2)}, 120, 120)`);
  };

  setRotate('analogDayHand',  dayAngle);
  setRotate('analogHourHand', hourAngle);
  setRotate('analogMinHand',  minAngle);

  const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setVal('analogDaysVal',  cd.isPast ? `-${cd.days}` : cd.days);
  setVal('analogHoursVal', pad2(cd.hours));
  setVal('analogMinsVal',  pad2(cd.minutes));
  setVal('analogSecsVal',  pad2(cd.seconds));
}

/* ============================================================
   7d. 描画: バー
   登録日から目標日までの進捗率をバーで表示
============================================================ */
function renderBar(cd, evt) {
  const pct    = cd.isPast ? 100 : cd.percentComplete;
  const fill   = document.getElementById('barFill');
  if (fill) {
    fill.style.width = `${pct.toFixed(1)}%`;
    fill.classList.remove('is-today', 'is-urgent', 'is-past');
    const cls = getStatusClass(cd);
    if (cls) fill.classList.add(cls);
  }

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('barPercent',   `${Math.round(pct)}%`);
  set('barMainValue', cd.isPast ? `${cd.days}日経過` : `あと ${cd.days}日`);
  set('barTimeValue', `${pad2(cd.hours)}:${pad2(cd.minutes)}:${pad2(cd.seconds)}`);
  set('barDays',  cd.isPast ? `-${cd.days}` : cd.days);
  set('barHours', pad2(cd.hours));
  set('barMins',  pad2(cd.minutes));
  set('barSecs',  pad2(cd.seconds));

  const startDate = new Date(evt.createdAt);
  const endDate   = new Date(evt.targetDate);
  set('barStartDate', formatDateJP(startDate));
  set('barEndDate',   formatDateJP(endDate));
}

/* ============================================================
   7e. 描画: フリップ時計
   数字が変わる瞬間だけ CSS 3D アニメーションを発火。
   変化がない場合は何もしない（CPU節約）。
============================================================ */
function renderFlip(cd) {
  const vals = {
    Days:    String(cd.isPast ? cd.days : cd.days),
    Hours:   pad2(cd.hours),
    Minutes: pad2(cd.minutes),
    Seconds: pad2(cd.seconds),
  };

  for (const [unit, newVal] of Object.entries(vals)) {
    if (flipPrev[unit] === newVal) continue; // 変化なし → 処理スキップ

    const topEl       = document.getElementById(`flip${unit}Top`);
    const bottomEl    = document.getElementById(`flip${unit}Bottom`);
    const animTopEl   = document.getElementById(`flip${unit}AnimTop`);
    const animBottomEl= document.getElementById(`flip${unit}AnimBottom`);
    if (!topEl) continue;

    const oldVal = topEl.querySelector('span').textContent;

    if (state.animationEnabled) {
      // アニメーション有効: フリップアニメーション実行
      animTopEl.querySelector('span').textContent    = oldVal;
      animBottomEl.querySelector('span').textContent = newVal;

      // クラスをいったん外してリフロー → アニメーション再生
      animTopEl.classList.remove('flipping-top');
      animBottomEl.classList.remove('flipping-bottom');
      void animTopEl.offsetWidth; // reflow trigger

      animTopEl.classList.add('flipping-top');
      animBottomEl.classList.add('flipping-bottom');

      // 前半終了後: 静的ボトムを新しい値に更新
      setTimeout(() => {
        bottomEl.querySelector('span').textContent = newVal;
      }, 280);

      // 全アニメーション終了後: 静的トップも更新・オーバーレイ非表示
      setTimeout(() => {
        topEl.querySelector('span').textContent = newVal;
        animTopEl.classList.remove('flipping-top');
        animBottomEl.classList.remove('flipping-bottom');
      }, 560);

    } else {
      // アニメーション無効: 静的に即更新
      topEl.querySelector('span').textContent    = newVal;
      bottomEl.querySelector('span').textContent = newVal;
    }

    flipPrev[unit] = newVal;
  }
}

/* ============================================================
   8. メインティック
   1秒ごとに呼ばれる。アクティブなスタイルのレンダラーのみ実行。
============================================================ */
function tick() {
  const evt = getSelectedEvent();

  if (!evt) {
    document.getElementById('noEventMsg').style.display      = 'flex';
    document.getElementById('countdownDisplay').style.display = 'none';
    return;
  }

  document.getElementById('noEventMsg').style.display      = 'none';
  document.getElementById('countdownDisplay').style.display = 'flex';

  const cd = calculateCountdown(evt);

  // イベント情報ヘッダー更新
  const nameEl = document.getElementById('displayEventName');
  if (nameEl) {
    nameEl.textContent = evt.name;
    nameEl.style.color = evt.color;
  }
  const catEl  = document.getElementById('displayCategory');
  const catInfo = CATEGORIES[evt.category] || CATEGORIES.other;
  if (catEl) {
    catEl.textContent = catInfo.label;
    catEl.style.background = catInfo.color + '22';
    catEl.style.color      = catInfo.color;
  }
  const dateEl = document.getElementById('displayDate');
  if (dateEl) {
    const d = new Date(evt.targetDate);
    dateEl.textContent = formatDateJP(d) + (evt.targetTime ? ` ${evt.targetTime}` : '');
  }
  const memoEl = document.getElementById('displayMemo');
  if (memoEl) memoEl.textContent = evt.memo || '';

  // アクティブなスタイルのレンダラーのみ呼ぶ（非表示スタイルはスキップ）
  switch (state.displayStyle) {
    case 'digital': renderDigital(cd); setStatusEl('digitalStatus', cd, evt); break;
    case 'ring':    renderRing(cd);    setStatusEl('ringStatus',    cd, evt); break;
    case 'analog':  renderAnalog(cd);  setStatusEl('analogStatus',  cd, evt); break;
    case 'bar':     renderBar(cd, evt);setStatusEl('barStatus',     cd, evt); break;
    case 'flip':    renderFlip(cd);    setStatusEl('flipStatus',    cd, evt); break;
  }
}

/* ============================================================
   9. イベント一覧レンダリング
============================================================ */
function getSortedEvents() {
  const evts = [...state.events];
  switch (state.sortOrder) {
    case 'nearest': {
      const now = Date.now();
      return evts.sort((a, b) => {
        const ta = new Date(`${a.targetDate}T23:59:59`).getTime();
        const tb = new Date(`${b.targetDate}T23:59:59`).getTime();
        return Math.abs(ta - now) - Math.abs(tb - now);
      });
    }
    case 'name':
      return evts.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
    case 'created':
    default:
      return evts.sort((a, b) => a.createdAt - b.createdAt);
  }
}

function renderEventList() {
  const listEl = document.getElementById('eventList');
  if (!listEl) return;
  const evts = getSortedEvents();

  if (evts.length === 0) {
    listEl.innerHTML = '<div class="event-list-empty">イベントがありません<br>「+ 追加」から登録しましょう</div>';
    return;
  }

  listEl.innerHTML = evts.map(evt => {
    const cd        = calculateCountdown(evt);
    const selected  = evt.id === state.selectedEventId;
    const catInfo   = CATEGORIES[evt.category] || CATEGORIES.other;

    let badge = '', badgeClass = '';
    if (cd.isToday)       { badge = '本日！';              badgeClass = 'badge-today'; }
    else if (cd.isPast)   { badge = `${cd.days}日経過`;    badgeClass = 'badge-past'; }
    else if (cd.isUrgent) { badge = `あと${pad2(cd.hours)}時間`; badgeClass = 'badge-urgent'; }
    else                  { badge = `あと${cd.days}日`;    badgeClass = ''; }

    const itemCls = [
      'event-item',
      selected  ? 'selected'  : '',
      cd.isPast   ? 'is-past'   : '',
      cd.isToday  ? 'is-today'  : '',
      cd.isUrgent ? 'is-urgent' : '',
    ].filter(Boolean).join(' ');

    return `
<div class="${itemCls}" data-id="${evt.id}" onclick="selectEvent('${evt.id}')">
  <div class="event-item-color" style="background:${escapeHtml(evt.color)}"></div>
  <div class="event-item-body">
    <div class="event-item-row1">
      <span class="event-item-name">${escapeHtml(evt.name)}</span>
      <span class="event-item-badge ${badgeClass}">${badge}</span>
    </div>
    <div class="event-item-row2">
      <span class="event-item-date">${escapeHtml(evt.targetDate)}${evt.targetTime ? ' ' + escapeHtml(evt.targetTime) : ''}</span>
      <span class="event-item-cat" style="color:${catInfo.color}">${catInfo.label}</span>
    </div>
    ${evt.memo ? `<div class="event-item-memo">${escapeHtml(evt.memo)}</div>` : ''}
  </div>
  <div class="event-item-actions">
    <button class="icon-btn-sm" onclick="event.stopPropagation();openEditModal('${evt.id}')" title="編集">✏️</button>
    <button class="icon-btn-sm" onclick="event.stopPropagation();openDeleteModal('${evt.id}')" title="削除">🗑️</button>
  </div>
</div>`;
  }).join('');
}

/* グローバルから呼べるようにする */
function selectEvent(id) {
  state.selectedEventId = id;
  saveState();
  renderEventList();
  // フリップの prev をリセット（別イベントの数値で誤アニメーション防止）
  Object.keys(flipPrev).forEach(k => { flipPrev[k] = null; });
  tick();
}

/* ============================================================
   10. モーダル管理
============================================================ */
function openAddModal() {
  document.getElementById('modalTitle').textContent = 'イベントを追加';
  document.getElementById('editId').value   = '';
  document.getElementById('eventName').value = '';
  // デフォルト: 7日後
  const d = new Date();
  d.setDate(d.getDate() + 7);
  document.getElementById('eventDate').value     = d.toISOString().split('T')[0];
  document.getElementById('eventTime').value     = '';
  document.getElementById('eventMemo').value     = '';
  document.getElementById('eventCategory').value = 'other';
  document.getElementById('eventColor').value    = '#6366f1';
  clearFormErrors();
  document.getElementById('eventModal').style.display = 'flex';
  setTimeout(() => document.getElementById('eventName').focus(), 100);
}

function openEditModal(id) {
  const evt = state.events.find(e => e.id === id);
  if (!evt) return;
  document.getElementById('modalTitle').textContent = 'イベントを編集';
  document.getElementById('editId').value           = id;
  document.getElementById('eventName').value        = evt.name;
  document.getElementById('eventDate').value        = evt.targetDate;
  document.getElementById('eventTime').value        = evt.targetTime || '';
  document.getElementById('eventMemo').value        = evt.memo || '';
  document.getElementById('eventCategory').value   = evt.category || 'other';
  document.getElementById('eventColor').value      = evt.color || '#6366f1';
  clearFormErrors();
  document.getElementById('eventModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('eventModal').style.display = 'none';
}

function openDeleteModal(id) {
  const evt = state.events.find(e => e.id === id);
  if (!evt) return;
  deleteTargetId = id;
  document.getElementById('deleteConfirmText').textContent =
    `「${evt.name}」を削除しますか？この操作は元に戻せません。`;
  document.getElementById('deleteModal').style.display = 'flex';
}

function closeDeleteModal() {
  deleteTargetId = null;
  document.getElementById('deleteModal').style.display = 'none';
}

function clearFormErrors() {
  ['nameError', 'dateError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  ['eventName', 'eventDate'].forEach(id => {
    document.getElementById(id)?.classList.remove('error');
  });
}

/* ============================================================
   11. 表示スタイル切替
   非表示のスタイルコンテナを display:none にするだけで
   そのレンダラーは tick() から呼ばれなくなる（最適化）
============================================================ */
const STYLES = ['digital', 'ring', 'analog', 'bar', 'flip'];

function switchStyle(style) {
  if (!STYLES.includes(style)) return;
  state.displayStyle = style;
  saveState();

  // タブボタンの active 切替
  document.querySelectorAll('.style-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.style === style);
    btn.setAttribute('aria-selected', btn.dataset.style === style);
  });

  // スタイルコンテナの表示切替
  STYLES.forEach(s => {
    const el = document.getElementById(`style${s.charAt(0).toUpperCase() + s.slice(1)}`);
    if (el) el.style.display = s === style ? 'flex' : 'none';
  });

  // フリップ prev をリセット
  if (style === 'flip') {
    Object.keys(flipPrev).forEach(k => { flipPrev[k] = null; });
  }

  tick();
}

/* ============================================================
   12. ダークモード & アニメーション切替
============================================================ */
function applyDarkMode() {
  document.documentElement.classList.toggle('dark', state.darkMode);
  const btn = document.getElementById('darkToggle');
  if (btn) { btn.textContent = state.darkMode ? '☀️' : '🌙'; btn.title = state.darkMode ? 'ライトモード' : 'ダークモード'; }
}

function toggleDarkMode() {
  state.darkMode = !state.darkMode;
  applyDarkMode();
  saveState();
}

function applyAnimationState() {
  const btn = document.getElementById('animToggle');
  if (btn) {
    btn.textContent = state.animationEnabled ? '✨' : '⏸️';
    btn.title = state.animationEnabled ? 'アニメーションON' : 'アニメーションOFF';
  }
}

function toggleAnimation() {
  state.animationEnabled = !state.animationEnabled;
  applyAnimationState();
  saveState();
}

/* ============================================================
   13. SVG 初期化
============================================================ */
function initRingSvg() {
  // dasharray をセット（JSで行うことでSVG属性をHTML側に書かずに済む）
  const outer = document.getElementById('ringProgress');
  const inner = document.getElementById('ringSecProgress');
  if (outer) {
    outer.style.strokeDasharray  = `${RING_CIRC_OUTER} ${RING_CIRC_OUTER}`;
    outer.style.strokeDashoffset = RING_CIRC_OUTER;
  }
  if (inner) {
    inner.style.strokeDasharray  = `${RING_CIRC_INNER} ${RING_CIRC_INNER}`;
    inner.style.strokeDashoffset = RING_CIRC_INNER;
  }
}

function initAnalogMarks() {
  const g = document.getElementById('analogMarks');
  if (!g) return;
  let html = '';
  for (let i = 0; i < 12; i++) {
    const rad = i * 30 * (Math.PI / 180);
    const major = i % 3 === 0;
    const r1  = 104;
    const r2  = major ? 88 : 96;
    const x1  = (120 + r1 * Math.sin(rad)).toFixed(2);
    const y1  = (120 - r1 * Math.cos(rad)).toFixed(2);
    const x2  = (120 + r2 * Math.sin(rad)).toFixed(2);
    const y2  = (120 - r2 * Math.cos(rad)).toFixed(2);
    html += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="analog-mark${major ? ' analog-mark-major' : ''}"/>`;
  }
  g.innerHTML = html;
}

/* ============================================================
   14. サンプルデータ（初回のみ）
============================================================ */
function createSampleData() {
  const now = new Date();

  // 誕生日: 2ヶ月後
  const bday = new Date(now);
  bday.setMonth(bday.getMonth() + 2);
  bday.setDate(15);

  // 旅行: 30日後
  const trip = new Date(now);
  trip.setDate(trip.getDate() + 30);

  addEvent({
    name: '誕生日',
    date: bday.toISOString().split('T')[0],
    time: '00:00',
    memo: 'プレゼントの準備を忘れずに！',
    category: 'anniversary',
    color: '#f59e0b',
  });
  addEvent({
    name: '旅行',
    date: trip.toISOString().split('T')[0],
    time: '09:00',
    memo: '荷物の準備・ホテル確認',
    category: 'private',
    color: '#10b981',
  });

  state.selectedEventId = state.events[0]?.id || null;
  saveState();
}

/* ============================================================
   15. PWA サービスワーカー登録
============================================================ */
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg  => console.log('[PWA] SW 登録完了:', reg.scope))
      .catch(err => console.warn('[PWA] SW 登録失敗:', err));
  });
}

/* ============================================================
   16. 初期化
============================================================ */
function init() {
  loadState();

  // ダーク / アニメーション状態を適用
  applyDarkMode();
  applyAnimationState();

  // SVG初期化
  initRingSvg();
  initAnalogMarks();

  // サンプルデータ（初回のみ）
  if (state.events.length === 0) createSampleData();

  // UI設定を反映
  document.getElementById('sortSelect').value = state.sortOrder;

  // 表示スタイル適用（内部で tick() も呼ぶ）
  switchStyle(state.displayStyle);

  // イベント一覧レンダリング
  renderEventList();

  // ===== 更新ループ =====
  // 1秒ごとにカウントダウン更新（アクティブなスタイルのみ描画）
  updateIntervalId = setInterval(() => {
    tick();
    // イベントバッジも10秒ごとに更新（毎秒は不要）
    if (Date.now() % 10000 < 1100) renderEventList();
  }, 1000);

  // ===== イベントリスナー =====

  document.getElementById('addEventBtn')
    .addEventListener('click', openAddModal);
  document.getElementById('noEventAddBtn')
    .addEventListener('click', openAddModal);
  document.getElementById('darkToggle')
    .addEventListener('click', toggleDarkMode);
  document.getElementById('animToggle')
    .addEventListener('click', toggleAnimation);

  document.getElementById('sortSelect').addEventListener('change', e => {
    state.sortOrder = e.target.value;
    saveState();
    renderEventList();
  });

  document.querySelectorAll('.style-tab').forEach(btn => {
    btn.addEventListener('click', () => switchStyle(btn.dataset.style));
  });

  // フォーム送信
  document.getElementById('eventForm').addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('eventName').value.trim();
    const date = document.getElementById('eventDate').value;

    if (!name) {
      document.getElementById('nameError').textContent = 'イベント名を入力してください';
      document.getElementById('eventName').classList.add('error');
      valid = false;
    }
    if (!date) {
      document.getElementById('dateError').textContent = '日付を選択してください';
      document.getElementById('eventDate').classList.add('error');
      valid = false;
    }
    if (!valid) return;

    const id   = document.getElementById('editId').value;
    const data = {
      name,
      date,
      time:     document.getElementById('eventTime').value,
      memo:     document.getElementById('eventMemo').value.trim(),
      category: document.getElementById('eventCategory').value,
      color:    document.getElementById('eventColor').value,
    };

    if (id) {
      updateEvent(id, data);
    } else {
      const newEvt = addEvent(data);
      state.selectedEventId = newEvt.id;
      saveState();
    }

    closeModal();
    renderEventList();
    Object.keys(flipPrev).forEach(k => { flipPrev[k] = null; });
    tick();
  });

  // カラープリセット
  document.querySelectorAll('.color-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('eventColor').value = btn.dataset.color;
    });
  });

  // 削除確認
  document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if (deleteTargetId) {
      deleteEvent(deleteTargetId);
      closeDeleteModal();
      renderEventList();
      tick();
    }
  });

  // ESC でモーダルを閉じる
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      closeDeleteModal();
    }
  });

  // PWA 登録
  registerServiceWorker();
}

// DOMContentLoaded を待って初期化
document.addEventListener('DOMContentLoaded', init);
