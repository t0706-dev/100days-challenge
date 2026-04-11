'use strict';

// ══════════════════════════════════════════════════════════
//  定数・データ
// ══════════════════════════════════════════════════════════

const DISTANCE_UNITS = {
  mm:   { label: 'mm', name: 'ミリメートル',  factor: 0.001    },
  cm:   { label: 'cm', name: 'センチメートル', factor: 0.01     },
  m:    { label: 'm',  name: 'メートル',       factor: 1        },
  km:   { label: 'km', name: 'キロメートル',   factor: 1000     },
  inch: { label: 'in', name: 'インチ',          factor: 0.0254   },
  ft:   { label: 'ft', name: 'フィート',        factor: 0.3048   },
  yd:   { label: 'yd', name: 'ヤード',          factor: 0.9144   },
  mile: { label: 'mi', name: 'マイル',          factor: 1609.344 }
};

const WEIGHT_UNITS = {
  mg: { label: 'mg', name: 'ミリグラム', factor: 0.001   },
  g:  { label: 'g',  name: 'グラム',     factor: 1       },
  kg: { label: 'kg', name: 'キログラム', factor: 1000    },
  t:  { label: 't',  name: 'トン',       factor: 1000000 },
  oz: { label: 'oz', name: 'オンス',     factor: 28.3495 },
  lb: { label: 'lb', name: 'ポンド',     factor: 453.592 }
};

// 単位エイリアス（自然文解析用）
const UNIT_ALIASES = {
  mm: 'mm', cm: 'cm', m: 'm', km: 'km',
  'in': 'inch', inch: 'inch', inches: 'inch',
  ft: 'ft', foot: 'ft', feet: 'ft',
  yd: 'yd', yard: 'yd', yards: 'yd',
  mi: 'mile', mile: 'mile', miles: 'mile',
  mg: 'mg', g: 'g', kg: 'kg',
  t: 't', ton: 't', tons: 't',
  oz: 'oz', lb: 'lb', lbs: 'lb', pound: 'lb', pounds: 'lb'
};

const TRIVIA_DATA = {
  base: [
    "メートルは長さの基本単位です",
    "キログラムは質量の基本単位です",
    "1kgは水約1Lとほぼ同じ重さです",
    "1000gで1kgになります",
    "1000kgで1トンになります",
    "SI単位は世界共通の単位体系です",
    "単位記号は大小文字で意味が変わります",
    "kgは接頭語を含む特別な基本単位です",
    "メートルは光速基準で定義されています",
    "キログラムは2019年から物理定数で定義されています"
  ],
  origin: [
    "inchはラテン語「uncia（12分の1）」が語源です",
    "ounce（オンス）もuncia由来です",
    "foot（フィート）は足の長さが元です",
    "mile（マイル）はラテン語「千歩」が語源です",
    "poundのlbはローマの「libra（天秤）」由来です",
    "1yardは3フィートです",
    "1mileは1760yardsです",
    "1mileは約1.609kmです",
    "1lbは約453.6gです",
    "1ozは約28.3gです",
    "1フィートは12インチです",
    "1ヤードは36インチです",
    "1オンスは1/16ポンドです",
    "昔は国や地域ごとに単位が違いました",
    "メートル法はフランス革命後に生まれました"
  ],
  distance: [
    "フルマラソンは42.195kmです",
    "1kmは徒歩で約12〜13分です",
    "100mは短距離競技の標準距離です",
    "東京タワーは約333mです",
    "富士山は約3776mです",
    "東京〜大阪は約556kmです",
    "地球の周長は約4万kmです",
    "月までの距離は平均約38.4万kmです",
    "1光年は約9.46兆kmです",
    "1インチ＝2.54cmは厳密に定義されています"
  ],
  weight: [
    "人の頭は約5kgです",
    "成人男性は約60〜70kgです",
    "ノートPCは約1〜2kgです",
    "自転車は約10kgです",
    "スーツケースは10kg以上になることが多いです",
    "1円玉はちょうど1gです",
    "卵は約60gです",
    "水1Lは約1kgです",
    "象の体重は平均約4000kgです",
    "シロナガスクジラは最大で150トンを超えます"
  ]
};

