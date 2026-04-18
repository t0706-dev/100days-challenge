'use strict';

// ── Constants ──────────────────────────────────────────────
const STAGES = [
  { name: '種',     emoji: '🌰', req: 0  },
  { name: '芽',     emoji: '🌱', req: 1  },
  { name: '葉',     emoji: '🪴', req: 3  },
  { name: 'つぼみ', emoji: '🌿', req: 6  },
  { name: '花',     emoji: '🌸', req: 10 },
  { name: '成熟',   emoji: '🌳', req: 15 },
];

const MISSIONS_POOL = [
  { text: '今日3回集中する',        type: 'today',   goal: 3,  xp: 30  },
  { text: '今日5回集中する',        type: 'today',   goal: 5,  xp: 50  },
  { text: '今日1回集中する',        type: 'today',   goal: 1,  xp: 10  },
  { text: '休憩をスキップせず完走', type: 'fullset', goal: 1,  xp: 40  },
  { text: '連続2日達成する',        type: 'streak',  goal: 2,  xp: 60  },
  { text: '累計10回達成する',       type: 'total',   goal: 10, xp: 50  },
  { text: '累計20回達成する',       type: 'total',   goal: 20, xp: 80  },
];

const MODES = [
  { key: 'focus',      label: '集中',      min: 25, ring: '' },
  { key: 'shortBreak', label: '短い休憩',  min: 5,  ring: 'ring-break' },
  { key: 'longBreak',  label: '長い休憩',  min: 20, ring: 'ring-rest' },
];

const XP_PER_LEVEL = 100;
const BGM_OPTIONS = ['雨音', 'カフェ', 'Lo-fi', '波音', '森の音', '焚き火'];

// ── State ───────────────────────────────────────────────────
let state = {
  // timer
  mode: 0,          // 0=focus 1=short 2=long
  timeLeft: 25 * 60,
  running: false,
  setCount: 0,      // how many focuses done this cycle (for long break trigger)
  totalDuration: 25 * 60,

  // settings
  focusMin: 25,
  shortMin: 5,
  longMin: 20,
  autoSwitch: true,
  notifySound: true,

  // game
  plant: {
    stageIdx: 0,
    growth: 0,       // 0-100 within stage
    health: 100,
    totalCompleted: 0,
  },
  level: 1,
  xp: 0,

  // records
  todayDate: '',
  todayCount: 0,
  totalCount: 0,
  totalFocusMin: 0,

  // streak
  streak: 0,
  bestStreak: 0,
  lastFocusDate: '',

  // missions
  missions: [],
  missionsDate: '',

  // bgm
  bgmOn: false,
  bgmType: 0,
  bgmVol: 0.3,

  // theme
  theme: 'system',
};

let timerInterval = null;
let audioCtx = null;
let bgmNode = null;
let bgmGain = null;

// ── Storage ─────────────────────────────────────────────────
function save() {
  localStorage.setItem('pomodoro_v1', JSON.stringify(state));
}

function load() {
  try {
    const raw = localStorage.getItem('pomodoro_v1');
    if (raw) Object.assign(state, JSON.parse(raw));
  } catch (_) {}
  const today = todayStr();
  if (state.todayDate !== today) {
    state.todayDate = today;
    state.todayCount = 0;
  }
  if (state.missionsDate !== today) {
    state.missionsDate = today;
    state.missions = generateMissions();
  }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// ── Missions ────────────────────────────────────────────────
function generateMissions() {
  const pool = [...MISSIONS_POOL];
  const picks = [];
  while (picks.length < 3 && pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    picks.push({ ...pool.splice(i, 1)[0], done: false });
  }
  return picks;
}

function checkMissions() {
  let changed = false;
  state.missions.forEach(m => {
    if (m.done) return;
    let progress = 0;
    if (m.type === 'today')   progress = state.todayCount;
    if (m.type === 'total')   progress = state.totalCount;
    if (m.type === 'streak')  progress = state.streak;
    if (m.type === 'fullset') progress = state.setCount >= 4 ? 1 : 0;
    if (progress >= m.goal) {
      m.done = true;
      changed = true;
      addXP(m.xp);
      toast(`ミッション達成！ +${m.xp}XP 🎉`);
    }
  });
  if (changed) { save(); renderMissions(); }
}

// ── XP / Level ───────────────────────────────────────────────
function addXP(amount) {
  state.xp += amount;
  while (state.xp >= XP_PER_LEVEL) {
    state.xp -= XP_PER_LEVEL;
    state.level++;
    toast(`レベルアップ！ Lv.${state.level} 🌟`);
  }
  renderLevel();
}

// ── Plant ────────────────────────────────────────────────────
function growPlant() {
  state.plant.health = Math.min(100, state.plant.health + 10);
  state.plant.growth += 20;
  state.plant.totalCompleted++;

  if (state.plant.growth >= 100) {
    state.plant.growth = 0;
    const next = state.plant.stageIdx + 1;
    if (next < STAGES.length) {
      state.plant.stageIdx = next;
      toast(`植物が成長した！ ${STAGES[next].emoji} ${STAGES[next].name}`);
      triggerPlantAnim('level-up');
    } else {
      state.plant.growth = 100;
      toast('植物が完全に成熟しました 🌳');
    }
  }
  renderPlant();
}

function weakenPlant() {
  state.plant.health = Math.max(0, state.plant.health - 20);
  if (state.plant.health < 30 && state.plant.stageIdx > 0) {
    state.plant.stageIdx = Math.max(0, state.plant.stageIdx - 1);
    state.plant.growth = 80;
    toast('植物が弱ってしまった… 💧');
  }
  triggerPlantAnim('weakened');
  renderPlant();
}

function triggerPlantAnim(cls) {
  const el = document.getElementById('plant-emoji');
  if (!el) return;
  el.classList.remove('level-up', 'weakened');
  void el.offsetWidth;
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 800);
}

