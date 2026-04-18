/* ========== i18n ========== */
const LANG = {
  ja: {
    appName: '⏱ カウントダウンタイマー',
    modeNormal: '通常', modeRoutine: 'ルーチン', modeMulti: 'マルチ', modePomodoro: 'ポモドーロ',
    achToday: '今日', achStreak: '連続', achTotal: '累計',
    presetBtn: 'プリセット', presetTitle: 'プリセット',
    helpTitle: '使い方',
    start: 'スタート', pause: '一時停止', resume: '再開', reset: 'リセット',
    resetAll: '全リセット', startAll: '全スタート', add: '追加', addStep: '追加',
    save: '保存', editStep: 'ステップ編集',
    saveRoutine: '保存', loadRoutine: '呼出',
    saveRoutineTitle: 'ルーチンを保存', loadRoutineTitle: '保存済みルーチン',
    routineNamePlaceholder: 'ルーチン名（例：朝の運動）',
    routineSaveHint: (n) => `${n}ステップを保存します`,
    noSavedRoutines: '保存済みルーチンがありません',
    routineLoadBtn: '読み込む', routineDelBtn: '削除',
    routineLoopLabel: 'ループあり',
    hours: '時間', minutes: '分', seconds: '秒', minUnit: '分',
    ready: '準備完了', running: '実行中', paused: '一時停止中',
    noSteps: 'ステップなし', addStepHint: '＋ ステップを追加してください',
    addTimerHint: '＋ タイマーを追加してください',
    stepTitlePlaceholder: 'ステップ名', timerNamePlaceholder: 'タイマー名',
    work: '作業', breakTime: '休憩', longBreak: '長休憩', sets: 'セット',
    workTime: '作業', nextStep: '次：',
    complete: '完了！', soundSelect: 'サウンド選択',
    soundBell: '🔔 ベル', soundElec: '📟 電子音', soundGentle: '🎵 やさしい',
    loopOn: 'ループON', loopOff: 'ループOFF',
    helpSections: [
      { icon: '⏱', title: '通常タイマー', body: ['時間・分・秒を設定してカウントダウン', 'スタート → 一時停止 → 再開が可能', 'ラスト10秒で赤くなり完了音が鳴る'] },
      { icon: '📋', title: 'ルーチンタイマー', body: ['複数のステップを順番に自動実行', 'ステップの追加・並び替え・時間編集が可能', '🔁 ループONで繰り返し実行'] },
      { icon: '⏲', title: 'マルチタイマー', body: ['複数のタイマーを同時に起動', '色分けで見やすく管理', '全スタート・全リセットで一括操作'] },
      { icon: '🍅', title: 'ポモドーロ', body: ['作業・休憩・長休憩のサイクルを自動管理', '作業時間・休憩時間・セット数をカスタマイズ', 'セッションドットで進捗を確認'] },
      { icon: '⚡', title: 'その他機能', body: ['プリセットでよく使う設定を一発呼出', 'ダークモード・日英切替に対応', '完了回数を今日・連続・累計で記録', 'PWA対応：ホーム画面に追加してオフライン使用可'] },
    ],
    presets: [
      { emoji: '📚', name: '勉強（ポモドーロ）', desc: '25分作業 + 5分休憩', mode: 'pomodoro', config: { work: 25, brk: 5, lng: 15, sets: 4 } },
      { emoji: '💪', name: '筋トレ（インターバル）', desc: '40秒 × 8セット + 20秒休憩', mode: 'routine', config: { steps: [{ name: '筋トレ', sec: 40 }, { name: '休憩', sec: 20 }], loop: true } },
      { emoji: '🍜', name: 'ラーメン', desc: '3分', mode: 'normal', config: { h: 0, m: 3, s: 0 } },
      { emoji: '😴', name: '仮眠', desc: '15分', mode: 'normal', config: { h: 0, m: 15, s: 0 } },
      { emoji: '🪥', name: '歯みがき', desc: '3分', mode: 'normal', config: { h: 0, m: 3, s: 0 } },
    ]
  },
  en: {
    appName: '⏱ Countdown Timer',
    modeNormal: 'Normal', modeRoutine: 'Routine', modeMulti: 'Multi', modePomodoro: 'Pomodoro',
    achToday: 'Today', achStreak: 'Streak', achTotal: 'Total',
    presetBtn: 'Presets', presetTitle: 'Presets',
    helpTitle: 'How to Use',
    start: 'Start', pause: 'Pause', resume: 'Resume', reset: 'Reset',
    resetAll: 'Reset All', startAll: 'Start All', add: 'Add', addStep: 'Add',
    save: 'Save', editStep: 'Edit Step',
    saveRoutine: 'Save', loadRoutine: 'Load',
    saveRoutineTitle: 'Save Routine', loadRoutineTitle: 'Saved Routines',
    routineNamePlaceholder: 'Routine name (e.g. Morning workout)',
    routineSaveHint: (n) => `Save ${n} step(s)`,
    noSavedRoutines: 'No saved routines',
    routineLoadBtn: 'Load', routineDelBtn: 'Delete',
    routineLoopLabel: 'Loop',
    hours: 'h', minutes: 'm', seconds: 's', minUnit: 'min',
    ready: 'Ready', running: 'Running', paused: 'Paused',
    noSteps: 'No steps', addStepHint: '+ Add a step',
    addTimerHint: '+ Add a timer',
    stepTitlePlaceholder: 'Step name', timerNamePlaceholder: 'Timer name',
    work: 'Work', breakTime: 'Break', longBreak: 'Long break', sets: 'Sets',
    workTime: 'Work', nextStep: 'Next:',
    complete: 'Done!', soundSelect: 'Select Sound',
    soundBell: '🔔 Bell', soundElec: '📟 Electronic', soundGentle: '🎵 Gentle',
    loopOn: 'Loop ON', loopOff: 'Loop OFF',
    helpSections: [
      { icon: '⏱', title: 'Normal Timer', body: ['Set hours, minutes, seconds and count down', 'Start → Pause → Resume supported', 'Turns red in last 10 seconds with sound'] },
      { icon: '📋', title: 'Routine Timer', body: ['Auto-run multiple steps in sequence', 'Add, reorder, and edit step times', '🔁 Loop ON to repeat the routine'] },
      { icon: '⏲', title: 'Multi Timer', body: ['Run multiple timers at the same time', 'Color-coded for easy identification', 'Start All / Reset All for batch control'] },
      { icon: '🍅', title: 'Pomodoro', body: ['Auto-cycle between work, break, long break', 'Customize work time, break time, sets', 'Track progress with session dots'] },
      { icon: '⚡', title: 'Other Features', body: ['Presets for quick setup of common routines', 'Dark mode & Japanese/English language toggle', 'Track completions: today, streak, total', 'PWA: add to home screen for offline use'] },
    ],
    presets: [
      { emoji: '📚', name: 'Study (Pomodoro)', desc: '25min work + 5min break', mode: 'pomodoro', config: { work: 25, brk: 5, lng: 15, sets: 4 } },
      { emoji: '💪', name: 'Workout (Interval)', desc: '40s × 8 sets + 20s rest', mode: 'routine', config: { steps: [{ name: 'Exercise', sec: 40 }, { name: 'Rest', sec: 20 }], loop: true } },
      { emoji: '🍜', name: 'Ramen', desc: '3 minutes', mode: 'normal', config: { h: 0, m: 3, s: 0 } },
      { emoji: '😴', name: 'Nap', desc: '15 minutes', mode: 'normal', config: { h: 0, m: 15, s: 0 } },
      { emoji: '🪥', name: 'Toothbrush', desc: '3 minutes', mode: 'normal', config: { h: 0, m: 3, s: 0 } },
    ]
  }
};

