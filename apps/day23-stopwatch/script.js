/* =============================================
   CONSTANTS
   ============================================= */
const CIRCUMFERENCE   = 552.92; // 2π × 88
const RING_CYCLE_MS   = 10000;  // Normal mode: 10s per ring cycle
const HOLD_DURATION   = 400;    // unused (kept for future use)
const SWIPE_THRESHOLD = 50;     // px to trigger swipe

/* =============================================
   STORAGE KEYS
   ============================================= */
const KEYS = {
  theme:    'sw23_theme',
  lastDark: 'sw23_last_dark',
  hint:     'sw23_hint_done',
  nHistory: 'sw23_normal_hist',
  cHistory: 'sw23_challenge_hist',
  cTarget:  'sw23_target',
};

const DARK_THEMES = new Set(['sports', 'neon', 'lab']);

/* =============================================
   STATE
   ============================================= */
let currentMode = 0; // 0: normal, 1: challenge
let theme = 'simple';

// Normal mode state
const n = {
  running: false,
  startTime: 0,
  elapsed: 0,
  laps: [],      // [{split, total}]
  rafId: null,
};

// Challenge mode state
const c = {
  running: false,
  startTime: 0,
  elapsed: 0,
  target: 5.00,  // seconds (float)
  history: [],   // [{target, actual, diff, judge, date}]
  rafId: null,
  hasResult: false,
};

// Hold-to-stop state
const hold = { timer: null, rafId: null, start: 0, btn: null };

/* =============================================
   ELEMENT REFS
   ============================================= */
const app = document.getElementById('app');

// Normal mode
const normalRing     = document.getElementById('normalRing');
const normalRingWrap = document.getElementById('normalRingWrap');
const normalTime     = document.getElementById('normalTime');
const normalStatus   = document.getElementById('normalStatus');
const lapCountEl     = document.getElementById('lapCount');
const lastLapTime    = document.getElementById('lastLapTime');
const bestLapTime    = document.getElementById('bestLapTime');
const lapBtn         = document.getElementById('lapBtn');
const startStopBtn   = document.getElementById('startStopBtn');
const resetBtn       = document.getElementById('resetBtn');
const lapPreviewBar  = document.getElementById('lapPreviewBar');
const lapPreviewText = document.getElementById('lapPreviewText');
const showLapsBtn    = document.getElementById('showLapsBtn');

// Challenge mode
const challengeRing        = document.getElementById('challengeRing');
const challengeRingWrap    = document.getElementById('challengeRingWrap');
const challengeTime        = document.getElementById('challengeTime');
const challengeTargetLabel = document.getElementById('challengeTargetLabel');
const targetArea           = document.getElementById('targetArea');
const targetInput          = document.getElementById('targetInput');
const minusBtn             = document.getElementById('minusBtn');
const plusBtn              = document.getElementById('plusBtn');
const resultPanel          = document.getElementById('resultPanel');
const resultJudge          = document.getElementById('resultJudge');
const rTarget              = document.getElementById('rTarget');
const rActual              = document.getElementById('rActual');
const rDiff                = document.getElementById('rDiff');
const rPrevDiff            = document.getElementById('rPrevDiff');
const resultMsg            = document.getElementById('resultMsg');
const bestBadge            = document.getElementById('bestBadge');
const challengeCount       = document.getElementById('challengeCount');
const bestDiffDisplay      = document.getElementById('bestDiffDisplay');
const lastDiffDisplay      = document.getElementById('lastDiffDisplay');
const retryBtn             = document.getElementById('retryBtn');
const challengeStartBtn    = document.getElementById('challengeStartBtn');
const challengeResetBtn    = document.getElementById('challengeResetBtn');

// Swipe
const swipeWrapper = document.getElementById('swipeWrapper');
const swipeTrack   = document.getElementById('swipeTrack');

// UI indicators
const dots    = document.querySelectorAll('.dot');
const mlabels = document.querySelectorAll('.mlabel');

// Buttons
const themeBtn    = document.getElementById('themeBtn');
const darkModeBtn = document.getElementById('darkModeBtn');
const historyBtn  = document.getElementById('historyBtn');