// ── Timer ────────────────────────────────────────────────────
function startTimer() {
  if (state.running) return;
  state.running = true;
  updateMainBtn();
  timerInterval = setInterval(tick, 1000);
  startBGM();
}

function pauseTimer() {
  if (!state.running) return;
  state.running = false;
  clearInterval(timerInterval);
  updateMainBtn();
  if (state.mode === 0) weakenPlant();
  save();
}

function resetTimer() {
  clearInterval(timerInterval);
  state.running = false;
  setMode(state.mode);
  updateMainBtn();
  renderRing();
}

function tick() {
  state.timeLeft--;
  renderTime();
  renderRing();
  if (state.timeLeft <= 0) onTimerEnd();
}

function onTimerEnd() {
  clearInterval(timerInterval);
  state.running = false;

  if (state.mode === 0) {
    // focus completed
    state.todayCount++;
    state.totalCount++;
    state.setCount++;
    state.totalFocusMin += state.focusMin;
    updateStreak();
    growPlant();
    addXP(20);
    checkMissions();
    save();

    showCompleteOverlay('focus');
    playEndSound();
    spawnParticles();

    if (state.autoSwitch) {
      const next = state.setCount % 4 === 0 ? 2 : 1;
      setTimeout(() => {
        closeOverlay();
        setMode(next);
        if (state.autoSwitch) startTimer();
      }, 3000);
    }
  } else {
    // break completed
    showCompleteOverlay('break');
    playEndSound();
    if (state.autoSwitch) {
      setTimeout(() => {
        closeOverlay();
        setMode(0);
      }, 2000);
    }
  }

  updateMainBtn();
  renderStats();
}

function setMode(idx) {
  state.mode = idx;
  const mins = [state.focusMin, state.shortMin, state.longMin];
  state.totalDuration = mins[idx] * 60;
  state.timeLeft = state.totalDuration;
  renderTime();
  renderRing();
  renderModeLabel();
  updateModePills();
}

function updateStreak() {
  const today = todayStr();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (state.lastFocusDate === yesterday) {
    state.streak++;
  } else if (state.lastFocusDate !== today) {
    state.streak = 1;
  }
  if (state.streak > state.bestStreak) state.bestStreak = state.streak;
  state.lastFocusDate = today;
}

// ── Audio ────────────────────────────────────────────────────
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playEndSound() {
  if (!state.notifySound) return;
  try {
    const ctx = getAudioCtx();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.start(t); osc.stop(t + 0.5);
    });
  } catch (_) {}
}

// BGM generators
function createRainNode(ctx) {
  const bufSize = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 600;
  filter.Q.value = 0.5;
  src.connect(filter);
  src.start();
  return filter;
}

function createCafeNode(ctx) {
  const osc = ctx.createOscillator();
  osc.type = 'brown' in OscillatorNode ? 'brown' : 'sawtooth';
  osc.frequency.value = 80;
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.value = 300;
  const gain2 = ctx.createGain(); gain2.gain.value = 0.3;
  osc.connect(f); f.connect(gain2);
  osc.start();
  return gain2;
}

