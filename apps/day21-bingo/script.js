'use strict';

// ===================================
// Constants
// ===================================
const STORAGE_KEY = 'day21-lottery-state';

// ===================================
// State
// ===================================
let state = {
  mode: 'number',        // 'number' | 'text'
  numberMin: 1,
  numberMax: 75,
  textInput: '',
  simultaneous: 1,
  effectMode: 'slot',    // 'slot' | 'roulette' | 'textrand'
  theme: 'light',
  drawn: [],             // flat list of drawn values (as strings)
  history: [],           // [{id, items:[...]}]
  sound: true,
  speech: false,
};

let isAnimating = false;
let animationAbort = false;
let toastTimer = null;

// ===================================
// DOM Helpers
// ===================================
const $  = (id) => document.getElementById(id);
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

// ===================================
// Persistence
// ===================================
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) { /* quota exceeded – ignore */ }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    state = { ...state, ...saved };
    // ensure arrays
    if (!Array.isArray(state.drawn))   state.drawn   = [];
    if (!Array.isArray(state.history)) state.history = [];
  } catch (e) {
    // corrupt data → reset
    localStorage.removeItem(STORAGE_KEY);
  }
}

// ===================================
// Pool Management
// ===================================
function getPool() {
  if (state.mode === 'text') {
    const lines = state.textInput.split('\n').map(l => l.trim()).filter(Boolean);
    return [...new Set(lines)];
  }
  const min = parseInt(state.numberMin, 10);
  const max = parseInt(state.numberMax, 10);
  if (isNaN(min) || isNaN(max) || min > max) return [];
  const arr = [];
  for (let i = min; i <= max; i++) arr.push(String(i));
  return arr;
}

function getRemaining() {
  const pool = getPool();
  const drawnSet = new Set(state.drawn);
  return pool.filter(v => !drawnSet.has(v));
}

function getDrawCount() {
  const rem = getRemaining().length;
  return Math.min(state.simultaneous, rem);
}

// ===================================
// BINGO helpers
// ===================================
function isBingoMode() {
  return (
    state.mode === 'number' &&
    parseInt(state.numberMin, 10) === 1 &&
    parseInt(state.numberMax, 10) === 75
  );
}

function getBingoLabel(num) {
  const n = Number(num);
  if (n >= 1  && n <= 15) return 'B';
  if (n >= 16 && n <= 30) return 'I';
  if (n >= 31 && n <= 45) return 'N';
  if (n >= 46 && n <= 60) return 'G';
  if (n >= 61 && n <= 75) return 'O';
  return '';
}

function formatWithBingo(val) {
  if (isBingoMode()) {
    const label = getBingoLabel(val);
    if (label) return `${label}-${val}`;
  }
  return String(val);
}

// ===================================
// Draw / Undo / Reset
// ===================================
function draw() {
  if (isAnimating) return;
  const remaining = getRemaining();
  if (remaining.length === 0) { showToast('すべて抽選済みです！'); return; }

  const count = getDrawCount();
  // Shuffle remaining and pick `count` items
  const shuffled = [...remaining].sort(() => Math.random() - 0.5);
  const results = shuffled.slice(0, count);

  // Capture pool snapshot before updating state (used by roulette)
  const poolSnapshot = [...remaining];

  // Update state immediately (drawn + history)
  results.forEach(v => state.drawn.push(v));
  state.history.unshift({ id: Date.now(), items: [...results] });
  saveState();

  // Start animation
  isAnimating = true;
  animationAbort = false;
  setDrawBtnDisabled(true);

  runAnimation(results, poolSnapshot, () => {
    isAnimating = false;
    setDrawBtnDisabled(false);
    updateRemaining();
    renderHistory();
    renderBoard();
    if (state.speech) speakResults(results);
    if (getRemaining().length === 0) showToast('🎉 全件抽選完了！');
  });
}

function undo() {
  if (isAnimating || state.history.length === 0) return;
  const last = state.history.shift();
  last.items.forEach(v => {
    const idx = state.drawn.lastIndexOf(v);
    if (idx !== -1) state.drawn.splice(idx, 1);
  });
  saveState();
  resetAnimArea();
  updateRemaining();
  renderHistory();
  renderBoard();
  showToast('Undo しました');
}