// Overlays
const themeOverlay   = document.getElementById('themeOverlay');
const themeClose     = document.getElementById('themeClose');
const lapsOverlay    = document.getElementById('lapsOverlay');
const lapsClose      = document.getElementById('lapsClose');
const lapListContent = document.getElementById('lapListContent');
const historyOverlay = document.getElementById('historyOverlay');
const historyClose   = document.getElementById('historyClose');
const historyContent = document.getElementById('historyContent');

// Misc
const swipeHint = document.getElementById('swipeHint');
const toast     = document.getElementById('toast');

/* =============================================
   UTILITIES
   ============================================= */
function fmt(ms) {
  const totalCs = Math.floor(ms / 10);
  const cs  = totalCs % 100;
  const sec = Math.floor(totalCs / 100) % 60;
  const min = Math.floor(totalCs / 6000);
  return `${pad2(min)}:${pad2(sec)}.${pad2(cs)}`;
}

function pad2(n) { return String(n).padStart(2, '0'); }

function fmtDiff(diffSec) {
  if (diffSec === null || diffSec === undefined) return '-';
  const sign = diffSec >= 0 ? '+' : '';
  return `${sign}${diffSec.toFixed(2)}秒`;
}

function fmtSec(sec) { return `${sec.toFixed(2)}秒`; }