const ANIMAL_DATA = [
  { name: "アリ",             kg: 0.000001, emoji: "🐜" },
  { name: "カブトムシ",       kg: 0.00005,  emoji: "🪲" },
  { name: "ハムスター",       kg: 0.03,     emoji: "🐹" },
  { name: "リス",             kg: 0.3,      emoji: "🐿️" },
  { name: "ウサギ",           kg: 2.0,      emoji: "🐰" },
  { name: "ミーアキャット",   kg: 0.8,      emoji: "🦫" },
  { name: "猫",               kg: 4.0,      emoji: "🐱" },
  { name: "柴犬",             kg: 10,       emoji: "🐕" },
  { name: "レッサーパンダ",   kg: 6,        emoji: "🦝" },
  { name: "チーター",         kg: 50,       emoji: "🐆" },
  { name: "オランウータン",   kg: 80,       emoji: "🦧" },
  { name: "ジャイアントパンダ", kg: 100,    emoji: "🐼" },
  { name: "ライオン",         kg: 200,      emoji: "🦁" },
  { name: "馬",               kg: 500,      emoji: "🐴" },
  { name: "シロクマ",         kg: 450,      emoji: "🐻‍❄️" },
  { name: "カバ",             kg: 1500,     emoji: "🦛" },
  { name: "ゾウ",             kg: 4000,     emoji: "🐘" },
  { name: "シロナガスクジラ", kg: 150000,   emoji: "🐋" }
];

const DISTANCE_LANDMARKS = [
  { name: "1円玉の直径",      m: 0.02,       emoji: "🪙" },
  { name: "スマホの幅",       m: 0.075,      emoji: "📱" },
  { name: "鉛筆の長さ",       m: 0.19,       emoji: "✏️" },
  { name: "バット",           m: 1.07,       emoji: "🏏" },
  { name: "人の身長",         m: 1.7,        emoji: "🧍" },
  { name: "乗用車の全長",     m: 4.5,        emoji: "🚗" },
  { name: "バスの全長",       m: 12,         emoji: "🚌" },
  { name: "100m走コース",     m: 100,        emoji: "🏃" },
  { name: "東京タワー",       m: 333,        emoji: "🗼" },
  { name: "スカイツリー",     m: 634,        emoji: "🏙️" },
  { name: "富士山",           m: 3776,       emoji: "🗻" },
  { name: "エベレスト",       m: 8849,       emoji: "⛰️" },
  { name: "東京〜横浜",       m: 30000,      emoji: "🚅" },
  { name: "東京〜大阪",       m: 556000,     emoji: "✈️" },
  { name: "地球一周",         m: 40075000,   emoji: "🌍" },
  { name: "月までの距離",     m: 384400000,  emoji: "🌙" }
];

// ══════════════════════════════════════════════════════════
//  アプリ状態
// ══════════════════════════════════════════════════════════

const state = {
  mode: 'distance',
  value: 1,
  unit: 'm',
  decimals: 3,
  history: [],
  favorites: { distance: [], weight: [] },
  compareOpen: false,
  cmpUnit1: 'km',
  cmpUnit2: 'm',
  triviaIndex: -1
};

// ══════════════════════════════════════════════════════════
//  ストレージ
// ══════════════════════════════════════════════════════════

function loadStorage() {
  try {
    const d = localStorage.getItem('uc_decimals');
    if (d !== null) state.decimals = parseInt(d, 10);

    const h = localStorage.getItem('uc_history');
    if (h) state.history = JSON.parse(h);

    const f = localStorage.getItem('uc_favorites');
    if (f) state.favorites = JSON.parse(f);

    const m = localStorage.getItem('uc_mode');
    if (m) state.mode = m;

    const u = localStorage.getItem('uc_unit');
    if (u) state.unit = u;

    const v = localStorage.getItem('uc_value');
    if (v) state.value = parseFloat(v);
  } catch (_) {}
}

function saveStorage() {
  try {
    localStorage.setItem('uc_decimals', state.decimals);
    localStorage.setItem('uc_history', JSON.stringify(state.history));
    localStorage.setItem('uc_favorites', JSON.stringify(state.favorites));
    localStorage.setItem('uc_mode', state.mode);
    localStorage.setItem('uc_unit', state.unit);
    localStorage.setItem('uc_value', state.value);
  } catch (_) {}
}