function resetAll() {
  state.drawn   = [];
  state.history = [];
  saveState();
  isAnimating = false;
  animationAbort = false;
  setDrawBtnDisabled(false);
  resetAnimArea();
  updateRemaining();
  renderHistory();
  renderBoard();
  showToast('リセットしました');
}

// ===================================
// Animation Dispatcher
// ===================================
function runAnimation(results, poolSnapshot, onComplete) {
  switch (state.effectMode) {
    case 'slot':     runSlot(results, onComplete);                     break;
    case 'roulette': runRoulette(results, poolSnapshot, onComplete);   break;
    case 'textrand': runTextRand(results, onComplete);                 break;
    default:         runSlot(results, onComplete);
  }
}

// ===================================
// SLOT Animation (縦スクロールリール)
// ===================================
function buildReelStrip(reel, items, centerVal) {
  // Build a strip: [rand, rand, centerVal, rand, rand]
  const strip = document.createElement('div');
  strip.className = 'reel-strip';

  // Pre-fill with 2 items above + center + 2 items below for 3-row window
  const above = 2, below = 2;
  const total = above + 1 + below;
  for (let n = 0; n < total; n++) {
    const item = document.createElement('div');
    item.className = 'reel-item' + (n === above ? ' center' : '');
    const rv = n === above
      ? String(centerVal)
      : String(items[Math.floor(Math.random() * items.length)]);
    item.textContent = rv;
    strip.appendChild(item);
  }
  reel.appendChild(strip);
  // Position so center item is visible in the middle (item height = 52px)
  strip.style.transform = `translateY(-${above * 52}px)`;
  return strip;
}

function runSlot(results, onComplete) {
  const count = results.length;
  const reelsEl = $('slot-reels');
  reelsEl.innerHTML = '';
  reelsEl.className = 'slot-reels' + (count === 2 ? ' two' : count === 3 ? ' three' : '');

  const allItems = getPool();
  const reelEls = [];

  for (let i = 0; i < count; i++) {
    const reel = document.createElement('div');
    reel.className = 'slot-reel';
    reel.id = `reel-${i}`;
    // placeholder strip (all ?)
    const strip = document.createElement('div');
    strip.className = 'reel-strip';
    for (let n = 0; n < 3; n++) {
      const item = document.createElement('div');
      item.className = 'reel-item' + (n === 1 ? ' center' : '');
      item.textContent = '?';
      strip.appendChild(item);
    }
    strip.style.transform = 'translateY(-52px)';
    reel.appendChild(strip);
    reel.innerHTML += '<div class="reel-highlight"></div><div class="reel-fade top"></div><div class="reel-fade bottom"></div>';
    reelsEl.appendChild(reel);
    reelEls.push(reel);
  }

  showView('slot');
  playSound('start');

  let completed = 0;
  const durations = [1900, 2500, 3100];

  results.forEach((result, i) => {
    const reel = reelEls[i];
    const duration = durations[i] || durations[0];
    let elapsed = 0;
    let speed = 55;

    // Spinning: rapidly rebuild strip contents to simulate scroll
    const tick = () => {
      if (animationAbort) {
        // Settle immediately
        reel.innerHTML = '';
        buildReelStrip(reel, allItems, result);
        reel.innerHTML += '<div class="reel-highlight"></div><div class="reel-fade top"></div><div class="reel-fade bottom"></div>';
        reel.classList.add('settled');
        completed++;
        if (completed === count) setTimeout(onComplete, 300);
        return;
      }

      elapsed += speed;
      const progress = elapsed / duration;
      if      (progress < 0.55) speed = 55;
      else if (progress < 0.70) speed = 110;
      else if (progress < 0.83) speed = 220;
      else if (progress < 0.92) speed = 380;
      else                      speed = 580;

      if (elapsed < duration) {
        // Replace center item with random value for scroll illusion
        const strip = reel.querySelector('.reel-strip');
        if (strip) {
          const items = strip.querySelectorAll('.reel-item');
          items.forEach(item => {
            item.textContent = String(allItems[Math.floor(Math.random() * allItems.length)]);
          });
          // Animate a slight translateY shift to feel like scrolling
          const offset = -52 + (progress < 0.9 ? (Math.random() - 0.5) * 10 : 0);
          strip.style.transform = `translateY(${offset}px)`;
        }
        setTimeout(tick, speed);
      } else {
        // Final settle: rebuild strip with correct center
        reel.innerHTML = '';
        buildReelStrip(reel, allItems, result);
        reel.innerHTML += '<div class="reel-highlight"></div><div class="reel-fade top"></div><div class="reel-fade bottom"></div>';
        reel.classList.add('settled');
        playSound('stop');
        completed++;
        if (completed === count) setTimeout(onComplete, 400);
      }
    };

    setTimeout(tick, i * 200);
  });
}

