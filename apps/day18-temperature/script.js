'use strict';

// ─── 豆知識データ ───────────────────────────────────────
const triviaData = {
  base: [
    "摂氏は水の凍結と沸騰を基準にしています",
    "華氏は別の基準で作られた温度単位です",
    "ケルビンは絶対零度が基準です",
    "人の平熱は約36〜37℃です",
    "水は0℃で凍り100℃で沸騰します",
    "温度はエネルギーの指標です",
    "気温は地表の空気の温度です",
    "華氏32度は摂氏0度です",
    "華氏212度は摂氏100度です",
    "温度は分子の運動と関係しています"
  ],
  origin: [
    "摂氏（℃）はスウェーデンの天文学者アンデルス・セルシウスに由来します",
    "華氏（℉）はドイツの物理学者ガブリエル・ファーレンハイトに由来します",
    "ファーレンハイトは塩水の凍結温度を0℉の基準にしました",
    "セルシウスが℃を提案したのは1742年のことです",
    "昔は地域ごとに独自の温度基準が使われていました",
    "科学分野ではケルビン（K）が標準単位として使われます",
    "摂氏と華氏は約1714年〜1742年に各国で確立されました"
  ],
  temp: [
    "0℃は水が凍り始める温度です",
    "100℃は水の沸点（1気圧）です",
    "37℃は人の平熱です",
    "室温は20〜25℃が快適とされます",
    "夏日は25℃以上を指します",
    "真夏日は30℃以上、猛暑日は35℃以上です",
    "人の体感温度は湿度や風速によっても変わります",
    "海水は約-1.8℃で凍り始めます",
    "太陽の表面温度は約5500℃です",
    "月面では-170℃〜130℃の大きな寒暖差があります",
    "絶対零度は-273.15℃（0K）で理論上の最低温度です"
  ]
};

// ─── 体感データ ─────────────────────────────────────────
const feelingData = [
  { min: -Infinity, max: -30, emoji: '🥶', label: '極寒・危険な寒さ', badge: '極寒', badgeColor: '#0D47A1', scene: '北極・南極のような凍える環境', bg: '#E3F2FD' },
  { min: -30,       max: -15, emoji: '❄️',  label: 'かなり厳しい寒さ', badge: '厳寒', badgeColor: '#1565C0', scene: '北海道の真冬の夜のような温度', bg: '#E8F4FD' },
  { min: -15,       max:  0,  emoji: '🧊',  label: '氷点下の寒さ',     badge: '寒い', badgeColor: '#1976D2', scene: '水が凍る寒さ。路面凍結に注意', bg: '#EDF6FB' },
  { min:   0,       max:  5,  emoji: '🌨️',  label: '冬の冷たさ',       badge: '寒い', badgeColor: '#1E88E5', scene: '冬の朝、息が白くなる温度', bg: '#F0F8FF' },
  { min:   5,       max: 10,  emoji: '🧥',  label: '少し寒い',         badge: 'やや寒', badgeColor: '#2196F3', scene: '冬の昼間。厚手のコートが必要', bg: '#F3F9FC' },
  { min:  10,       max: 15,  emoji: '🍂',  label: 'ひんやり',         badge: 'ひんやり', badgeColor: '#42A5F5', scene: '秋冬の気温。上着があると安心', bg: '#F5FAFC' },
  { min:  15,       max: 20,  emoji: '🌸',  label: '少し涼しい',       badge: '涼しい', badgeColor: '#4CAF50', scene: '春・秋の気候。薄手のジャケットくらい', bg: '#F5FBF5' },
  { min:  20,       max: 24,  emoji: '😊',  label: '快適',             badge: '快適', badgeColor: '#43A047', scene: '過ごしやすい気温。半袖でちょうどいい', bg: '#F0FAF0' },
  { min:  24,       max: 28,  emoji: '🌤️',  label: '過ごしやすい',     badge: '快適', badgeColor: '#66BB6A', scene: '夏手前のさわやかな陽気', bg: '#F2FCF0' },
  { min:  28,       max: 32,  emoji: '☀️',  label: '暑い',             badge: '暑い', badgeColor: '#FFA726', scene: '夏日〜真夏日。冷たい飲み物が欲しい', bg: '#FFFDE7' },
  { min:  32,       max: 35,  emoji: '🌞',  label: 'かなり暑い',       badge: '猛暑', badgeColor: '#FF7043', scene: '猛暑日手前。熱中症に注意', bg: '#FFF8E1' },
  { min:  35,       max: 38,  emoji: '🥵',  label: '猛暑',             badge: '猛暑', badgeColor: '#F44336', scene: '猛暑日。日陰でも汗が止まらない', bg: '#FFF3E0' },
  { min:  38,       max: 41,  emoji: '🔥',  label: '危険な暑さ',       badge: '危険', badgeColor: '#E53935', scene: '熱中症のリスクが高い。外出を避けて', bg: '#FFF0E0' },
  { min:  41,       max: Infinity, emoji: '💀', label: '極めて危険',   badge: '極危険', badgeColor: '#B71C1C', scene: '生命の危険を伴う温度。直ちに涼しい場所へ', bg: '#FDECEA' },
];