// ══════════════════════════════════════════════════════════
//  単位変換コア
// ══════════════════════════════════════════════════════════

function getUnits() {
  return state.mode === 'distance' ? DISTANCE_UNITS : WEIGHT_UNITS;
}

// value(fromUnit) → 基底単位 → toUnit
function convert(value, fromKey, toKey) {
  const units = getUnits();
  const base = value * units[fromKey].factor;
  return base / units[toKey].factor;
}

function formatNum(num, decimals) {
  if (!isFinite(num) || isNaN(num)) return '—';
  if (num === 0) return '0';
  // 非常に大きい / 小さい値は指数表記
  if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-9 && num !== 0)) {
    return num.toExponential(3);
  }
  return parseFloat(num.toFixed(decimals)).toLocaleString('ja-JP', {
    maximumFractionDigits: decimals
  });
}

// ══════════════════════════════════════════════════════════
//  自然文解析
// ══════════════════════════════════════════════════════════

function parseNatural(text) {
  const t = text.trim();
  // 例: "1.5km", "500 g", "2.5lb"
  const m = t.match(/^([0-9]+\.?[0-9]*)\s*([a-zA-Z]+)$/);
  if (!m) return null;

  const numStr = m[1];
  const unitStr = m[2].toLowerCase();
  const unitKey = UNIT_ALIASES[unitStr];
  if (!unitKey) return null;

  const value = parseFloat(numStr);
  if (isNaN(value) || value < 0) return null;

  const mode = DISTANCE_UNITS[unitKey] ? 'distance' : WEIGHT_UNITS[unitKey] ? 'weight' : null;
  if (!mode) return null;

  return { value, unitKey, mode };
}

// ══════════════════════════════════════════════════════════
//  雑学
// ══════════════════════════════════════════════════════════

function pickTrivia(unit) {
  let pool = [...TRIVIA_DATA.base];
  // inch / ft / yd / mile / oz / lb → 由来優先
  if (['inch', 'ft', 'yd', 'mile', 'oz', 'lb'].includes(unit)) {
    pool = [...TRIVIA_DATA.origin, ...TRIVIA_DATA.origin, ...pool];
  }
  if (state.mode === 'distance') pool = [...pool, ...TRIVIA_DATA.distance];
  if (state.mode === 'weight')   pool = [...pool, ...TRIVIA_DATA.weight];

  let idx;
  do { idx = Math.floor(Math.random() * pool.length); }
  while (idx === state.triviaIndex && pool.length > 1);
  state.triviaIndex = idx;
  return pool[idx];
}

// ══════════════════════════════════════════════════════════
//  生活イメージ
// ══════════════════════════════════════════════════════════

function getDistanceLifeItems(meters) {
  const items = [];
  if (meters <= 0) return items;

  // 徒歩
  const walkMin = meters / 80;
  if (walkMin < 60 * 24 * 7) {
    if (walkMin < 60) {
      items.push({ emoji: '🚶', text: `徒歩で<strong>約${Math.round(walkMin) || 1}分</strong>` });
    } else if (walkMin < 60 * 24) {
      items.push({ emoji: '🚶', text: `徒歩で<strong>約${(walkMin / 60).toFixed(1)}時間</strong>` });
    } else {
      items.push({ emoji: '🚶', text: `徒歩で<strong>約${(walkMin / 60 / 24).toFixed(1)}日</strong>` });
    }
  }

  // ジョギング
  const jogMin = meters / 150;
  if (jogMin < 60 * 24 && meters > 50) {
    if (jogMin < 60) {
      items.push({ emoji: '🏃', text: `ジョギングで<strong>約${Math.round(jogMin) || 1}分</strong>` });
    } else {
      items.push({ emoji: '🏃', text: `ジョギングで<strong>約${(jogMin / 60).toFixed(1)}時間</strong>` });
    }
  }

  // 400mトラック
  if (meters >= 100 && meters < 1e6) {
    const laps = meters / 400;
    if (laps >= 0.05) {
      items.push({ emoji: '🏟️', text: `400mトラック<strong>${laps < 1 ? laps.toFixed(2) : laps.toFixed(1)}周</strong>` });
    }
  }

  // 一番近いランドマーク
  const sorted = [...DISTANCE_LANDMARKS].sort((a, b) =>
    Math.abs(Math.log(a.m / meters)) - Math.abs(Math.log(b.m / meters))
  );
  const lm = sorted[0];
  const ratio = meters / lm.m;
  let ratioText;
  if (ratio >= 2) ratioText = `<strong>約${ratio.toFixed(1)}倍</strong>`;
  else if (ratio <= 0.5) ratioText = `<strong>約${(ratio * 100).toFixed(0)}%</strong>`;
  else ratioText = `<strong>ほぼ同じ</strong>`;
  items.push({ emoji: lm.emoji, text: `${lm.name}の${ratioText}` });

  return items;
}