/* ========== State ========== */
const RING_CIRC = 2 * Math.PI * 95;

const state = {
  lang: localStorage.getItem('lang') || (navigator.language.startsWith('en') ? 'en' : 'ja'),
  dark: localStorage.getItem('dark') === 'true' || window.matchMedia('(prefers-color-scheme: dark)').matches,
  sound: localStorage.getItem('sound') !== 'false',
  soundType: localStorage.getItem('soundType') || 'bell',
  mode: 'normal',

  normal: { duration: 0, remaining: 0, running: false, timer: null },
  routine: { steps: [], currentStep: 0, running: false, remaining: 0, timer: null, loop: false },
  multi: { timers: [] },
  pomodoro: {
    running: false, timer: null, phase: 'work',
    currentSet: 0, remaining: 0,
    work: 25, brk: 5, lng: 15, sets: 4
  },

  achievements: JSON.parse(localStorage.getItem('achievements') || '{"today":0,"streak":0,"total":0,"lastDate":""}'),
  savedRoutines: JSON.parse(localStorage.getItem('savedRoutines') || '[]')
};

/* ========== Utils ========== */
const t = key => LANG[state.lang][key] || key;

function fmt(sec) {
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function setRing(el, ratio) {
  const offset = RING_CIRC * (1 - Math.max(0, Math.min(1, ratio)));
  el.style.strokeDashoffset = offset;
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.dark ? 'dark' : '');
  localStorage.setItem('dark', state.dark);
}

function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = LANG[state.lang][key];
    if (val !== undefined && typeof val === 'string')
      el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-tab]').forEach(el => {
    const key = el.getAttribute('data-i18n-tab');
    if (LANG[state.lang][key]) el.textContent = LANG[state.lang][key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (LANG[state.lang][key]) el.placeholder = LANG[state.lang][key];
  });
  localStorage.setItem('lang', state.lang);
  // Restore running-state button labels after translation
  syncButtonStates();
}