// ─── 生活イメージデータ ──────────────────────────────────
const lifeSceneData = [
  { c: -273.15, label: '絶対零度。宇宙で最も冷たい理論上の限界温度' },
  { c: -89.2,   label: '地球上で観測された最低気温（南極・ボストーク基地）' },
  { c: -40,     label: '-40℃は-40℉と同じ値になる特別な温度' },
  { c: -18,     label: '冷凍庫の標準設定温度。食品の長期保存に適している' },
  { c:   0,     label: '水が凍る温度。川や湖が凍り始める目安' },
  { c:   4,     label: '冷蔵庫の適切な保存温度。細菌の増殖を抑えられる' },
  { c:  15,     label: '一般的なワインの保存に適した温度' },
  { c:  20,     label: '快適な室温の目安。冷暖房なしで過ごせる' },
  { c:  25,     label: '夏日の基準。屋外での活動が心地よい気温' },
  { c:  36.5,   label: '人の平熱（36〜37℃）。健康な体の温度' },
  { c:  37.5,   label: '微熱の目安。少し体調に注意が必要な温度' },
  { c:  42,     label: 'お風呂の熱め設定。長湯すると体に負担' },
  { c:  56,     label: '牛乳の低温殺菌温度。細菌を死滅させる' },
  { c:  60,     label: '熱いお風呂の温度。短時間しか入れない' },
  { c:  80,     label: 'お茶の適温。緑茶はやや低め（70〜80℃）が旨み引き出す' },
  { c: 100,     label: '水の沸騰点（1気圧）。パスタや卵をゆでる温度' },
  { c: 165,     label: '食品安全のための加熱基準（鶏肉など）' },
  { c: 180,     label: 'オーブン料理の標準温度。クッキーを焼く温度' },
  { c: 232,     label: '錫（スズ）の融点。はんだ付けに使われる金属' },
  { c: 327,     label: '鉛の融点。釣りのおもりに使われる金属' },
  { c: 660,     label: 'アルミニウムの融点。リサイクルで溶かされる温度' },
  { c:1064,     label: '金の融点。宝飾品の鋳造に使われる温度' },
  { c:1538,     label: '鉄の融点。製鉄所の高炉で使われる温度' },
  { c:5500,     label: '太陽の表面温度。これだけで全生命が一瞬で消える' },
];

// ─── 節目イベント ────────────────────────────────────────
const milestones = [
  { c: -273.15, label: '🔬 絶対零度 — 理論上の最低温度（0K）' },
  { c:  -40,    label: '📐 ℃と℉が同じ値になる特別な温度！' },
  { c:    0,    label: '💧 水の凝固点 — 水が氷になる温度' },
  { c:   20,    label: '🌡️ 標準気温 — 科学実験の基準温度' },
  { c:   37,    label: '👤 人の平熱 — 健康な体の温度' },
  { c:  100,    label: '♨️ 水の沸点 — 水が蒸気になる温度（1気圧）' },
];
const MILESTONE_TOLERANCE = 0.3;

// ─── ユーティリティ ──────────────────────────────────────
function cToF(c) { return c * 9 / 5 + 32; }
function fToC(f) { return (f - 32) * 5 / 9; }

function round(val, decimals) {
  return Number(Math.round(Number(val + 'e' + decimals)) + 'e-' + decimals);
}