function getWeightLifeItems(grams) {
  if (grams <= 0) return [];
  const items = [];
  const kg = grams / 1000;

  // 動物比較
  const sorted = [...ANIMAL_DATA].sort((a, b) =>
    Math.abs(Math.log((a.kg || 1e-9) / (kg || 1e-9))) -
    Math.abs(Math.log((b.kg || 1e-9) / (kg || 1e-9)))
  );
  const animal = sorted[0];
  const ratio = kg / animal.kg;
  let ratioText;
  if (ratio > 1.3)      ratioText = `<strong>約${ratio.toFixed(1)}倍</strong>`;
  else if (ratio < 0.7) ratioText = `<strong>約${(ratio * 100).toFixed(0)}%</strong>`;
  else                  ratioText = `<strong>ほぼ同じくらい</strong>`;
  items.push({ emoji: animal.emoji, text: `${animal.name}（${animal.kg < 1 ? animal.kg * 1000 + 'g' : animal.kg + 'kg'}）の${ratioText}` });

  // 身近な例
  if (grams < 2) items.push({ emoji: '🪙', text: `1円玉が<strong>${(grams / 1).toFixed(1)}枚分</strong>` });
  else if (grams < 100) items.push({ emoji: '🥚', text: `卵（約60g）の<strong>約${(grams / 60).toFixed(1)}個分</strong>` });
  else if (grams < 3000) items.push({ emoji: '🥤', text: `500mlペットボトル<strong>${(grams / 500).toFixed(1)}本分</strong>` });
  else items.push({ emoji: '💧', text: `水<strong>約${(grams / 1000).toFixed(2)}L</strong>分の重さ` });

  return items;
}

// ══════════════════════════════════════════════════════════
//  履歴
// ══════════════════════════════════════════════════════════

function addHistory() {
  const entry = {
    mode: state.mode,
    value: state.value,
    unit: state.unit,
    time: Date.now()
  };
  // 重複チェック
  const dup = state.history[0];
  if (dup && dup.mode === entry.mode && dup.value === entry.value && dup.unit === entry.unit) return;

  state.history.unshift(entry);
  if (state.history.length > 20) state.history.pop();
  saveStorage();
}

// ══════════════════════════════════════════════════════════
//  DOM参照
// ══════════════════════════════════════════════════════════

const $ = id => document.getElementById(id);
const el = {
  body:          document.body,
  tabs:          document.querySelectorAll('.tab-btn'),
  naturalInput:  $('natural-input'),
  naturalBtn:    $('natural-btn'),
  parseMsg:      $('parse-msg'),
  valueInput:    $('value-input'),
  unitSelect:    $('unit-select'),
  decimalLabel:  $('decimal-label'),
  dBtns:         document.querySelectorAll('.d-btn'),
  resultsGrid:   $('results-grid'),
  compareToggle: $('compare-toggle'),
  compareSection:$('compare-section'),
  cmpUnit1:      $('cmp-unit1'),
  cmpUnit2:      $('cmp-unit2'),
  cmpResult:     $('cmp-result'),
  lifeContent:   $('life-content'),
  triviaText:    $('trivia-text'),
  triviaRefresh: $('trivia-refresh'),
  historyToggle: $('history-toggle'),
  historyBody:   $('history-body'),
  historyList:   $('history-list'),
  historyClear:  $('history-clear'),
  toast:         $('toast')
};