function createLofiNode(ctx) {
  const bufSize = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.value = 800;
  src.connect(f); src.start();
  return f;
}

function createWaveNode(ctx) {
  const bufSize = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    const wave = Math.sin(i / ctx.sampleRate * 2 * Math.PI * 0.3);
    data[i] = (Math.random() * 2 - 1) * 0.5 * (0.5 + 0.5 * wave);
  }
  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass'; f.frequency.value = 800; f.Q.value = 0.3;
  src.connect(f); src.start();
  return f;
}

function createForestNode(ctx) {
  const bufSize = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.2;
  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true;
  const f1 = ctx.createBiquadFilter();
  f1.type = 'bandpass'; f1.frequency.value = 2000; f1.Q.value = 1;
  const f2 = ctx.createBiquadFilter();
  f2.type = 'bandpass'; f2.frequency.value = 4000; f2.Q.value = 2;
  src.connect(f1); f1.connect(f2); src.start();
  return f2;
}

function createFireNode(ctx) {
  const bufSize = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.value = 500;
  src.connect(f); src.start();
  return f;
}

const BGM_CREATORS = [createRainNode, createCafeNode, createLofiNode, createWaveNode, createForestNode, createFireNode];

function startBGM() {
  if (!state.bgmOn) return;
  stopBGM();
  try {
    const ctx = getAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
    bgmGain = ctx.createGain();
    bgmGain.gain.value = state.bgmVol;
    bgmNode = BGM_CREATORS[state.bgmType](ctx);
    bgmNode.connect(bgmGain);
    bgmGain.connect(ctx.destination);
  } catch (_) {}
}

function stopBGM() {
  try {
    if (bgmGain) { bgmGain.disconnect(); bgmGain = null; }
    if (bgmNode) { bgmNode.disconnect(); bgmNode = null; }
  } catch (_) {}
}

function toggleBGM() {
  state.bgmOn = !state.bgmOn;
  if (state.bgmOn) startBGM(); else stopBGM();
  document.getElementById('bgm-toggle').classList.toggle('on', state.bgmOn);
  document.getElementById('bgm-toggle').textContent = state.bgmOn ? '🎵' : '🔇';
  save();
}

// ── Theme ────────────────────────────────────────────────────
function applyTheme(theme) {
  state.theme = theme;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = theme === 'dark' || (theme === 'system' && prefersDark);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === theme);
  });
  save();
}

// ── Overlays ─────────────────────────────────────────────────
function showCompleteOverlay(type) {
  const overlay = document.getElementById('complete-overlay');
  const emoji = document.getElementById('complete-emoji');
  const title = document.getElementById('complete-title');
  const sub   = document.getElementById('complete-sub');

  if (type === 'focus') {
    emoji.textContent = '🎉';
    title.textContent = '集中完了！';
    sub.textContent = `素晴らしい！今日${state.todayCount}回目の集中です。\n植物が少し育ちました 🌿`;
    sub.textContent = `素晴らしい！今日${state.todayCount}回目の集中です。植物が少し育ちました 🌿`;
  } else {
    emoji.textContent = '☕';
    title.textContent = '休憩終了！';
    sub.textContent = '次の集中に進みましょう。';
  }
  overlay.classList.add('show');
}

function closeOverlay() {
  document.getElementById('complete-overlay').classList.remove('show');
}

// ── Particles ─────────────────────────────────────────────────
function spawnParticles() {
  const container = document.getElementById('particles');
  const emojis = ['🌸', '⭐', '✨', '🌿', '🎊'];
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = (50 + Math.random() * 40) + 'vh';
    p.style.animationDelay = Math.random() * 0.5 + 's';
    container.appendChild(p);
    setTimeout(() => p.remove(), 2000);
  }
}

// ── Render ────────────────────────────────────────────────────
function renderTime() {
  const m = Math.floor(state.timeLeft / 60).toString().padStart(2, '0');
  const s = (state.timeLeft % 60).toString().padStart(2, '0');
  document.getElementById('timer-time').textContent = `${m}:${s}`;
}

function renderRing() {
  const ring = document.getElementById('ring-progress');
  if (!ring) return;
  const r = 108;
  const circ = 2 * Math.PI * r;
  const pct = state.totalDuration > 0 ? state.timeLeft / state.totalDuration : 1;
  ring.style.strokeDasharray = circ;
  ring.style.strokeDashoffset = circ * (1 - pct);
  ring.setAttribute('class', 'ring-progress ' + (MODES[state.mode].ring || ''));
}