/* Sync start/pause/resume button text to match current running state */
function syncButtonStates() {
  const n = state.normal;
  const normalBtn = document.getElementById('normalStart');
  if (n.running) normalBtn.textContent = t('pause');
  else if (n.remaining > 0 && n.remaining < n.duration) normalBtn.textContent = t('resume');
  else normalBtn.textContent = t('start');

  const r = state.routine;
  const routineBtn = document.getElementById('routineStart');
  if (r.running) routineBtn.textContent = t('pause');
  else if (r.remaining > 0) routineBtn.textContent = t('resume');
  else routineBtn.textContent = t('start');

  const p = state.pomodoro;
  const pomoBtn = document.getElementById('pomoStart');
  if (p.running) pomoBtn.textContent = t('pause');
  else if (p.remaining > 0 && p.remaining < pomoGetPhaseDuration()) pomoBtn.textContent = t('resume');
  else pomoBtn.textContent = t('start');
}

/* ========== Sound ========== */
let audioCtx = null;
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playSound(type = state.soundType) {
  if (!state.sound) return;
  try {
    const ctx = getAudio();
    if (type === 'bell') {
      [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const at = ctx.currentTime + i * 0.15;
        gain.gain.setValueAtTime(0.4, at);
        gain.gain.exponentialRampToValueAtTime(0.001, at + 0.6);
        osc.start(at); osc.stop(at + 0.7);
      });
    } else if (type === 'electronic') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(); osc.stop(ctx.currentTime + 0.4);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 528;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.start(); osc.stop(ctx.currentTime + 1.3);
    }
  } catch(e) {}
}

function playTick() {
  if (!state.sound) return;
  try {
    const ctx = getAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine'; osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.start(); osc.stop(ctx.currentTime + 0.06);
  } catch(e) {}
}

/* ========== Achievements ========== */
function recordCompletion() {
  const today = new Date().toDateString();
  const a = state.achievements;
  if (a.lastDate === today) {
    a.today++;
  } else {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    a.streak = a.lastDate === yesterday ? a.streak + 1 : 1;
    a.today = 1;
    a.lastDate = today;
  }
  a.total++;
  localStorage.setItem('achievements', JSON.stringify(a));
  updateAchievementUI();
}

function updateAchievementUI() {
  document.getElementById('achToday').textContent = state.achievements.today;
  document.getElementById('achStreak').textContent = state.achievements.streak;
  document.getElementById('achTotal').textContent = state.achievements.total;
}

/* ========== Complete Animation ========== */
function showComplete(name) {
  recordCompletion();
  playSound();
  const overlay = document.getElementById('completeOverlay');
  const text = document.getElementById('completeText');
  text.textContent = name ? `${name} ${t('complete')}` : t('complete');
  overlay.classList.add('show');
  setTimeout(() => overlay.classList.remove('show'), 2200);
}

/* ========== Countdown 3,2,1 ========== */
function showCountdown(cb) {
  const overlay = document.getElementById('countdownOverlay');
  const num = document.getElementById('countdownNum');
  overlay.classList.add('show');
  let c = 3;
  num.textContent = c;
  playTick();
  const iv = setInterval(() => {
    c--;
    if (c <= 0) {
      clearInterval(iv);
      overlay.classList.remove('show');
      cb();
    } else {
      num.textContent = c;
      num.style.animation = 'none';
      num.offsetHeight; // reflow
      num.style.animation = 'popIn 0.4s ease';
      playTick();
    }
  }, 800);
}

/* ========== Mode Switch ========== */
function switchMode(mode) {
  state.mode = mode;
  document.querySelectorAll('.tab').forEach(tab => tab.classList.toggle('active', tab.dataset.mode === mode));
  document.querySelectorAll('.mode-section').forEach(s => s.classList.toggle('active', s.id === `mode-${mode}`));
}

/* ========== Normal Timer ========== */
const normalRing = document.getElementById('normalRing');

function normalUpdate() {
  const n = state.normal;
  document.getElementById('normalTime').textContent = fmt(n.remaining);
  const ratio = n.duration > 0 ? n.remaining / n.duration : 1;
  setRing(normalRing, ratio);
  const label = document.getElementById('normalLabel');
  if (n.remaining <= 0 && !n.running) {
    label.textContent = t('ready');
    normalRing.classList.remove('warning', 'danger');
    return;
  }
  if (n.remaining <= 10) normalRing.classList.add('danger');
  else if (n.remaining <= 30) { normalRing.classList.remove('danger'); normalRing.classList.add('warning'); }
  else normalRing.classList.remove('warning', 'danger');
  label.textContent = n.running ? t('running') : (n.remaining < n.duration ? t('paused') : t('ready'));
}

function normalStart() {
  const n = state.normal;
  const btn = document.getElementById('normalStart');
  if (!n.running && n.remaining <= 0) {
    const h = parseInt(document.getElementById('inputH').value) || 0;
    const m = parseInt(document.getElementById('inputM').value) || 0;
    const s = parseInt(document.getElementById('inputS').value) || 0;
    n.duration = h * 3600 + m * 60 + s;
    if (n.duration <= 0) return;
    n.remaining = n.duration;
    setRing(normalRing, 1);
    showCountdown(() => startNormalTick(btn));
    return;
  }
  if (n.running) {
    n.running = false;
    clearInterval(n.timer);
    btn.textContent = t('resume');
  } else {
    startNormalTick(btn);
  }
}