// ══════════════════════════════════════════════════════════
//  レンダリング
// ══════════════════════════════════════════════════════════

function renderUnitSelect() {
  const units = getUnits();
  const options = Object.keys(units).map(key =>
    `<option value="${key}" ${key === state.unit ? 'selected' : ''}>${units[key].label} — ${units[key].name}</option>`
  ).join('');
  el.unitSelect.innerHTML = options;
}

function renderCompareSelects() {
  const units = getUnits();
  const makeOptions = (current) => Object.keys(units).map(key =>
    `<option value="${key}" ${key === current ? 'selected' : ''}>${units[key].label}</option>`
  ).join('');
  el.cmpUnit1.innerHTML = makeOptions(state.cmpUnit1);
  el.cmpUnit2.innerHTML = makeOptions(state.cmpUnit2);
}

function renderDecimalBtns() {
  el.dBtns.forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.d) === state.decimals);
  });
  el.decimalLabel.textContent = state.decimals;
}

function animateValue(elem, newText) {
  const old = elem.textContent;
  if (old === newText) return;
  elem.textContent = newText;
  elem.classList.remove('animating');
  void elem.offsetWidth; // reflow
  elem.classList.add('animating');
  setTimeout(() => elem.classList.remove('animating'), 300);
}

function renderResults() {
  const units = getUnits();
  const keys = Object.keys(units);
  const favs = state.favorites[state.mode] || [];

  // お気に入りを先頭に
  const sorted = [
    ...keys.filter(k => favs.includes(k)),
    ...keys.filter(k => !favs.includes(k))
  ];

  // 既存カードを再利用 or 生成
  sorted.forEach(key => {
    let card = el.resultsGrid.querySelector(`[data-unit="${key}"]`);
    const isSource = key === state.unit;
    const isFav = favs.includes(key);
    let displayVal;
    if (state.value === '' || state.value === null || isNaN(state.value) || state.value < 0) {
      displayVal = '—';
    } else {
      displayVal = formatNum(convert(state.value, state.unit, key), state.decimals);
    }

    if (!card) {
      card = document.createElement('div');
      card.className = 'result-card';
      card.dataset.unit = key;
      card.innerHTML = `
        <div class="card-top">
          <span class="unit-label">${units[key].label}</span>
          <div class="card-actions">
            <button class="star-btn" title="お気に入り">☆</button>
            <button class="copy-btn" title="コピー">📋</button>
          </div>
        </div>
        <div class="result-value"></div>
        <div class="unit-name">${units[key].name}</div>
      `;

      const starBtn = card.querySelector('.star-btn');
      starBtn.addEventListener('click', e => {
        e.stopPropagation();
        toggleFavorite(key);
      });

      const copyBtn = card.querySelector('.copy-btn');
      copyBtn.addEventListener('click', e => {
        e.stopPropagation();
        const v = formatNum(convert(state.value, state.unit, key), state.decimals);
        const txt = `${formatNum(state.value, state.decimals)} ${units[state.unit].label} = ${v} ${units[key].label}`;
        copyText(txt);
      });

      el.resultsGrid.appendChild(card);
    }

    // 状態更新
    card.classList.toggle('source', isSource);
    card.classList.toggle('favorite', isFav);
    const starBtn = card.querySelector('.star-btn');
    starBtn.textContent = isFav ? '★' : '☆';
    starBtn.classList.toggle('active', isFav);

    const valElem = card.querySelector('.result-value');
    animateValue(valElem, displayVal);
  });

  // 順序を DOM に反映
  sorted.forEach((key, i) => {
    const card = el.resultsGrid.querySelector(`[data-unit="${key}"]`);
    if (card && card.style.order !== String(i)) card.style.order = i;
  });
}