function renderModeLabel() {
  document.getElementById('mode-label').textContent = MODES[state.mode].label;
  document.getElementById('set-label').textContent = `${state.setCount % 4}/4 セット`;
}

function updateModePills() {
  document.querySelectorAll('.mode-pill').forEach((p, i) => {
    p.classList.toggle('active', i === state.mode);
  });
}

function updateMainBtn() {
  const btn = document.getElementById('btn-main');
  btn.textContent = state.running ? '⏸' : '▶';
  btn.classList.toggle('running', state.running);
}

function renderStats() {
  document.getElementById('stat-today').textContent = state.todayCount;
  document.getElementById('stat-total').textContent = state.totalCount;
  document.getElementById('stat-time').textContent = `${Math.floor(state.totalFocusMin / 60)}h${state.totalFocusMin % 60}m`;
}

function renderLevel() {
  document.getElementById('level-label').textContent = `Lv.${state.level} 集中者`;
  document.getElementById('level-xp').textContent = `${state.xp} / ${XP_PER_LEVEL} XP`;
  document.getElementById('xp-fill').style.width = (state.xp / XP_PER_LEVEL * 100) + '%';
}

function renderPlant() {
  const stage = STAGES[state.plant.stageIdx];
  document.getElementById('plant-emoji').textContent = stage.emoji;
  document.getElementById('plant-stage-name').textContent = stage.name + ' 段階';

  // dots
  document.querySelectorAll('.stage-dot').forEach((d, i) => {
    d.classList.toggle('reached', i <= state.plant.stageIdx);
    d.classList.toggle('current', i === state.plant.stageIdx);
  });

  // growth bar
  document.getElementById('growth-fill').style.width = state.plant.growth + '%';
  document.getElementById('growth-pct').textContent = state.plant.growth + '%';
  document.getElementById('growth-stage-label').textContent = `${stage.name} → ${STAGES[Math.min(state.plant.stageIdx + 1, STAGES.length - 1)].name}`;

  // stage cards
  document.querySelectorAll('.stage-card').forEach((c, i) => {
    c.classList.toggle('unlocked', i <= state.plant.stageIdx);
    c.classList.toggle('current', i === state.plant.stageIdx);
  });
}

function renderMissions() {
  const list = document.getElementById('missions-list');
  list.innerHTML = '';
  state.missions.forEach(m => {
    const div = document.createElement('div');
    div.className = 'mission-item' + (m.done ? ' done' : '');
    div.innerHTML = `
      <div class="mission-check">${m.done ? '✓' : ''}</div>
      <div class="mission-text">${m.text}</div>
      <div class="mission-reward">+${m.xp}XP</div>
    `;
    list.appendChild(div);
  });
}

function renderRecords() {
  document.getElementById('rec-today').textContent = state.todayCount;
  document.getElementById('rec-total').textContent = state.totalCount;
  document.getElementById('rec-time').textContent = `${state.totalFocusMin}分`;
  document.getElementById('rec-streak').textContent = state.streak;
  document.getElementById('streak-days').textContent = state.streak + '日';
  document.getElementById('streak-best').textContent = `最長記録: ${state.bestStreak}日`;
}

function renderFocusType() {
  const types = [
    { min: 0,  emoji: '🌱', name: '初心者',      desc: 'これから習慣を育てましょう！毎日1回からスタート。' },
    { min: 5,  emoji: '☕', name: 'カフェタイプ', desc: 'まとまった集中が得意。リラックスしながら集中できます。' },
    { min: 15, emoji: '🎯', name: '集中型',       desc: '高い集中力の持ち主。目標に向かってまっすぐ進みます。' },
    { min: 30, emoji: '🔥', name: 'ワーカーホリック', desc: '圧倒的な集中量。休憩も大切にしましょう。' },
  ];
  let t = types[0];
  for (const tp of types) {
    if (state.totalCount >= tp.min) t = tp;
  }
  document.getElementById('type-emoji').textContent = t.emoji;
  document.getElementById('type-name').textContent = t.name;
  document.getElementById('type-desc').textContent = t.desc;
}

function renderAll() {
  renderTime();
  renderRing();
  renderModeLabel();
  updateModePills();
  updateMainBtn();
  renderStats();
  renderLevel();
  renderPlant();
  renderMissions();
  renderRecords();
  renderFocusType();
  renderSettings();
}