function startNormalTick(btn) {
  const n = state.normal;
  n.running = true;
  btn.textContent = t('pause');
  n.timer = setInterval(() => {
    n.remaining--;
    normalUpdate();
    if (n.remaining <= 0) {
      n.running = false;
      clearInterval(n.timer);
      btn.textContent = t('start');
      showComplete();
    }
  }, 1000);
}

function normalReset() {
  const n = state.normal;
  n.running = false;
  clearInterval(n.timer);
  n.remaining = 0;
  n.duration = 0;
  setRing(normalRing, 1);
  document.getElementById('normalTime').textContent = '00:00';
  document.getElementById('normalLabel').textContent = t('ready');
  normalRing.classList.remove('warning', 'danger');
  document.getElementById('normalStart').textContent = t('start');
}

document.getElementById('normalStart').addEventListener('click', normalStart);
document.getElementById('normalReset').addEventListener('click', normalReset);
setRing(normalRing, 1);

/* ========== Routine Timer ========== */
const routineRing = document.getElementById('routineRing');
let editingStepIdx = -1;

function renderRoutineSteps() {
  const container = document.getElementById('routineSteps');
  const r = state.routine;
  if (r.steps.length === 0) {
    container.innerHTML = `<div class="empty-state">${t('addStepHint')}</div>`;
    return;
  }
  container.innerHTML = r.steps.map((s, i) => `
    <div class="step-item ${i === r.currentStep && r.running ? 'current' : ''}" data-idx="${i}">
      <span class="step-num">${i + 1}</span>
      <span class="step-name">${s.name}</span>
      <span class="step-time">${fmt(s.sec)}</span>
      ${!r.running ? `
        <div class="step-actions">
          <button class="step-action-btn" data-up="${i}" title="↑">↑</button>
          <button class="step-action-btn" data-down="${i}" title="↓">↓</button>
          <button class="step-action-btn" data-edit="${i}" title="✏">✏</button>
          <button class="step-action-btn del" data-del="${i}" title="✕">✕</button>
        </div>
      ` : ''}
    </div>
  `).join('');

  container.querySelectorAll('[data-up]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.up);
      if (idx > 0) {
        [r.steps[idx - 1], r.steps[idx]] = [r.steps[idx], r.steps[idx - 1]];
        renderRoutineSteps();
      }
    });
  });
  container.querySelectorAll('[data-down]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.down);
      if (idx < r.steps.length - 1) {
        [r.steps[idx], r.steps[idx + 1]] = [r.steps[idx + 1], r.steps[idx]];
        renderRoutineSteps();
      }
    });
  });
  container.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => openStepEdit(parseInt(btn.dataset.edit)));
  });
  container.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      r.steps.splice(parseInt(btn.dataset.del), 1);
      renderRoutineSteps();
    });
  });
}

function openStepEdit(idx) {
  editingStepIdx = idx;
  const step = state.routine.steps[idx];
  const h = Math.floor(step.sec / 3600);
  const m = Math.floor((step.sec % 3600) / 60);
  const s = step.sec % 60;
  document.getElementById('editStepTitle').value = step.name;
  document.getElementById('editStepH').value = h;
  document.getElementById('editStepM').value = m;
  document.getElementById('editStepS').value = s;
  document.getElementById('stepEditOverlay').classList.add('open');
}

document.getElementById('saveStepEdit').addEventListener('click', () => {
  if (editingStepIdx < 0) return;
  const name = document.getElementById('editStepTitle').value.trim() || state.routine.steps[editingStepIdx].name;
  const h = parseInt(document.getElementById('editStepH').value) || 0;
  const m = parseInt(document.getElementById('editStepM').value) || 0;
  const s = parseInt(document.getElementById('editStepS').value) || 0;
  const total = h * 3600 + m * 60 + s;
  if (total <= 0) return;
  state.routine.steps[editingStepIdx] = { name, sec: total };
  document.getElementById('stepEditOverlay').classList.remove('open');
  editingStepIdx = -1;
  renderRoutineSteps();
});
document.getElementById('closeStepEdit').addEventListener('click', () => {
  document.getElementById('stepEditOverlay').classList.remove('open');
  editingStepIdx = -1;
});

function routineUpdateDisplay() {
  const r = state.routine;
  if (r.steps.length === 0) {
    document.getElementById('routineStepName').textContent = t('noSteps');
    document.getElementById('routineNextName').textContent = '';
    document.getElementById('routineTime').textContent = '--:--';
    setRing(routineRing, 1);
    return;
  }
  const cur = r.steps[r.currentStep];
  if (!cur) return;
  document.getElementById('routineStepName').textContent = cur.name;
  const nextIdx = r.currentStep + 1 < r.steps.length ? r.currentStep + 1 : (r.loop ? 0 : -1);
  document.getElementById('routineNextName').textContent =
    nextIdx >= 0 ? `${t('nextStep')} ${r.steps[nextIdx].name}` : '';
  document.getElementById('routineTime').textContent = fmt(r.remaining);
  setRing(routineRing, r.remaining / cur.sec);
  renderRoutineSteps();
}