function renderCompare() {
  const units = getUnits();
  const v1 = state.value > 0 ? convert(state.value, state.unit, state.cmpUnit1) : 0;
  const v2 = state.value > 0 ? convert(state.value, state.unit, state.cmpUnit2) : 0;
  const ratio = v2 > 0 ? Math.min(v1 / v2, 1) * 100 : 0;

  el.cmpResult.innerHTML = `
    <div class="cmp-equation">
      <span>${formatNum(v1, state.decimals)} ${units[state.cmpUnit1].label}</span>
      <span style="color:var(--text-sub);margin:0 8px">=</span>
      <span>${formatNum(v2, state.decimals)} ${units[state.cmpUnit2].label}</span>
    </div>
    <div class="cmp-bar-wrap">
      <div class="cmp-bar" style="width:${ratio}%"></div>
    </div>
    <div class="cmp-note">
      1 ${units[state.cmpUnit1].label} ＝ ${formatNum(units[state.cmpUnit1].factor / units[state.cmpUnit2].factor, 6)} ${units[state.cmpUnit2].label}
    </div>
  `;
}

function renderLifeImage() {
  const units = getUnits();
  const baseValue = state.value * units[state.unit].factor; // 基底単位（m or g）
  const items = state.mode === 'distance'
    ? getDistanceLifeItems(baseValue)
    : getWeightLifeItems(baseValue);

  if (!items.length || state.value <= 0 || isNaN(state.value)) {
    el.lifeContent.innerHTML = '<p style="color:var(--text-sub);font-size:0.88rem;text-align:center;padding:8px 0">値を入力すると生活イメージが表示されます</p>';
    return;
  }

  el.lifeContent.innerHTML = items.map(item => `
    <div class="life-item">
      <span class="life-emoji">${item.emoji}</span>
      <span class="life-text">${item.text}</span>
    </div>
  `).join('');
}

function renderTrivia() {
  el.triviaText.textContent = pickTrivia(state.unit);
}

function renderHistory() {
  if (!state.history.length) {
    el.historyList.innerHTML = '<p class="history-empty">まだ変換履歴がありません</p>';
    return;
  }
  const units = { ...DISTANCE_UNITS, ...WEIGHT_UNITS };
  el.historyList.innerHTML = state.history.map((entry, i) => {
    const u = units[entry.unit];
    return `
      <div class="history-item" data-idx="${i}">
        <span class="history-item-label">${formatNum(entry.value, 3)} ${u ? u.label : entry.unit}</span>
        <span class="history-item-mode">${entry.mode === 'distance' ? '📐 距離' : '⚖️ 重さ'}</span>
      </div>
    `;
  }).join('');

  el.historyList.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.idx);
      const entry = state.history[idx];
      if (!entry) return;
      state.mode = entry.mode;
      state.value = entry.value;
      state.unit = entry.unit;
      updateModeUI();
      el.valueInput.value = state.value;
      renderUnitSelect();
      renderCompareSelects();
      fullRender(false);
    });
  });
}

function fullRender(doHistory = true) {
  renderResults();
  if (state.compareOpen) renderCompare();
  renderLifeImage();
  if (doHistory) {
    addHistory();
    renderHistory();
  } else {
    renderHistory();
  }
  saveStorage();
}

// ══════════════════════════════════════════════════════════
//  UI ヘルパー
// ══════════════════════════════════════════════════════════

function updateModeUI() {
  el.body.className = `mode-${state.mode}`;
  el.tabs.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === state.mode);
  });
  // 単位が現モードに存在しない場合デフォルトへ
  const units = getUnits();
  if (!units[state.unit]) {
    state.unit = Object.keys(units)[0];
  }
  // cmpUnit も検証
  if (!units[state.cmpUnit1]) state.cmpUnit1 = Object.keys(units)[0];
  if (!units[state.cmpUnit2]) state.cmpUnit2 = Object.keys(units)[1] || Object.keys(units)[0];
}

function toggleFavorite(key) {
  const favs = state.favorites[state.mode];
  const idx = favs.indexOf(key);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(key);
  saveStorage();
  renderResults();
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => showToast())
    .catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast();
    });
}

let toastTimer = null;
function showToast() {
  el.toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove('show'), 2000);
}

// ══════════════════════════════════════════════════════════
//  イベントリスナー
// ══════════════════════════════════════════════════════════