function formatNum(val, decimals) {
  return round(val, decimals).toFixed(decimals);
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

// ─── 状態 ────────────────────────────────────────────────
let decimalPlaces = 2;
let history = [];
let triviaPool = [];
let triviaIndex = 0;
let lastCelsius = null;
let toastTimer = null;

// ─── DOM 参照 ────────────────────────────────────────────
const celsiusInput    = document.getElementById('celsius-input');
const fahrenheitInput = document.getElementById('fahrenheit-input');
const formulaDisplay  = document.getElementById('formula-display');
const copyBtn         = document.getElementById('copy-btn');
const meterMarker     = document.getElementById('meter-marker');
const markerDot       = document.getElementById('marker-dot');
const markerTemp      = document.getElementById('marker-temp');
const feelingCard     = document.getElementById('feeling-card');
const dangerBadge     = document.getElementById('danger-badge');
const feelingEmoji    = document.getElementById('feeling-emoji');
const feelingText     = document.getElementById('feeling-text');
const lifeSceneEl     = document.getElementById('life-scene');
const milestoneEl     = document.getElementById('milestone');
const historyList     = document.getElementById('history-list');
const triviaTextEl    = document.getElementById('trivia-text');
const toastEl         = document.getElementById('toast');

// ─── 初期化 ──────────────────────────────────────────────
function init() {
  loadSettings();
  loadHistory();
  buildTriviaPool();
  showTrivia();
  renderHistory();
  bindEvents();
  registerServiceWorker();
}

// ─── 設定 ────────────────────────────────────────────────
function loadSettings() {
  const saved = localStorage.getItem('temp_decimals');
  if (saved !== null) {
    decimalPlaces = parseInt(saved, 10);
  }
  document.querySelectorAll('.decimal-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.decimal, 10) === decimalPlaces);
  });
}

function saveSettings() {
  localStorage.setItem('temp_decimals', decimalPlaces);
}

// ─── 変換ロジック ────────────────────────────────────────
function updateFromCelsius(cVal) {
  if (cVal === '' || isNaN(cVal)) {
    fahrenheitInput.value = '';
    clearUI();
    return;
  }
  const c = parseFloat(cVal);
  const f = cToF(c);
  fahrenheitInput.value = formatNum(f, decimalPlaces);
  updateUI(c, f, '℃→℉');
}

function updateFromFahrenheit(fVal) {
  if (fVal === '' || isNaN(fVal)) {
    celsiusInput.value = '';
    clearUI();
    return;
  }
  const f = parseFloat(fVal);
  const c = fToC(f);
  celsiusInput.value = formatNum(c, decimalPlaces);
  updateUI(c, f, '℉→℃');
}

function clearUI() {
  formulaDisplay.textContent = '数値を入力してください';
  copyBtn.disabled = true;
  meterMarker.classList.remove('visible');
  dangerBadge.style.background = '#9E9E9E';
  dangerBadge.textContent = '－';
  feelingEmoji.textContent = '🌡️';
  feelingText.textContent = '温度を入力してください';
  lifeSceneEl.textContent = '';
  milestoneEl.classList.remove('visible');
  feelingCard.style.background = '';
  lastCelsius = null;
}

function updateUI(c, f, direction) {
  const cStr = formatNum(c, decimalPlaces);
  const fStr = formatNum(f, decimalPlaces);

  if (direction === '℃→℉') {
    formulaDisplay.innerHTML = `(<strong>${cStr}</strong> × 9/5) + 32 = <strong>${fStr}℉</strong>`;
  } else {
    formulaDisplay.innerHTML = `(<strong>${fStr}</strong> − 32) × 5/9 = <strong>${cStr}℃</strong>`;
  }

  copyBtn.disabled = false;
  lastCelsius = c;

  updateMeter(c);
  updateFeeling(c);
  addHistory(c, f);
}

// ─── メーター ────────────────────────────────────────────
const METER_MIN_C = -30;
const METER_MAX_C = 100;

function updateMeter(celsius) {
  const ratio = clamp((celsius - METER_MIN_C) / (METER_MAX_C - METER_MIN_C), 0, 1);
  meterMarker.style.left = `${ratio * 100}%`;
  meterMarker.classList.add('visible');
  markerTemp.textContent = `${formatNum(celsius, 1)}℃`;

  // ドットの色を温度で変える
  const r = Math.round(clamp(ratio * 2, 0, 1) * 215 + 21);
  const g = Math.round((1 - Math.abs(ratio - 0.5) * 2) * 100 + 50);
  const b = Math.round((1 - ratio) * 200 + 30);
  markerDot.style.borderColor = `rgb(${r},${g},${b})`;
}