function renderSettings() {
  document.getElementById('set-focus').value  = state.focusMin;
  document.getElementById('set-short').value  = state.shortMin;
  document.getElementById('set-long').value   = state.longMin;
  document.getElementById('toggle-auto').classList.toggle('on', state.autoSwitch);
  document.getElementById('toggle-sound').classList.toggle('on', state.notifySound);
  document.getElementById('bgm-select').value = state.bgmType;
  document.getElementById('bgm-vol').value    = state.bgmVol;
  document.getElementById('bgm-toggle').classList.toggle('on', state.bgmOn);
  document.getElementById('bgm-toggle').textContent = state.bgmOn ? '🎵' : '🔇';
}

// ── Toast ─────────────────────────────────────────────────────
function toast(msg) {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

// ── Tab Navigation ─────────────────────────────────────────────
let currentTab = 0;

function switchTab(idx) {
  currentTab = idx;
  document.querySelectorAll('.screen').forEach((s, i) => s.classList.toggle('active', i === idx));
  document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
  if (idx === 2) { renderRecords(); renderMissions(); renderFocusType(); }
}

// ── Swipe ─────────────────────────────────────────────────────
let touchStartX = 0;
function setupSwipe() {
  const el = document.getElementById('screens');
  el.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 50) return;
    if (dx < 0 && currentTab < 3) switchTab(currentTab + 1);
    if (dx > 0 && currentTab > 0) switchTab(currentTab - 1);
  }, { passive: true });
}

// ── Init ──────────────────────────────────────────────────────
function init() {
  load();
  applyTheme(state.theme);
  renderAll();
  switchTab(0);
  setupSwipe();

  // Timer controls
  document.getElementById('btn-main').addEventListener('click', () => {
    if (state.running) pauseTimer(); else startTimer();
  });
  document.getElementById('btn-reset').addEventListener('click', resetTimer);
  document.getElementById('btn-skip').addEventListener('click', () => {
    clearInterval(timerInterval);
    state.running = false;
    const next = state.mode === 0 ? (state.setCount % 4 === 3 ? 2 : 1) : 0;
    setMode(next);
    updateMainBtn();
  });

  // Mode pills
  document.querySelectorAll('.mode-pill').forEach((p, i) => {
    p.addEventListener('click', () => { resetTimer(); setMode(i); });
  });

  // BGM
  document.getElementById('bgm-toggle').addEventListener('click', toggleBGM);
  document.getElementById('bgm-select').addEventListener('change', e => {
    state.bgmType = parseInt(e.target.value);
    if (state.bgmOn) { stopBGM(); startBGM(); }
    save();
  });
  document.getElementById('bgm-vol').addEventListener('input', e => {
    state.bgmVol = parseFloat(e.target.value);
    if (bgmGain) bgmGain.gain.value = state.bgmVol;
    save();
  });

  // Tab buttons
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.addEventListener('click', () => switchTab(i));
  });

  // Overlay close
  document.getElementById('btn-close-overlay').addEventListener('click', closeOverlay);
  document.getElementById('complete-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeOverlay();
  });

  // Settings
  document.getElementById('set-focus').addEventListener('change', e => {
    state.focusMin = Math.max(1, parseInt(e.target.value) || 25);
    if (state.mode === 0) setMode(0);
    save();
  });
  document.getElementById('set-short').addEventListener('change', e => {
    state.shortMin = Math.max(1, parseInt(e.target.value) || 5);
    if (state.mode === 1) setMode(1);
    save();
  });
  document.getElementById('set-long').addEventListener('change', e => {
    state.longMin = Math.max(1, parseInt(e.target.value) || 20);
    if (state.mode === 2) setMode(2);
    save();
  });
  document.getElementById('toggle-auto').addEventListener('click', e => {
    state.autoSwitch = !state.autoSwitch;
    e.currentTarget.classList.toggle('on', state.autoSwitch);
    save();
  });
  document.getElementById('toggle-sound').addEventListener('click', e => {
    state.notifySound = !state.notifySound;
    e.currentTarget.classList.toggle('on', state.notifySound);
    save();
  });
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.addEventListener('click', () => applyTheme(b.dataset.theme));
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (state.theme === 'system') applyTheme('system');
  });

  document.getElementById('btn-reset-all').addEventListener('click', () => {
    if (confirm('すべてのデータをリセットしますか？')) {
      localStorage.removeItem('pomodoro_v1');
      location.reload();
    }
  });

  // SW
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', init);