function setupEvents() {
  // タブ
  el.tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.mode === state.mode) return;
      state.mode = btn.dataset.mode;
      state.unit = state.mode === 'distance' ? 'm' : 'g';
      state.value = 1;
      el.valueInput.value = '1';
      el.naturalInput.value = '';
      el.parseMsg.textContent = '';
      el.resultsGrid.innerHTML = '';
      state.cmpUnit1 = state.mode === 'distance' ? 'km' : 'kg';
      state.cmpUnit2 = state.mode === 'distance' ? 'm' : 'g';
      updateModeUI();
      renderUnitSelect();
      renderCompareSelects();
      renderDecimalBtns();
      renderTrivia();
      fullRender();
    });
  });

  // 自然文
  el.naturalBtn.addEventListener('click', doNaturalParse);
  el.naturalInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') doNaturalParse();
  });

  // 数値入力
  el.valueInput.addEventListener('input', () => {
    const v = parseFloat(el.valueInput.value);
    if (isNaN(v) || v < 0) {
      state.value = 0;
    } else {
      state.value = v;
    }
    fullRender();
  });

  // 単位選択
  el.unitSelect.addEventListener('change', () => {
    state.unit = el.unitSelect.value;
    renderTrivia();
    fullRender();
  });

  // 小数桁
  el.dBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      state.decimals = parseInt(btn.dataset.d);
      renderDecimalBtns();
      renderResults();
      if (state.compareOpen) renderCompare();
      saveStorage();
    });
  });

  // 比較モード
  el.compareToggle.addEventListener('click', () => {
    state.compareOpen = !state.compareOpen;
    el.compareSection.classList.toggle('hidden', !state.compareOpen);
    el.compareToggle.classList.toggle('active', state.compareOpen);
    if (state.compareOpen) renderCompare();
  });

  el.cmpUnit1.addEventListener('change', () => {
    state.cmpUnit1 = el.cmpUnit1.value;
    renderCompare();
  });
  el.cmpUnit2.addEventListener('change', () => {
    state.cmpUnit2 = el.cmpUnit2.value;
    renderCompare();
  });

  // 雑学リフレッシュ
  el.triviaRefresh.addEventListener('click', renderTrivia);

  // 履歴トグル
  el.historyToggle.addEventListener('click', () => {
    const open = !el.historyBody.classList.contains('hidden');
    el.historyBody.classList.toggle('hidden', open);
    el.historyToggle.classList.toggle('open', !open);
  });

  // 履歴クリア
  el.historyClear.addEventListener('click', () => {
    if (!confirm('履歴をすべて削除しますか？')) return;
    state.history = [];
    saveStorage();
    renderHistory();
  });
}

function doNaturalParse() {
  const text = el.naturalInput.value.trim();
  if (!text) return;
  const result = parseNatural(text);
  if (!result) {
    el.parseMsg.textContent = '⚠️ 認識できません。例: 1.5km / 500g / 2.5lb';
    el.parseMsg.className = 'parse-msg error';
    return;
  }

  if (result.mode !== state.mode) {
    state.mode = result.mode;
    state.unit = result.unitKey;
    el.resultsGrid.innerHTML = '';
    state.cmpUnit1 = state.mode === 'distance' ? 'km' : 'kg';
    state.cmpUnit2 = state.mode === 'distance' ? 'm' : 'g';
    updateModeUI();
    renderCompareSelects();
  }

  state.value = result.value;
  state.unit = result.unitKey;
  el.valueInput.value = state.value;
  renderUnitSelect();
  renderTrivia();

  const u = getUnits()[result.unitKey];
  el.parseMsg.textContent = `✅ ${result.value} ${u.label}（${u.name}）として変換`;
  el.parseMsg.className = 'parse-msg ok';

  fullRender();
}

// ══════════════════════════════════════════════════════════
//  PWA
// ══════════════════════════════════════════════════════════

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }
}

// ══════════════════════════════════════════════════════════
//  初期化
// ══════════════════════════════════════════════════════════

function init() {
  loadStorage();
  updateModeUI();
  el.valueInput.value = state.value;
  renderUnitSelect();
  renderCompareSelects();
  renderDecimalBtns();
  renderTrivia();
  setupEvents();
  fullRender(false);
  registerSW();
}

document.addEventListener('DOMContentLoaded', init);