// ===================================
// ROULETTE Animation
// ===================================
function runRoulette(results, poolSnapshot, onComplete) {
  showView('roulette');
  const cardsEl = $('roulette-cards');
  cardsEl.innerHTML = '';
  $('roulette-result').classList.remove('show');
  $('roulette-result').textContent = '';

  const canvas = $('roulette-canvas');
  // Responsive canvas size
  const size = Math.min(window.innerWidth - 80, 320);
  canvas.width  = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  let poolForSpin = [...poolSnapshot];
  let spinIdx = 0;

  playSound('start');

  function spinNext() {
    if (animationAbort || spinIdx >= results.length) {
      onComplete();
      return;
    }
    const result = results[spinIdx];
    spinWheel(ctx, canvas, result, poolForSpin, () => {
      // Show mini result card
      appendRouletteCard(result, cardsEl);
      // Remove result from pool for next spin
      poolForSpin = poolForSpin.filter(v => v !== result);
      spinIdx++;
      setTimeout(spinNext, 400);
    });
  }

  spinNext();
}

function spinWheel(ctx, canvas, result, pool, onDone) {
  const size = canvas.width;
  const cx = size / 2, cy = size / 2;
  const r  = size / 2 - 14;

  // Build sectors (max 12, include result)
  const maxSectors = Math.min(pool.length, 12);
  let sectors = [result];
  const others = pool.filter(v => v !== result)
                     .sort(() => Math.random() - 0.5)
                     .slice(0, maxSectors - 1);
  sectors = [...sectors, ...others].sort(() => Math.random() - 0.5);

  const resultIdx  = sectors.indexOf(result);
  const secAngle   = (2 * Math.PI) / sectors.length;

  // Target rotation: result center aligns with top (3π/2)
  const topAngle    = 3 * Math.PI / 2;
  const resultCenter = resultIdx * secAngle + secAngle / 2;
  const k = 6; // full spins
  const finalRot = topAngle - 2 * Math.PI * k - resultCenter;

  // Colors (blue palette)
  const COLORS = [
    '#3B82F6','#60A5FA','#2563EB','#93C5FD',
    '#1D4ED8','#7CB9FF','#3B82F6','#60A5FA',
    '#2563EB','#93C5FD','#1D4ED8','#BFDBFE'
  ];

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  function drawWheel(rotation) {
    ctx.clearRect(0, 0, size, size);

    // Outer shadow ring
    ctx.beginPath();
    ctx.arc(cx, cy, r + 4, 0, 2 * Math.PI);
    ctx.fillStyle = isDark ? '#2D4163' : '#BFDBFE';
    ctx.fill();

    sectors.forEach((item, i) => {
      const sA = i * secAngle + rotation;
      const eA = sA + secAngle;

      // Sector
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, sA, eA);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = isDark ? '#1E293B' : '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(sA + secAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      const maxLen = String(formatWithBingo(item)).length;
      const fSize = maxLen > 4 ? Math.max(9, r * 0.10) : Math.min(15, r * 0.14);
      ctx.font = `900 ${fSize}px "M PLUS Rounded 1c", sans-serif`;
      ctx.fillText(formatWithBingo(item), r - 10, fSize * 0.38);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.14, 0, 2 * Math.PI);
    ctx.fillStyle = isDark ? '#0F172A' : '#1E293B';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.08, 0, 2 * Math.PI);
    ctx.fillStyle = '#60A5FA';
    ctx.fill();
  }

  // Easing: quintic ease-out
  function easeOut(t) { return 1 - Math.pow(1 - t, 5); }

  const DURATION = 3800;
  let startTime = null;

  function animate(ts) {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / DURATION, 1);
    const rot = easeOut(progress) * finalRot;
    drawWheel(rot);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      drawWheel(finalRot);
      playSound('stop');
      // Show result overlay briefly
      const resultEl = $('roulette-result');
      resultEl.textContent = formatWithBingo(result);
      resultEl.classList.add('show');
      setTimeout(() => {
        resultEl.classList.remove('show');
        onDone();
      }, 900);
    }
  }

  requestAnimationFrame(animate);
}