// ─── 体感・生活イメージ ──────────────────────────────────
function updateFeeling(celsius) {
  const feeling = feelingData.find(d => celsius >= d.min && celsius < d.max)
    || feelingData[feelingData.length - 1];

  // カードの背景アニメーション
  feelingCard.style.background = `linear-gradient(135deg, ${feeling.bg}, var(--bg))`;

  // バッジ
  dangerBadge.style.background = feeling.badgeColor;
  dangerBadge.textContent = feeling.badge;

  // 絵文字ポップアニメーション
  if (feelingEmoji.textContent !== feeling.emoji) {
    feelingEmoji.classList.remove('pop');
    void feelingEmoji.offsetWidth;
    feelingEmoji.classList.add('pop');
    feelingEmoji.textContent = feeling.emoji;
  }

  // 体感テキスト
  const oldText = feelingText.textContent;
  if (oldText !== feeling.label) {
    feelingText.classList.remove('anim');
    void feelingText.offsetWidth;
    feelingText.classList.add('anim');
    feelingText.textContent = feeling.label;
  }

  // 生活イメージ
  const scene = getNearestScene(celsius);
  if (scene) {
    lifeSceneEl.textContent = `📍 ${scene}`;
  } else {
    lifeSceneEl.textContent = feeling.scene;
  }

  // 節目イベント
  const ms = milestones.find(m => Math.abs(celsius - m.c) < MILESTONE_TOLERANCE);
  if (ms) {
    milestoneEl.textContent = ms.label;
    milestoneEl.classList.add('visible');
  } else {
    milestoneEl.classList.remove('visible');
  }
}

function getNearestScene(celsius) {
  const sorted = [...lifeSceneData].sort((a, b) =>
    Math.abs(a.c - celsius) - Math.abs(b.c - celsius)
  );
  const nearest = sorted[0];
  if (nearest && Math.abs(nearest.c - celsius) < 2.5) {
    return nearest.label;
  }
  return null;
}

// ─── 履歴 ────────────────────────────────────────────────
let historyTimer = null;

function addHistory(c, f) {
  clearTimeout(historyTimer);
  historyTimer = setTimeout(() => {
    const cStr = formatNum(c, decimalPlaces);
    const fStr = formatNum(f, decimalPlaces);
    const entry = {
      label: `${cStr}℃ = ${fStr}℉`,
      c: c,
      f: f,
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    };
    // 重複除去（同じcの値があれば先頭に移動）
    history = history.filter(h => Math.abs(h.c - c) > 0.001);
    history.unshift(entry);
    if (history.length > 20) history.pop();
    saveHistory();
    renderHistory();
  }, 600);
}

function saveHistory() {
  localStorage.setItem('temp_history', JSON.stringify(history));
}

function loadHistory() {
  try {
    const saved = localStorage.getItem('temp_history');
    if (saved) history = JSON.parse(saved);
  } catch (e) {
    history = [];
  }
}

function renderHistory() {
  if (history.length === 0) {
    historyList.innerHTML = '<div class="empty-message">まだ履歴がありません</div>';
    return;
  }
  historyList.innerHTML = history.map((h, i) => `
    <button class="history-item" data-index="${i}" aria-label="${h.label}を再利用">
      <span>${h.label}</span>
      <span class="hist-time">${h.time}</span>
    </button>
  `).join('');
}

// ─── 豆知識 ──────────────────────────────────────────────
function buildTriviaPool() {
  triviaPool = [
    ...triviaData.base,
    ...triviaData.origin,
    ...triviaData.temp
  ].sort(() => Math.random() - 0.5);
  triviaIndex = 0;
}

function showTrivia() {
  if (triviaPool.length === 0) buildTriviaPool();
  const text = triviaPool[triviaIndex % triviaPool.length];
  triviaIndex++;
  triviaTextEl.style.opacity = '0';
  triviaTextEl.style.transform = 'translateY(4px)';
  setTimeout(() => {
    triviaTextEl.textContent = `💡 ${text}`;
    triviaTextEl.style.opacity = '1';
    triviaTextEl.style.transform = 'translateY(0)';
  }, 180);
}

// ─── コピー ──────────────────────────────────────────────
function copyResult() {
  if (lastCelsius === null) return;
  const c = lastCelsius;
  const f = cToF(c);
  const text = `${formatNum(c, decimalPlaces)}℃ = ${formatNum(f, decimalPlaces)}℉`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast(`コピーしました: ${text}`));
  } else {
    // フォールバック
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(`コピーしました: ${text}`);
  }
}

// ─── トースト ────────────────────────────────────────────
function showToast(msg) {
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
}

// ─── 自然文入力パース ────────────────────────────────────
function parseNaturalInput(raw) {
  const trimmed = raw.trim();
  // 例: "25C", "25℃", "-10c", "77F", "77℉", "-40°F"
  const matchC = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*[°]?[cC℃]$/);
  const matchF = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*[°]?[fF℉]$/);
  if (matchC) return { val: parseFloat(matchC[1]), unit: 'C' };
  if (matchF) return { val: parseFloat(matchF[1]), unit: 'F' };
  return null;
}