function routineStart() {
  const r = state.routine;
  const btn = document.getElementById('routineStart');
  if (r.steps.length === 0) return;
  if (!r.running && r.remaining <= 0) {
    r.currentStep = 0;
    r.remaining = r.steps[0].sec;
    routineUpdateDisplay();
    showCountdown(() => startRoutineTick(btn));
    return;
  }
  if (r.running) {
    r.running = false;
    clearInterval(r.timer);
    btn.textContent = t('resume');
  } else {
    startRoutineTick(btn);
  }
}

function startRoutineTick(btn) {
  const r = state.routine;
  r.running = true;
  btn.textContent = t('pause');
  r.timer = setInterval(() => {
    r.remaining--;
    if (r.remaining <= 10 && r.remaining > 0) playTick();
    routineUpdateDisplay();
    if (r.remaining <= 0) {
      const nextStep = r.currentStep + 1;
      if (nextStep < r.steps.length) {
        r.currentStep = nextStep;
        r.remaining = r.steps[nextStep].sec;
        playSound('gentle');
        routineUpdateDisplay();
      } else if (r.loop) {
        r.currentStep = 0;
        r.remaining = r.steps[0].sec;
        playSound('gentle');
        routineUpdateDisplay();
      } else {
        r.running = false;
        r.remaining = 0;
        clearInterval(r.timer);
        btn.textContent = t('start');
        showComplete();
      }
    }
  }, 1000);
}

function routineReset() {
  const r = state.routine;
  r.running = false;
  clearInterval(r.timer);
  r.currentStep = 0;
  r.remaining = 0;
  setRing(routineRing, 1);
  document.getElementById('routineTime').textContent = '--:--';
  document.getElementById('routineStepName').textContent = r.steps.length > 0 ? r.steps[0].name : t('noSteps');
  document.getElementById('routineStart').textContent = t('start');
  renderRoutineSteps();
}

document.getElementById('routineStart').addEventListener('click', routineStart);
document.getElementById('routineReset').addEventListener('click', routineReset);
setRing(routineRing, 1);

document.getElementById('routineLoop').addEventListener('click', function() {
  state.routine.loop = !state.routine.loop;
  this.classList.toggle('active', state.routine.loop);
  this.title = state.routine.loop ? t('loopOn') : t('loopOff');
});

/* ========== Routine Save / Load ========== */
function persistSavedRoutines() {
  localStorage.setItem('savedRoutines', JSON.stringify(state.savedRoutines));
}

function fmtTotalSec(steps) {
  return fmt(steps.reduce((s, st) => s + st.sec, 0));
}