function appendRouletteCard(val, container) {
  const card = document.createElement('div');
  card.className = 'result-card-mini';
  if (isBingoMode()) {
    const lbl = getBingoLabel(val);
    card.innerHTML = lbl
      ? `<div class="card-bingo">${lbl}</div><div class="card-val">${val}</div>`
      : `<div class="card-val">${val}</div>`;
  } else {
    card.innerHTML = `<div class="card-val">${val}</div>`;
  }
  container.appendChild(card);
}

// ===================================
// TEXT RANDOM Animation
// ===================================
function runTextRand(results, onComplete) {
  const count = results.length;
  const container = $('textrand-cards');
  container.innerHTML = '';

  const allItems = getPool();
  const cardEls = [];
  for (let i = 0; i < count; i++) {
    const card = document.createElement('div');
    card.className = 'textrand-card';
    card.id = `tcard-${i}`;
    card.innerHTML = '<div class="textrand-label">DRAWING...</div><div class="textrand-value">?</div>';
    container.appendChild(card);
    cardEls.push(card);
  }

  showView('textrand');
  playSound('start');

  let completed = 0;
  const durations = [1600, 2100, 2600];

  results.forEach((result, i) => {
    const card  = cardEls[i];
    const valEl = card.querySelector('.textrand-value');
    const lblEl = card.querySelector('.textrand-label');
    const dur   = durations[i] || durations[0];
    let elapsed = 0;
    let speed   = 60;

    card.classList.add('cycling');

    const tick = () => {
      if (animationAbort) {
        valEl.textContent = String(result);
        lblEl.textContent = 'RESULT';
        card.classList.remove('cycling');
        card.classList.add('settled');
        completed++;
        if (completed === count) setTimeout(onComplete, 300);
        return;
      }
      elapsed += speed;
      const progress = elapsed / dur;
      if      (progress < 0.60) speed = 60;
      else if (progress < 0.75) speed = 120;
      else if (progress < 0.88) speed = 250;
      else if (progress < 0.95) speed = 420;
      else                      speed = 620;

      if (elapsed < dur) {
        const rv = allItems[Math.floor(Math.random() * allItems.length)];
        valEl.textContent = String(rv);
        setTimeout(tick, speed);
      } else {
        valEl.textContent = String(result);
        lblEl.textContent = 'RESULT';
        card.classList.remove('cycling');
        card.classList.add('settled');
        playSound('stop');
        completed++;
        if (completed === count) setTimeout(onComplete, 400);
      }
    };

    setTimeout(tick, i * 160);
  });
}

// ===================================
// View Management
// ===================================
function showView(view) {
  $('slot-display').classList.toggle('hidden',     view !== 'slot');
  $('roulette-display').classList.toggle('hidden', view !== 'roulette');
  $('textrand-display').classList.toggle('hidden', view !== 'textrand');
}