// ─── イベントバインド ────────────────────────────────────
function bindEvents() {
  // 摂氏入力
  celsiusInput.addEventListener('input', e => {
    const parsed = parseNaturalInput(e.target.value);
    if (parsed) {
      if (parsed.unit === 'C') {
        celsiusInput.value = parsed.val;
        updateFromCelsius(parsed.val);
      } else {
        fahrenheitInput.value = parsed.val;
        celsiusInput.value = '';
        updateFromFahrenheit(parsed.val);
      }
    } else {
      updateFromCelsius(e.target.value);
    }
  });

  // 華氏入力
  fahrenheitInput.addEventListener('input', e => {
    const parsed = parseNaturalInput(e.target.value);
    if (parsed) {
      if (parsed.unit === 'F') {
        fahrenheitInput.value = parsed.val;
        updateFromFahrenheit(parsed.val);
      } else {
        celsiusInput.value = parsed.val;
        fahrenheitInput.value = '';
        updateFromCelsius(parsed.val);
      }
    } else {
      updateFromFahrenheit(e.target.value);
    }
  });

  // ±ボタン（摂氏）
  document.getElementById('celsius-sign').addEventListener('click', () => {
    const val = parseFloat(celsiusInput.value);
    if (isNaN(val)) return;
    celsiusInput.value = -val;
    updateFromCelsius(-val);
  });

  // ±ボタン（華氏）
  document.getElementById('fahrenheit-sign').addEventListener('click', () => {
    const val = parseFloat(fahrenheitInput.value);
    if (isNaN(val)) return;
    fahrenheitInput.value = -val;
    updateFromFahrenheit(-val);
  });

  // スワップボタン
  document.getElementById('swap-btn').addEventListener('click', () => {
    const c = celsiusInput.value;
    const f = fahrenheitInput.value;
    // 数値をそのまま入れ替え（例: 25℃→25℉として再変換）
    celsiusInput.value = f;
    fahrenheitInput.value = c;
    if (celsiusInput.value !== '') updateFromCelsius(parseFloat(celsiusInput.value));
    else if (fahrenheitInput.value !== '') updateFromFahrenheit(parseFloat(fahrenheitInput.value));
    else clearUI();
  });

  // コピーボタン
  copyBtn.addEventListener('click', copyResult);

  // プリセット：摂氏
  document.querySelectorAll('.celsius-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseFloat(btn.dataset.celsius);
      celsiusInput.value = val;
      fahrenheitInput.value = '';
      updateFromCelsius(val);
      celsiusInput.focus();
    });
  });

  // プリセット：華氏
  document.querySelectorAll('.fahrenheit-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseFloat(btn.dataset.fahrenheit);
      fahrenheitInput.value = val;
      celsiusInput.value = '';
      updateFromFahrenheit(val);
      fahrenheitInput.focus();
    });
  });

  // 小数桁数ボタン
  document.querySelectorAll('.decimal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      decimalPlaces = parseInt(btn.dataset.decimal, 10);
      document.querySelectorAll('.decimal-btn').forEach(b =>
        b.classList.toggle('active', b === btn)
      );
      saveSettings();
      // 現在の値を再計算
      if (celsiusInput.value !== '') {
        updateFromCelsius(celsiusInput.value);
      } else if (fahrenheitInput.value !== '') {
        updateFromFahrenheit(fahrenheitInput.value);
      }
    });
  });

  // 履歴クリック
  historyList.addEventListener('click', e => {
    const item = e.target.closest('.history-item');
    if (!item) return;
    const idx = parseInt(item.dataset.index, 10);
    const h = history[idx];
    if (!h) return;
    celsiusInput.value = formatNum(h.c, decimalPlaces);
    fahrenheitInput.value = formatNum(h.f, decimalPlaces);
    updateFromCelsius(h.c);
    celsiusInput.focus();
    showToast('履歴から読み込みました');
  });

  // 履歴クリア
  document.getElementById('clear-history').addEventListener('click', () => {
    if (history.length === 0) return;
    history = [];
    saveHistory();
    renderHistory();
    showToast('履歴をクリアしました');
  });

  // 豆知識更新
  document.getElementById('refresh-trivia').addEventListener('click', showTrivia);
}

// ─── Service Worker 登録 ─────────────────────────────────
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .catch(err => console.warn('SW registration failed:', err));
    });
  }
}

// ─── 起動 ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