function renderSavedRoutines() {
  const container = document.getElementById('savedRoutineList');
  const list = state.savedRoutines;
  if (list.length === 0) {
    container.innerHTML = `<div class="empty-state">${t('noSavedRoutines')}</div>`;
    return;
  }
  container.innerHTML = list.map((r, i) => `
    <div class="saved-routine-item">
      <div class="saved-routine-info">
        <div class="saved-routine-name">${r.name}</div>
        <div class="saved-routine-meta">
          ${r.steps.length}${state.lang === 'ja' ? 'ステップ' : ' steps'} · ${fmtTotalSec(r.steps)}
          ${r.loop ? ` · 🔁 ${t('routineLoopLabel')}` : ''}
        </div>
      </div>
      <div class="saved-routine-actions">
        <button class="saved-routine-load" data-load="${i}">${t('routineLoadBtn')}</button>
        <button class="saved-routine-del" data-del="${i}">🗑</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('[data-load]').forEach(btn => {
    btn.addEventListener('click', () => {
      const r = state.savedRoutines[parseInt(btn.dataset.load)];
      state.routine.steps = r.steps.map(s => ({ ...s }));
      state.routine.loop = r.loop;
      document.getElementById('routineLoop').classList.toggle('active', r.loop);
      routineReset();
      document.getElementById('routineLoadOverlay').classList.remove('open');
    });
  });
  container.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.savedRoutines.splice(parseInt(btn.dataset.del), 1);
      persistSavedRoutines();
      renderSavedRoutines();
    });
  });
}

document.getElementById('routineSaveBtn').addEventListener('click', () => {
  if (state.routine.steps.length === 0) return;
  const hintFn = LANG[state.lang].routineSaveHint;
  document.getElementById('routineSaveHint').textContent = hintFn(state.routine.steps.length);
  document.getElementById('routineSaveName').value = '';
  document.getElementById('routineSaveOverlay').classList.add('open');
  setTimeout(() => document.getElementById('routineSaveName').focus(), 300);
});

document.getElementById('closeRoutineSave').addEventListener('click', () => {
  document.getElementById('routineSaveOverlay').classList.remove('open');
});
document.getElementById('routineSaveOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('routineSaveOverlay'))
    document.getElementById('routineSaveOverlay').classList.remove('open');
});

document.getElementById('confirmRoutineSave').addEventListener('click', () => {
  const name = document.getElementById('routineSaveName').value.trim();
  if (!name) return;
  state.savedRoutines.push({
    name,
    steps: state.routine.steps.map(s => ({ ...s })),
    loop: state.routine.loop
  });
  persistSavedRoutines();
  document.getElementById('routineSaveOverlay').classList.remove('open');
});

document.getElementById('routineLoadBtn').addEventListener('click', () => {
  renderSavedRoutines();
  document.getElementById('routineLoadOverlay').classList.add('open');
});

document.getElementById('closeRoutineLoad').addEventListener('click', () => {
  document.getElementById('routineLoadOverlay').classList.remove('open');
});
document.getElementById('routineLoadOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('routineLoadOverlay'))
    document.getElementById('routineLoadOverlay').classList.remove('open');
});

document.getElementById('addStep').addEventListener('click', () => {
  const title = document.getElementById('stepTitle').value.trim() || 'Step';
  const h = parseInt(document.getElementById('stepH').value) || 0;
  const min = parseInt(document.getElementById('stepMin').value) || 0;
  const sec = parseInt(document.getElementById('stepSec').value) || 0;
  const total = h * 3600 + min * 60 + sec;
  if (total <= 0) return;
  state.routine.steps.push({ name: title, sec: total });
  document.getElementById('stepTitle').value = '';
  document.getElementById('stepH').value = '0';
  document.getElementById('stepMin').value = '1';
  document.getElementById('stepSec').value = '0';
  renderRoutineSteps();
});
renderRoutineSteps();

/* ========== Multi Timer ========== */
const COLORS = ['#6c63ff','#ff6584','#43c6ac','#f7797d','#ffd200','#36d1dc','#cb356b','#11998e'];

function renderMultiTimers() {
  const container = document.getElementById('multiTimers');
  const timers = state.multi.timers;
  if (timers.length === 0) {
    container.innerHTML = `<div class="empty-state">${t('addTimerHint')}</div>`;
    return;
  }
  container.innerHTML = timers.map((timer, i) => `
    <div class="multi-item ${timer.remaining <= 0 && timer.started ? 'done' : ''}" data-idx="${i}">
      <div class="multi-color" style="background:${timer.color}"></div>
      <div class="multi-name">${timer.name}</div>
      <div class="multi-time" id="multiTime${i}">${fmt(timer.remaining)}</div>
      <div class="multi-controls">
        <button class="multi-btn" data-action="toggle" data-idx="${i}">${timer.running ? '⏸' : '▶'}</button>
        <button class="multi-btn" data-action="reset" data-idx="${i}">↺</button>
        <button class="multi-btn" data-action="del" data-idx="${i}">✕</button>
      </div>
    </div>
  `).join('');
  container.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      const action = btn.dataset.action;
      if (action === 'toggle') multiToggle(idx);
      else if (action === 'reset') multiReset(idx);
      else if (action === 'del') multiDelete(idx);
    });
  });
}

function multiTick(idx) {
  const timer = state.multi.timers[idx];
  if (!timer || !timer.running) return;
  timer.remaining--;
  const el = document.getElementById(`multiTime${idx}`);
  if (el) el.textContent = fmt(timer.remaining);
  if (timer.remaining <= 0) {
    timer.running = false;
    timer.started = true;
    clearInterval(timer.interval);
    playSound();
    renderMultiTimers();
  }
}

function multiToggle(idx) {
  const timer = state.multi.timers[idx];
  if (!timer) return;
  if (timer.running) {
    timer.running = false;
    clearInterval(timer.interval);
  } else {
    if (timer.remaining <= 0) timer.remaining = timer.duration;
    timer.running = true;
    timer.started = true;
    timer.interval = setInterval(() => multiTick(idx), 1000);
  }
  renderMultiTimers();
}

function multiReset(idx) {
  const timer = state.multi.timers[idx];
  if (!timer) return;
  timer.running = false;
  timer.started = false;
  clearInterval(timer.interval);
  timer.remaining = timer.duration;
  renderMultiTimers();
}

function multiDelete(idx) {
  const timer = state.multi.timers[idx];
  if (timer) clearInterval(timer.interval);
  state.multi.timers.splice(idx, 1);
  renderMultiTimers();
}

document.getElementById('addMulti').addEventListener('click', () => {
  const name = document.getElementById('multiName').value.trim() || `Timer ${state.multi.timers.length + 1}`;
  const h = parseInt(document.getElementById('multiH').value) || 0;
  const min = parseInt(document.getElementById('multiMin').value) || 0;
  const sec = parseInt(document.getElementById('multiSec').value) || 0;
  const total = h * 3600 + min * 60 + sec;
  if (total <= 0) return;
  const color = COLORS[state.multi.timers.length % COLORS.length];
  state.multi.timers.push({ name, duration: total, remaining: total, running: false, started: false, color, interval: null });
  document.getElementById('multiName').value = '';
  document.getElementById('multiH').value = '0';
  document.getElementById('multiMin').value = '3';
  document.getElementById('multiSec').value = '0';
  renderMultiTimers();
});

document.getElementById('multiStartAll').addEventListener('click', () => {
  state.multi.timers.forEach((timer, idx) => {
    if (!timer.running && timer.remaining > 0) multiToggle(idx);
  });
});

document.getElementById('multiResetAll').addEventListener('click', () => {
  state.multi.timers.forEach((_, idx) => multiReset(idx));
});

renderMultiTimers();

/* ========== Pomodoro ========== */
const pomoRing = document.getElementById('pomoRing');

function pomoGetPhaseDuration() {
  const p = state.pomodoro;
  if (p.phase === 'work') return p.work * 60;
  if (p.phase === 'longbreak') return p.lng * 60;
  return p.brk * 60;
}

function pomoUpdateDisplay() {
  const p = state.pomodoro;
  document.getElementById('pomoTime').textContent = fmt(p.remaining);
  const total = pomoGetPhaseDuration();
  setRing(pomoRing, total > 0 ? p.remaining / total : 1);
  document.getElementById('pomoPhaseLabel').textContent =
    p.phase === 'work' ? t('work') : (p.phase === 'longbreak' ? t('longBreak') : t('breakTime'));
  document.getElementById('pomoSetsDisplay').textContent = `${p.currentSet + 1} / ${p.sets}`;
  pomoRing.classList.toggle('work-phase', p.phase === 'work');
  pomoRing.classList.toggle('break-phase', p.phase !== 'work');
  document.getElementById('pomoPhaseWork').classList.toggle('active', p.phase === 'work');
  document.getElementById('pomoPhaseBreak').classList.toggle('active', p.phase !== 'work');
  renderSessionDots();
}

function renderSessionDots() {
  const p = state.pomodoro;
  const container = document.getElementById('pomoSessionDots');
  container.innerHTML = Array.from({ length: p.sets }, (_, i) =>
    `<div class="session-dot ${i < p.currentSet ? 'done' : (i === p.currentSet ? 'current' : '')}"></div>`
  ).join('');
}

function pomoStart() {
  const p = state.pomodoro;
  const btn = document.getElementById('pomoStart');
  p.work  = parseInt(document.getElementById('pomoWorkMin').value) || 25;
  p.brk   = parseInt(document.getElementById('pomoBreakMin').value) || 5;
  p.lng   = parseInt(document.getElementById('pomoLongMin').value) || 15;
  p.sets  = parseInt(document.getElementById('pomoSets').value) || 4;
  if (!p.running && p.remaining <= 0) {
    p.currentSet = 0;
    p.phase = 'work';
    p.remaining = p.work * 60;
    pomoUpdateDisplay();
    showCountdown(() => startPomoTick(btn));
    return;
  }
  if (p.running) {
    p.running = false;
    clearInterval(p.timer);
    btn.textContent = t('resume');
  } else {
    startPomoTick(btn);
  }
}

function startPomoTick(btn) {
  const p = state.pomodoro;
  p.running = true;
  btn.textContent = t('pause');
  p.timer = setInterval(() => {
    p.remaining--;
    if (p.remaining <= 10 && p.remaining > 0) playTick();
    pomoUpdateDisplay();
    if (p.remaining <= 0) {
      if (p.phase === 'work') {
        p.currentSet++;
        recordCompletion();
        playSound();
        if (p.currentSet >= p.sets) {
          p.running = false;
          clearInterval(p.timer);
          btn.textContent = t('start');
          showComplete();
          p.remaining = 0;
          return;
        }
        p.phase = p.currentSet % p.sets === 0 ? 'longbreak' : 'break';
        p.remaining = pomoGetPhaseDuration();
      } else {
        p.phase = 'work';
        p.remaining = p.work * 60;
        playSound('gentle');
      }
      pomoUpdateDisplay();
    }
  }, 1000);
}

function pomoReset() {
  const p = state.pomodoro;
  p.running = false;
  clearInterval(p.timer);
  p.currentSet = 0;
  p.phase = 'work';
  p.remaining = 0;
  setRing(pomoRing, 1);
  document.getElementById('pomoStart').textContent = t('start');
  pomoUpdateDisplay();
}

document.getElementById('pomoStart').addEventListener('click', pomoStart);
document.getElementById('pomoReset').addEventListener('click', pomoReset);

['pomoWorkMin','pomoBreakMin','pomoLongMin','pomoSets'].forEach(id => {
  document.getElementById(id).addEventListener('change', () => {
    if (!state.pomodoro.running) {
      state.pomodoro.remaining = 0;
      pomoUpdateDisplay();
    }
  });
});

state.pomodoro.remaining = state.pomodoro.work * 60;
setRing(pomoRing, 1);
pomoUpdateDisplay();

/* ========== Presets ========== */
function renderPresets() {
  const list = document.getElementById('presetList');
  const presets = LANG[state.lang].presets;
  list.innerHTML = presets.map((p, i) => `
    <button class="preset-item" data-idx="${i}">
      <span class="preset-emoji">${p.emoji}</span>
      <div class="preset-info">
        <div class="preset-name">${p.name}</div>
        <div class="preset-desc">${p.desc}</div>
      </div>
      <span class="preset-mode">${LANG[state.lang]['mode' + p.mode.charAt(0).toUpperCase() + p.mode.slice(1)]}</span>
    </button>
  `).join('');
  list.querySelectorAll('.preset-item').forEach(btn => {
    btn.addEventListener('click', () => {
      applyPreset(LANG[state.lang].presets[parseInt(btn.dataset.idx)]);
      document.getElementById('presetOverlay').classList.remove('open');
    });
  });
}

function applyPreset(preset) {
  switchMode(preset.mode);
  const c = preset.config;
  if (preset.mode === 'normal') {
    document.getElementById('inputH').value = c.h;
    document.getElementById('inputM').value = c.m;
    document.getElementById('inputS').value = c.s;
    normalReset();
  } else if (preset.mode === 'pomodoro') {
    document.getElementById('pomoWorkMin').value = c.work;
    document.getElementById('pomoBreakMin').value = c.brk;
    document.getElementById('pomoLongMin').value = c.lng;
    document.getElementById('pomoSets').value = c.sets;
    state.pomodoro.work = c.work; state.pomodoro.brk = c.brk;
    state.pomodoro.lng = c.lng; state.pomodoro.sets = c.sets;
    pomoReset();
  } else if (preset.mode === 'routine') {
    state.routine.steps = c.steps.map(s => ({ ...s }));
    state.routine.loop = c.loop || false;
    document.getElementById('routineLoop').classList.toggle('active', state.routine.loop);
    routineReset();
  }
}

document.getElementById('openPreset').addEventListener('click', () => {
  renderPresets();
  document.getElementById('presetOverlay').classList.add('open');
});
document.getElementById('closePreset').addEventListener('click', () => {
  document.getElementById('presetOverlay').classList.remove('open');
});
document.getElementById('presetOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('presetOverlay'))
    document.getElementById('presetOverlay').classList.remove('open');
});

/* ========== Help Modal ========== */
function renderHelp() {
  const sections = LANG[state.lang].helpSections;
  document.getElementById('helpContent').innerHTML = sections.map(s => `
    <div class="help-section">
      <div class="help-section-title">${s.icon} ${s.title}</div>
      <div class="help-section-body"><ul>${s.body.map(b => `<li>${b}</li>`).join('')}</ul></div>
    </div>
  `).join('');
}

document.getElementById('helpToggle').addEventListener('click', () => {
  renderHelp();
  document.getElementById('helpOverlay').classList.add('open');
});
document.getElementById('closeHelp').addEventListener('click', () => {
  document.getElementById('helpOverlay').classList.remove('open');
});
document.getElementById('helpOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('helpOverlay'))
    document.getElementById('helpOverlay').classList.remove('open');
});

/* ========== Sound Toggle ========== */
const soundPanel = document.getElementById('soundPanel');
document.getElementById('soundToggle').addEventListener('click', () => {
  if (soundPanel.classList.contains('open')) {
    soundPanel.classList.remove('open');
  } else {
    state.sound = !state.sound;
    document.getElementById('soundToggle').classList.toggle('muted', !state.sound);
    document.getElementById('soundToggle').textContent = state.sound ? '🔔' : '🔕';
    localStorage.setItem('sound', state.sound);
    if (state.sound) {
      soundPanel.classList.add('open');
      setTimeout(() => document.addEventListener('click', closeSoundPanel, { once: true }), 100);
    }
  }
});

function closeSoundPanel(e) {
  if (!soundPanel.contains(e.target)) soundPanel.classList.remove('open');
}

document.querySelectorAll('.sound-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    state.soundType = btn.dataset.sound;
    localStorage.setItem('soundType', state.soundType);
    document.querySelectorAll('.sound-opt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    playSound(state.soundType);
    soundPanel.classList.remove('open');
  });
});

document.querySelector(`.sound-opt[data-sound="${state.soundType}"]`)?.classList.add('active');
if (!state.sound) {
  document.getElementById('soundToggle').classList.add('muted');
  document.getElementById('soundToggle').textContent = '🔕';
}

/* ========== Dark / Lang Toggle ========== */
document.getElementById('darkToggle').addEventListener('click', () => {
  state.dark = !state.dark;
  applyTheme();
  document.getElementById('darkToggle').textContent = state.dark ? '☀️' : '🌙';
});

document.getElementById('langToggle').addEventListener('click', () => {
  state.lang = state.lang === 'ja' ? 'en' : 'ja';
  applyLang();
  renderRoutineSteps();
  renderMultiTimers();
  renderPresets();
  updateAchievementUI();
});

/* ========== Mode Tabs ========== */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => switchMode(tab.dataset.mode));
});

/* ========== Swipe ========== */
const MODES = ['normal', 'routine', 'multi', 'pomodoro'];
let touchStartX = 0;
document.getElementById('mainContent').addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
document.getElementById('mainContent').addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) < 60) return;
  const idx = MODES.indexOf(state.mode);
  if (dx < 0 && idx < MODES.length - 1) switchMode(MODES[idx + 1]);
  else if (dx > 0 && idx > 0) switchMode(MODES[idx - 1]);
}, { passive: true });

/* ========== Init ========== */
applyTheme();
applyLang();
updateAchievementUI();
document.getElementById('darkToggle').textContent = state.dark ? '☀️' : '🌙';

/* ========== PWA ========== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}