function resetAnimArea() {
  // Slot – rebuild single reel with ? strip
  const reels = $('slot-reels');
  reels.innerHTML = '';
  reels.className = 'slot-reels';
  const reel0 = document.createElement('div');
  reel0.className = 'slot-reel';
  reel0.id = 'reel-0';
  const strip0 = document.createElement('div');
  strip0.className = 'reel-strip';
  for (let n = 0; n < 3; n++) {
    const item = document.createElement('div');
    item.className = 'reel-item' + (n === 1 ? ' center' : '');
    item.textContent = '?';
    strip0.appendChild(item);
  }
  strip0.style.transform = 'translateY(-52px)';
  reel0.appendChild(strip0);
  reel0.innerHTML += '<div class="reel-highlight"></div><div class="reel-fade top"></div><div class="reel-fade bottom"></div>';
  reels.appendChild(reel0);

  // Roulette
  $('roulette-cards').innerHTML = '';
  $('roulette-result').textContent = '';
  $('roulette-result').classList.remove('show');
  const c = $('roulette-canvas');
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);

  // Text random
  $('textrand-cards').innerHTML = '<div class="textrand-card" id="tcard-0"><div class="textrand-label">DRAWING</div><div class="textrand-value">?</div></div>';
  showView(state.effectMode);
}

// ===================================
// UI: Remaining
// ===================================
function updateRemaining() {
  const pool    = getPool();
  const total   = pool.length;
  const rem     = getRemaining().length;
  const numEl   = $('remaining-count');
  numEl.textContent = rem;
  numEl.className = 'remaining-num';
  if (rem === 0)        numEl.classList.add('done');
  else if (rem <= 5)    numEl.classList.add('warn');

  const pct = total > 0 ? ((total - rem) / total) * 100 : 0;
  $('progress-fill').style.width = pct + '%';

  // Undo btn
  $('btn-undo').disabled = state.history.length === 0;
}

// ===================================
// UI: History
// ===================================
function renderHistory() {
  const list = $('history-list');
  if (state.history.length === 0) {
    list.innerHTML = '<p class="empty-msg">まだ抽選されていません</p>';
    return;
  }

  list.innerHTML = '';
  state.history.forEach((entry, idx) => {
    const item = document.createElement('div');
    item.className = 'history-item' + (idx === 0 ? ' latest' : '');

    const round = document.createElement('div');
    round.className = 'history-round';
    round.textContent = `第${state.history.length - idx}回`;

    const vals = document.createElement('div');
    vals.className = 'history-values';
    entry.items.forEach(v => {
      const chip = document.createElement('span');
      chip.className = 'history-chip';
      chip.textContent = formatWithBingo(v);
      vals.appendChild(chip);
    });

    item.appendChild(round);
    item.appendChild(vals);
    list.appendChild(item);
  });
}

// ===================================
// UI: Board
// ===================================
function renderBoard() {
  const grid   = $('board-grid');
  const emptyP = $('board-empty');
  const pool   = getPool();

  if (state.mode !== 'number') {
    grid.innerHTML = '';
    emptyP.textContent = 'テキストモードでは盤面は表示されません';
    emptyP.classList.remove('hidden');
    return;
  }

  const min = parseInt(state.numberMin, 10);
  const max = parseInt(state.numberMax, 10);
  const total = max - min + 1;

  if (isNaN(min) || isNaN(max) || min > max || total > 100) {
    grid.innerHTML = '';
    emptyP.textContent = '範囲が100以下のとき盤面が表示されます';
    emptyP.classList.remove('hidden');
    return;
  }

  emptyP.classList.add('hidden');
  grid.innerHTML = '';

  const drawnSet = new Set(state.drawn);
  const latestSet = state.history.length > 0
    ? new Set(state.history[0].items)
    : new Set();

  if (isBingoMode()) {
    // BINGO layout: 5 columns × 15 rows
    grid.className = 'board-grid';
    const labels = ['B','I','N','G','O'];
    const headRow = document.createElement('div');
    headRow.className = 'board-head-row';
    labels.forEach(l => {
      const h = document.createElement('div');
      h.className = 'board-head';
      h.textContent = l;
      headRow.appendChild(h);
    });
    grid.appendChild(headRow);

    for (let row = 0; row < 15; row++) {
      const rowEl = document.createElement('div');
      rowEl.className = 'board-row';
      for (let col = 0; col < 5; col++) {
        const num = col * 15 + row + 1;
        const cell = document.createElement('div');
        cell.className = 'board-cell';
        if (latestSet.has(String(num))) cell.classList.add('latest');
        else if (drawnSet.has(String(num))) cell.classList.add('drawn');
        cell.textContent = num;
        rowEl.appendChild(cell);
      }
      grid.appendChild(rowEl);
    }
  } else {
    // Generic grid: ~10 columns
    const cols  = Math.min(10, total);
    grid.className = 'board-grid compact';
    let rowEl = null;
    pool.forEach((v, i) => {
      if (i % cols === 0) {
        rowEl = document.createElement('div');
        rowEl.className = 'board-row';
        grid.appendChild(rowEl);
      }
      const cell = document.createElement('div');
      cell.className = 'board-cell';
      if (latestSet.has(v)) cell.classList.add('latest');
      else if (drawnSet.has(v)) cell.classList.add('drawn');
      cell.textContent = v;
      rowEl.appendChild(cell);
    });
  }
}