function fmtDate(iso) {
  const d = new Date(iso);
  return `${d.getMonth()+1}/${d.getDate()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/* =============================================
   STORAGE
   ============================================= */
function load(key, def) {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : def; }
  catch { return def; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

/* =============================================
   RING UPDATES
   ============================================= */
function updateNormalRing(elapsed) {
  const progress = (elapsed % RING_CYCLE_MS) / RING_CYCLE_MS;
  normalRing.style.strokeDashoffset = CIRCUMFERENCE - progress * CIRCUMFERENCE;
}

function updateChallengeRing(elapsed) {
  const targetMs = c.target * 1000;
  const progress = Math.min(elapsed / targetMs, 1);
  challengeRing.style.strokeDashoffset = CIRCUMFERENCE - progress * CIRCUMFERENCE;
  challengeRing.classList.toggle('over-target', elapsed > targetMs);
}

/* =============================================
   NORMAL MODE
   ============================================= */
function normalTick() {
  n.elapsed = performance.now() - n.startTime;
  normalTime.textContent = fmt(n.elapsed);
  updateNormalRing(n.elapsed);
}

function normalStart() {
  n.startTime = performance.now() - n.elapsed;
  n.running = true;
  clearInterval(n.rafId);
  n.rafId = setInterval(normalTick, 16);
  normalRingWrap.classList.add('running');
  normalStatus.textContent = '計測中';
  setBtn(startStopBtn, 'running', 'STOP');
  lapBtn.disabled   = false;
  resetBtn.disabled = false;
}

function normalStop() {
  clearInterval(n.rafId);
  n.rafId = null;
  n.running = false;
  normalRingWrap.classList.remove('running');
  normalStatus.textContent = '一時停止';
  setBtn(startStopBtn, 'idle', 'START');
  if (n.elapsed > 0) saveNormalHistory();
}

function normalReset() {
  clearInterval(n.rafId);
  Object.assign(n, { running: false, elapsed: 0, laps: [], rafId: null });
  normalRingWrap.classList.remove('running');
  normalTime.textContent   = '00:00.00';
  normalStatus.textContent = '待機中';
  normalRing.style.strokeDashoffset = CIRCUMFERENCE;
  setBtn(startStopBtn, 'idle', 'START');
  lapBtn.disabled      = true;
  resetBtn.disabled    = true;
  lapPreviewBar.style.display = 'none';
  lapCountEl.textContent    = '0';
  lastLapTime.textContent   = '--:--.--';
  bestLapTime.textContent   = '--:--.--';
}

function normalLap() {
  if (!n.running) return;
  // Split = elapsed since last lap (excludes any paused time automatically)
  const prevTotal = n.laps.length > 0 ? n.laps[n.laps.length - 1].total : 0;
  const split = n.elapsed - prevTotal;
  n.laps.push({ split, total: n.elapsed });
  updateLapChips();
}

function updateLapChips() {
  const cnt = n.laps.length;
  lapCountEl.textContent = cnt;
  if (!cnt) return;
  lastLapTime.textContent = fmt(n.laps[cnt - 1].split);
  const best = Math.min(...n.laps.map(l => l.split));
  bestLapTime.textContent = fmt(best);
  lapPreviewText.textContent = `ラップ ${cnt}件`;
  lapPreviewBar.style.display = 'block';
}

function saveNormalHistory() {
  const hist = load(KEYS.nHistory, []);
  hist.unshift({
    date: new Date().toISOString(),
    time: n.elapsed,
    laps: n.laps.length,
    best: n.laps.length ? Math.min(...n.laps.map(l => l.split)) : null,
  });
  if (hist.length > 30) hist.length = 30;
  save(KEYS.nHistory, hist);
}

/* =============================================
   CHALLENGE MODE
   ============================================= */
function challengeTick() {
  c.elapsed = performance.now() - c.startTime;
  challengeTime.textContent = fmt(c.elapsed);
  updateChallengeRing(c.elapsed);
}

function challengeStart() {
  c.startTime = performance.now();
  c.elapsed   = 0;
  c.running   = true;
  c.hasResult = false;
  clearInterval(c.rafId);
  c.rafId = setInterval(challengeTick, 16);
  challengeRingWrap.classList.add('running');
  challengeRing.classList.remove('over-target');
  challengeTargetLabel.textContent = `目標: ${c.target.toFixed(2)}秒`;
  setBtn(challengeStartBtn, 'running', 'STOP');
  targetArea.style.display   = 'none';
  resultPanel.style.display  = 'none';
  retryBtn.style.visibility  = 'hidden';
}

function challengeStop() {
  clearInterval(c.rafId);
  c.rafId = null;
  c.running   = false;
  c.hasResult = true;
  challengeRingWrap.classList.remove('running');
  setBtn(challengeStartBtn, 'idle', 'START');

  const actual  = c.elapsed / 1000;
  const diff    = actual - c.target;
  const absDiff = Math.abs(diff);
  const judge   = getJudge(absDiff);

  // Get previous stats for this target before adding new entry
  const prevStats = getChallengeStats(c.target);
  const isBest = prevStats.count === 0 || absDiff < Math.abs(prevStats.best);

  // Save to history
  c.history.unshift({
    date: new Date().toISOString(),
    target: c.target,
    actual,
    diff,
    judge: judge.label,
  });
  if (c.history.length > 50) c.history.length = 50;
  save(KEYS.cHistory, c.history);

  showResult(judge, actual, diff, prevStats.last, isBest);
  refreshChallengeSubInfo();
}

function challengeReset() {
  clearInterval(c.rafId);
  Object.assign(c, { running: false, elapsed: 0, hasResult: false, rafId: null });
  challengeRingWrap.classList.remove('running');
  challengeRing.classList.remove('over-target');
  challengeRing.style.strokeDashoffset = CIRCUMFERENCE;
  challengeTime.textContent = '00:00.00';
  challengeTargetLabel.textContent = `目標: ${c.target.toFixed(2)}秒`;
  setBtn(challengeStartBtn, 'idle', 'START');
  targetArea.style.display  = '';
  resultPanel.style.display = 'none';
  retryBtn.style.visibility = 'hidden';
}

function getJudge(absDiff) {
  if (absDiff <= 0.02) return { label: '🎉 大成功', cls: 'great', msg: '完璧なタイミング！' };
  if (absDiff <= 0.05) return { label: '✨ 成功',   cls: 'good',  msg: 'すばらしい精度！' };
  if (absDiff <= 0.10) return { label: '😊 おしい', cls: 'close', msg: 'もう少し！練習あるのみ！' };
  return                      { label: '😅 残念',   cls: 'miss',  msg: '次はきっとうまくいく！' };
}

function showResult(judge, actual, diff, prevDiff, isBest) {
  resultJudge.textContent = judge.label;
  resultJudge.className   = `result-judge ${judge.cls}`;
  // Force re-animation
  resultJudge.style.animation = 'none';
  requestAnimationFrame(() => { resultJudge.style.animation = ''; });

  rTarget.textContent   = fmtSec(c.target);
  rActual.textContent   = fmtSec(actual);
  rDiff.textContent     = fmtDiff(diff);
  rPrevDiff.textContent = prevDiff !== null ? fmtDiff(diff - prevDiff) : '-';
  resultMsg.textContent = judge.msg;

  if (isBest && c.history.length > 1) {
    bestBadge.style.display   = 'inline-block';
    bestBadge.style.animation = 'none';
    requestAnimationFrame(() => { bestBadge.style.animation = ''; });
  } else {
    bestBadge.style.display = 'none';
  }

  resultPanel.style.display = '';
  targetArea.style.display  = 'none';
  retryBtn.style.visibility = 'visible';
}

function getChallengeStats(target) {
  const hist = c.history.filter(h => h.target === target);
  if (!hist.length) return { count: 0, best: null, last: null };
  const best = hist.reduce((b, h) => Math.abs(h.diff) < Math.abs(b.diff) ? h : b);
  return { count: hist.length, best: best.diff, last: hist[0].diff };
}

function refreshChallengeSubInfo() {
  const stats = getChallengeStats(c.target);
  challengeCount.textContent = stats.count;
  bestDiffDisplay.textContent = stats.best !== null ? fmtDiff(stats.best) : '-';
  lastDiffDisplay.textContent = stats.last !== null ? fmtDiff(stats.last) : '-';
}

function setTargetValue(val) {
  c.target = Math.max(1.00, Math.min(99.99, Math.round(val * 100) / 100));
  targetInput.value = c.target.toFixed(2);
  challengeTargetLabel.textContent = `目標: ${c.target.toFixed(2)}秒`;
  save(KEYS.cTarget, c.target);
  refreshChallengeSubInfo();
}

/* =============================================
   HOLD-TO-STOP
   ============================================= */
function setBtn(btn, state, label) {
  btn.dataset.state = state;
  btn.textContent   = label;
}

function bindToggleBtn(btn, startFn, stopFn) {
  let lastFired = 0;

  function fire() {
    const now = Date.now();
    if (now - lastFired < 300) return; // debounce
    lastFired = now;
    if (btn.dataset.state !== 'running') startFn();
    else stopFn();
  }

  btn.addEventListener('touchend', (e) => {
    e.preventDefault();
    fire();
  }, { passive: false });

  btn.addEventListener('click', fire);
}

/* =============================================
   MODE SWITCH
   ============================================= */
function switchMode(mode) {
  currentMode = mode;
  swipeTrack.style.transition = '';
  swipeTrack.style.transform  = `translateX(${mode === 0 ? 0 : -50}%)`;
  dots.forEach((d, i)    => d.classList.toggle('active', i === mode));
  mlabels.forEach((l, i) => l.classList.toggle('active', i === mode));
}

/* =============================================
   SWIPE GESTURE
   ============================================= */
(function initSwipe() {
  let sx = 0, sy = 0, dragging = false, moved = false;

  swipeWrapper.addEventListener('touchstart', (e) => {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
    dragging = moved = false;
  }, { passive: true });

  swipeWrapper.addEventListener('touchmove', (e) => {
    const dx = e.touches[0].clientX - sx;
    const dy = e.touches[0].clientY - sy;
    if (!dragging && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) dragging = true;
    if (!dragging) return;
    e.preventDefault();
    moved = true;
    const base = currentMode === 0 ? 0 : -50;
    swipeTrack.style.transition = 'none';
    swipeTrack.style.transform  = `translateX(calc(${base}% + ${dx}px))`;
  }, { passive: false });

  swipeWrapper.addEventListener('touchend', (e) => {
    if (!moved) return;
    const dx = e.changedTouches[0].clientX - sx;
    swipeTrack.style.transition = '';
    if      (dx < -SWIPE_THRESHOLD && currentMode === 0) switchMode(1);
    else if (dx >  SWIPE_THRESHOLD && currentMode === 1) switchMode(0);
    else switchMode(currentMode);
    dragging = moved = false;
  }, { passive: true });
})();

/* =============================================
   THEME & DARK MODE
   ============================================= */
function applyTheme(t) {
  theme = t;
  app.className = `theme-${t}`;
  document.querySelectorAll('.theme-card').forEach(c => {
    c.classList.toggle('active', c.dataset.theme === t);
  });
  if (DARK_THEMES.has(t)) save(KEYS.lastDark, t);
  updateDarkModeBtn();
  save(KEYS.theme, t);
}

function updateDarkModeBtn() {
  darkModeBtn.textContent = DARK_THEMES.has(theme) ? '☀️' : '🌙';
  darkModeBtn.title = DARK_THEMES.has(theme) ? 'ライトモード' : 'ダークモード';
}

function toggleDarkMode() {
  if (DARK_THEMES.has(theme)) {
    applyTheme('simple');
    showToast('ライトモード');
  } else {
    const lastDark = load(KEYS.lastDark, 'neon');
    applyTheme(lastDark);
    showToast('ダークモード');
  }
}

/* =============================================
   OVERLAYS
   ============================================= */
function openOverlay(el)  { el.classList.add('open');    document.body.style.overflow = 'hidden'; }
function closeOverlay(el) { el.classList.remove('open'); document.body.style.overflow = ''; }

/* =============================================
   LAP LIST RENDER
   ============================================= */
function renderLaps() {
  if (!n.laps.length) {
    lapListContent.innerHTML = '<div class="empty-state">ラップがまだありません</div>';
    return;
  }
  const splits = n.laps.map(l => l.split);
  const bestV  = Math.min(...splits);
  const worstV = Math.max(...splits);
  lapListContent.innerHTML = n.laps.slice().reverse().map((lap, ri) => {
    const i  = n.laps.length - ri;
    const fb = n.laps.length > 1 && lap.split === bestV;
    const fw = n.laps.length > 1 && lap.split === worstV;
    return `<div class="lap-item">
      <span class="lap-num">#${i}</span>
      <span class="lap-split">${fmt(lap.split)}</span>
      <span class="lap-total">${fmt(lap.total)}</span>
      ${fb ? '<span class="lap-badge fast">最速</span>' : ''}
      ${fw ? '<span class="lap-badge slow">最遅</span>' : ''}
    </div>`;
  }).join('');
}

/* =============================================
   HISTORY RENDER
   ============================================= */
let activeHistTab = 'normal';

function renderHistory() {
  if (activeHistTab === 'normal') {
    const hist = load(KEYS.nHistory, []);
    historyContent.innerHTML = !hist.length
      ? '<div class="empty-state">記録がまだありません</div>'
      : hist.map(h => `<div class="history-item">
          <div class="history-date">${fmtDate(h.date)}</div>
          <div class="history-main">${fmt(h.time)}</div>
          <div class="history-detail">ラップ ${h.laps}件${h.best ? ' / 最速 ' + fmt(h.best) : ''}</div>
        </div>`).join('');
  } else {
    const hist = load(KEYS.cHistory, []);
    historyContent.innerHTML = !hist.length
      ? '<div class="empty-state">記録がまだありません</div>'
      : hist.map(h => `<div class="history-item">
          <div class="history-date">${fmtDate(h.date)}</div>
          <div class="history-main">${h.judge} — 誤差 ${fmtDiff(h.diff)}</div>
          <div class="history-detail">目標 ${fmtSec(h.target)} / 結果 ${fmtSec(h.actual)}</div>
        </div>`).join('');
  }
}

/* =============================================
   TOAST
   ============================================= */
let toastTimer = null;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

/* =============================================
   EVENT BINDING
   ============================================= */
function bindEvents() {
  // Normal: tap to start/stop
  bindToggleBtn(startStopBtn, normalStart, normalStop);

  // Normal: lap
  lapBtn.addEventListener('click', normalLap);

  // Normal: reset
  resetBtn.addEventListener('click', () => { if (!n.running || !n.elapsed) normalReset(); else normalReset(); });

  // Lap sheet
  showLapsBtn.addEventListener('click', () => { renderLaps(); openOverlay(lapsOverlay); });
  lapsClose.addEventListener('click',   () => closeOverlay(lapsOverlay));
  lapsOverlay.addEventListener('click', (e) => { if (e.target === lapsOverlay) closeOverlay(lapsOverlay); });

  // Challenge: tap to start/stop
  bindToggleBtn(challengeStartBtn, challengeStart, challengeStop);

  // Challenge: retry
  retryBtn.addEventListener('click', () => { challengeReset(); setTimeout(challengeStart, 30); });

  // Challenge: reset
  challengeResetBtn.addEventListener('click', challengeReset);

  // Target adjust (tap + hold repeat)
  function makeAdj(delta) {
    let interval = null;
    function adj() { setTargetValue(c.target + delta); }
    return {
      start: (e) => { e.preventDefault(); adj(); interval = setInterval(adj, 130); },
      stop:  ()  => { clearInterval(interval); interval = null; },
    };
  }
  const adjMinus = makeAdj(-0.01);
  const adjPlus  = makeAdj(+0.01);

  minusBtn.addEventListener('touchstart',  adjMinus.start, { passive: false });
  minusBtn.addEventListener('mousedown',   adjMinus.start);
  minusBtn.addEventListener('touchend',    adjMinus.stop);
  minusBtn.addEventListener('touchcancel', adjMinus.stop);
  minusBtn.addEventListener('mouseup',     adjMinus.stop);
  minusBtn.addEventListener('mouseleave',  adjMinus.stop);

  plusBtn.addEventListener('touchstart',   adjPlus.start, { passive: false });
  plusBtn.addEventListener('mousedown',    adjPlus.start);
  plusBtn.addEventListener('touchend',     adjPlus.stop);
  plusBtn.addEventListener('touchcancel',  adjPlus.stop);
  plusBtn.addEventListener('mouseup',      adjPlus.stop);
  plusBtn.addEventListener('mouseleave',   adjPlus.stop);

  // Target direct input
  targetInput.addEventListener('change', () => {
    const v = parseFloat(targetInput.value);
    if (!isNaN(v)) setTargetValue(v);
  });
  targetInput.addEventListener('focus', () => targetInput.select());

  // Presets
  document.querySelectorAll('.preset').forEach(btn => {
    btn.addEventListener('click', () => {
      setTargetValue(parseFloat(btn.dataset.sec));
      showToast(`目標 ${btn.dataset.sec}秒に設定`);
    });
  });

  // Mode dots & labels
  dots.forEach((d, i)    => d.addEventListener('click', () => switchMode(i)));
  mlabels.forEach((l, i) => l.addEventListener('click', () => switchMode(i)));

  // Dark mode toggle
  darkModeBtn.addEventListener('click', toggleDarkMode);

  // Theme
  themeBtn.addEventListener('click', () => openOverlay(themeOverlay));
  themeClose.addEventListener('click', () => closeOverlay(themeOverlay));
  themeOverlay.addEventListener('click', (e) => { if (e.target === themeOverlay) closeOverlay(themeOverlay); });
  document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
      applyTheme(card.dataset.theme);
      showToast(`テーマ: ${card.querySelector('span').textContent}`);
      setTimeout(() => closeOverlay(themeOverlay), 300);
    });
  });

  // History
  historyBtn.addEventListener('click', () => { renderHistory(); openOverlay(historyOverlay); });
  historyClose.addEventListener('click', () => closeOverlay(historyOverlay));
  historyOverlay.addEventListener('click', (e) => { if (e.target === historyOverlay) closeOverlay(historyOverlay); });
  document.querySelectorAll('.htab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeHistTab = tab.dataset.htab;
      document.querySelectorAll('.htab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderHistory();
    });
  });
}

/* =============================================
   INIT
   ============================================= */
function init() {
  // Restore theme (also updates dark mode button)
  applyTheme(load(KEYS.theme, 'simple'));

  // Restore challenge target
  const savedTarget = load(KEYS.cTarget, 5.00);
  c.target = Math.max(1.00, Math.min(99.99, savedTarget));
  targetInput.value = c.target.toFixed(2);
  challengeTargetLabel.textContent = `目標: ${c.target.toFixed(2)}秒`;

  // Load challenge history
  c.history = load(KEYS.cHistory, []);
  refreshChallengeSubInfo();

  // Swipe hint
  if (!load(KEYS.hint, false)) {
    swipeHint.style.display = '';
    setTimeout(() => { swipeHint.style.display = 'none'; save(KEYS.hint, true); }, 4500);
  } else {
    swipeHint.style.display = 'none';
  }

  bindEvents();

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }
}

init();