// ===================================
// UI: Controls sync
// ===================================
function syncUI() {
  // Mode buttons
  $$('#mode-control .seg-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === state.mode);
  });
  // Effect buttons
  $$('#effect-control .seg-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.effect === state.effectMode);
  });
  // Simultaneous buttons
  $$('.sim-btn').forEach(btn => {
    btn.classList.toggle('active', String(btn.dataset.sim) === String(state.simultaneous));
  });
  // Settings visibility
  $('number-settings').classList.toggle('hidden', state.mode === 'text');
  $('text-settings').classList.toggle('hidden', state.mode === 'number');
  // Theme
  document.documentElement.setAttribute('data-theme', state.theme);
  $('btn-theme').textContent = state.theme === 'dark' ? '☀️' : '🌙';
  // BINGO badge
  $('bingo-badge').classList.toggle('hidden', !isBingoMode());
  // Sound / Speech icons
  $('btn-sound').textContent  = state.sound   ? '🔊' : '🔇';
  $('btn-speech').textContent = state.speech  ? '🗣️' : '🤐';
  $('btn-sound').classList.toggle('active',  state.sound);
  $('btn-speech').classList.toggle('active', state.speech);
  // Number inputs
  $('range-min').value = state.numberMin;
  $('range-max').value = state.numberMax;
  // Text input
  $('text-input').value = state.textInput;
  updateTextCount();
  // Show correct view
  showView(state.effectMode);
}

function setDrawBtnDisabled(disabled) {
  const btn = $('btn-draw');
  btn.disabled = disabled;
  btn.classList.toggle('animating', disabled);
}

// ===================================
// UI: Text count
// ===================================
function updateTextCount() {
  const lines = state.textInput.split('\n').filter(l => l.trim());
  $('text-count').textContent = [...new Set(lines)].length;
}

// ===================================
// Copy History
// ===================================
function copyHistory() {
  if (state.history.length === 0) { showToast('履歴がありません'); return; }
  const lines = [...state.history].reverse().map((entry, i) => {
    const vals = entry.items.map(v => formatWithBingo(v)).join(', ');
    return `第${i + 1}回：${vals}`;
  });
  const text = lines.join('\n');
  navigator.clipboard.writeText(text)
    .then(() => showToast('📋 履歴をコピーしました'))
    .catch(() => showToast('コピーに失敗しました'));
}

// ===================================
// Toast
// ===================================
function showToast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

// ===================================
// Sound Effects (Web Audio API)
// ===================================
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playSound(type) {
  if (!state.sound) return;
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'start') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'stop') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) { /* audio not available */ }
}

// ===================================
// Speech (Web Speech API)
// ===================================
function speakResults(results) {
  if (!state.speech) return;
  if (!window.speechSynthesis) return;
  const text = results.map(v => {
    if (isBingoMode()) {
      const lbl = getBingoLabel(v);
      return lbl ? `${lbl}の${v}` : v;
    }
    return v;
  }).join('、');
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'ja-JP';
  utt.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(utt);
}

// ===================================
// Fullscreen
// ===================================
function toggleFullscreen() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    const el = document.documentElement;
    (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
    $('btn-fullscreen').textContent = '✕';
  } else {
    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    $('btn-fullscreen').textContent = '⛶';
  }
}

// ===================================
// Event Listeners
// ===================================
function setupEvents() {

  // Mode switch
  $$('#mode-control .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (isAnimating) return;
      state.mode = btn.dataset.mode;
      saveState();
      syncUI();
      resetAnimArea();
      updateRemaining();
      renderBoard();
    });
  });

  // Effect switch
  $$('#effect-control .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (isAnimating) return;
      state.effectMode = btn.dataset.effect;
      saveState();
      syncUI();
      resetAnimArea();
    });
  });

  // Simultaneous buttons
  $$('.sim-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (isAnimating) return;
      state.simultaneous = parseInt(btn.dataset.sim, 10);
      $$('.sim-btn').forEach(b => b.classList.toggle('active', b === btn));
      saveState();
    });
  });

  // Number range
  $('range-min').addEventListener('change', () => {
    state.numberMin = parseInt($('range-min').value, 10) || 1;
    $('range-min').value = state.numberMin;
    saveState();
    syncUI();
    resetAnimArea();
    updateRemaining();
    renderBoard();
  });
  $('range-max').addEventListener('change', () => {
    state.numberMax = parseInt($('range-max').value, 10) || 75;
    $('range-max').value = state.numberMax;
    saveState();
    syncUI();
    resetAnimArea();
    updateRemaining();
    renderBoard();
  });

  // Text input
  $('text-input').addEventListener('input', () => {
    state.textInput = $('text-input').value;
    updateTextCount();
    saveState();
    updateRemaining();
  });

  // Draw
  $('btn-draw').addEventListener('click', draw);

  // Undo
  $('btn-undo').addEventListener('click', undo);

  // Copy
  $('btn-copy').addEventListener('click', copyHistory);

  // Reset
  $('btn-reset').addEventListener('click', () => {
    $('reset-modal').classList.remove('hidden');
  });
  $('modal-cancel').addEventListener('click', () => {
    $('reset-modal').classList.add('hidden');
  });
  $('modal-confirm').addEventListener('click', () => {
    $('reset-modal').classList.add('hidden');
    resetAll();
  });
  $('reset-modal').addEventListener('click', (e) => {
    if (e.target === $('reset-modal')) $('reset-modal').classList.add('hidden');
  });

  // Theme
  $('btn-theme').addEventListener('click', () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    saveState();
    document.documentElement.setAttribute('data-theme', state.theme);
    $('btn-theme').textContent = state.theme === 'dark' ? '☀️' : '🌙';
  });

  // Fullscreen
  $('btn-fullscreen').addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange',        updateFullscreenBtn);
  document.addEventListener('webkitfullscreenchange',  updateFullscreenBtn);

  // Sound
  $('btn-sound').addEventListener('click', () => {
    state.sound = !state.sound;
    saveState();
    syncUI();
    showToast(state.sound ? '🔊 音ON' : '🔇 音OFF');
  });

  // Speech
  $('btn-speech').addEventListener('click', () => {
    if (!window.speechSynthesis) { showToast('このブラウザは読み上げ非対応です'); return; }
    state.speech = !state.speech;
    saveState();
    syncUI();
    showToast(state.speech ? '🗣️ 読み上げON' : '🤐 読み上げOFF');
  });

  // Keyboard shortcut: Space / Enter → draw
  document.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'Enter') &&
        !['INPUT','TEXTAREA','BUTTON'].includes(e.target.tagName)) {
      e.preventDefault();
      draw();
    }
    if (e.code === 'KeyZ' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      undo();
    }
  });
}

function updateFullscreenBtn() {
  const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
  $('btn-fullscreen').textContent = isFs ? '✕' : '⛶';
}

// ===================================
// Init
// ===================================
function init() {
  loadState();
  syncUI();
  resetAnimArea(); // rebuild slot reel DOM with proper structure
  updateRemaining();
  renderHistory();
  renderBoard();
  setupEvents();

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .catch(() => {/* silently ignore */});
  }
}

document.addEventListener('DOMContentLoaded', init);
