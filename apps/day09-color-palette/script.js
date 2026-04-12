// ============================================================
// 色変換ユーティリティ
// ============================================================

/**
 * HEX カラーを HSL オブジェクトに変換する
 * @param {string} hex - "#rrggbb" 形式の文字列
 * @returns {{ h: number, s: number, l: number }} 各値の範囲: h=0-360, s=0-100, l=0-100
 */
function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * HSL 値を "#rrggbb" 形式の HEX カラーに変換する
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} "#rrggbb" 形式の文字列
 */
function hslToHex(h, s, l) {
  // 値を正規範囲にクランプ
  const sNorm = Math.max(0, Math.min(100, s)) / 100;
  const lNorm = Math.max(0, Math.min(100, l)) / 100;
  const hNorm = ((h % 360) + 360) % 360; // 負の値も正規化

  const a = sNorm * Math.min(lNorm, 1 - lNorm);

  // チャンネル（R, G, B）を順に計算
  const toChannel = (n) => {
    const k = (n + hNorm / 30) % 12;
    const value = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * value).toString(16).padStart(2, '0');
  };

  return `#${toChannel(0)}${toChannel(8)}${toChannel(4)}`;
}

/**
 * 色の知覚輝度を計算し、明るい色かどうか判定する（テキスト色の選択に使用）
 * @param {string} hex - "#rrggbb" 形式
 * @returns {boolean} 明るい色なら true
 */
function isLight(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // WCAG 相対輝度の簡略版（Rec.709 係数）
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55;
}


// ============================================================
// ペルソナ設定
// ============================================================

/**
 * 各ペルソナの 3 パターン設定
 *
 * プロパティ説明:
 *   name        - パターン名
 *   satMult     - Primary の彩度倍率（ベース彩度 × satMult）
 *   primL       - Primary の明度（0-100）
 *   accentShift - Accent の色相シフト量（度）
 *   accentSat   - Accent の彩度（固定値）
 *   accentL     - Accent の明度（固定値）
 *   bgL         - Background の明度
 *   surfL       - Surface の明度（bg より暗め）
 *   bgSatMult   - Background / Surface の彩度倍率（控えめな数値）
 *
 * 調整したい場合はこのオブジェクトの数値を変更するだけでOK。
 */
const PERSONA_CONFIGS = {
  business: {
    label: 'ビジネス',
    patterns: [
      {
        name: 'スタンダード',
        satMult: 0.70, primL: 42,
        accentShift: 22, accentSat: 65, accentL: 48,
        bgL: 97, surfL: 93, bgSatMult: 0.18,
      },
      {
        name: 'コントラスト',
        satMult: 0.82, primL: 35,
        accentShift: 28, accentSat: 72, accentL: 42,
        bgL: 98, surfL: 94, bgSatMult: 0.12,
      },
      {
        name: 'ソフト',
        satMult: 0.55, primL: 52,
        accentShift: 15, accentSat: 55, accentL: 56,
        bgL: 96, surfL: 91, bgSatMult: 0.26,
      },
    ],
  },

  kids: {
    label: '子ども向け',
    patterns: [
      {
        name: 'ポップ',
        satMult: 0.95, primL: 55,
        accentShift: 60, accentSat: 88, accentL: 55,
        bgL: 98, surfL: 95, bgSatMult: 0.30,
      },
      {
        name: 'ブライト',
        satMult: 1.00, primL: 50,
        accentShift: 90, accentSat: 90, accentL: 50,
        bgL: 97, surfL: 93, bgSatMult: 0.35,
      },
      {
        name: 'パステル',
        satMult: 0.75, primL: 68,
        accentShift: 45, accentSat: 75, accentL: 63,
        bgL: 98, surfL: 95, bgSatMult: 0.42,
      },
    ],
  },

  luxury: {
    label: '高級感',
    patterns: [
      {
        name: 'エレガント',
        satMult: 0.35, primL: 32,
        accentShift: 35, accentSat: 48, accentL: 45,
        bgL: 97, surfL: 93, bgSatMult: 0.10,
      },
      {
        name: 'ディープ',
        satMult: 0.28, primL: 26,
        accentShift: 42, accentSat: 52, accentL: 50,
        bgL: 96, surfL: 91, bgSatMult: 0.08,
      },
      {
        name: 'シルキー',
        satMult: 0.22, primL: 40,
        accentShift: 25, accentSat: 38, accentL: 55,
        bgL: 98, surfL: 94, bgSatMult: 0.12,
      },
    ],
  },

  simple: {
    label: 'シンプル',
    patterns: [
      {
        name: 'ミニマル',
        satMult: 0.28, primL: 45,
        accentShift: 0, accentSat: 42, accentL: 50,
        bgL: 98, surfL: 95, bgSatMult: 0.10,
      },
      {
        name: 'クリーン',
        satMult: 0.22, primL: 40,
        accentShift: 12, accentSat: 36, accentL: 48,
        bgL: 99, surfL: 96, bgSatMult: 0.07,
      },
      {
        name: 'ニュートラル',
        satMult: 0.17, primL: 50,
        accentShift: 5, accentSat: 28, accentL: 55,
        bgL: 97, surfL: 93, bgSatMult: 0.05,
      },
    ],
  },
};


// ============================================================
// 配色生成ロジック
// ============================================================

/**
 * ベースカラーとパターン設定から 1 つのカラーパレットを生成する
 * @param {string} baseHex - ベースカラー（HEX）
 * @param {Object} config  - PERSONA_CONFIGS 内の patterns[n] オブジェクト
 * @returns {{ name, bg, surface, primary, accent, text }} すべて HEX 文字列
 */
function generatePalette(baseHex, config) {
  const { h, s } = hexToHsl(baseHex);

  // ベース彩度を 10〜90 の範囲にクランプして極端な値を防ぐ
  const baseS = Math.max(10, Math.min(90, s));

  const bg      = hslToHex(h, Math.round(baseS * config.bgSatMult),  config.bgL);
  const surface = hslToHex(h, Math.round(baseS * config.bgSatMult),  config.surfL);
  const primary = hslToHex(h, Math.round(baseS * config.satMult),    config.primL);

  // Accent は色相をシフトして変化をつける
  const accentH = (h + config.accentShift + 360) % 360;
  const accent  = hslToHex(accentH, config.accentSat, config.accentL);

  // Text はごく薄い色相を乗せた暗いグレー（読みやすさ優先）
  const text    = hslToHex(h, 8, 14);

  return { name: config.name, bg, surface, primary, accent, text };
}

/**
 * 指定ペルソナの 3 パターン分パレットをまとめて生成する
 * @param {string} baseHex   - ベースカラー（HEX）
 * @param {string} personaKey - PERSONA_CONFIGS のキー
 * @returns {Array<Object>} パレットオブジェクトの配列（3 件）
 */
function generateAllPatterns(baseHex, personaKey) {
  const { patterns } = PERSONA_CONFIGS[personaKey];
  return patterns.map((config, i) => ({
    label: `パターン ${'ABC'[i]}：${config.name}`,
    ...generatePalette(baseHex, config),
  }));
}


// ============================================================
// CSS 出力テキスト生成
// ============================================================

/**
 * パレットから CSS カスタムプロパティ（:root 変数）コードを生成する
 * @param {Object} palette
 * @returns {string}
 */
function buildCssVariables(palette) {
  return (
    `:root {\n` +
    `  --bg:      ${palette.bg};\n` +
    `  --surface: ${palette.surface};\n` +
    `  --primary: ${palette.primary};\n` +
    `  --accent:  ${palette.accent};\n` +
    `  --text:    ${palette.text};\n` +
    `}`
  );
}

/**
 * WordPress の「追加CSS」に貼りやすいサンプルCSSを生成する。
 * :root 変数ブロック ＋ 汎用セレクタへの適用例をまとめて出力する。
 *
 * ※ テーマによってクラス名が異なるため、あくまで流用テンプレートとして使用すること。
 *
 * @param {Object} palette
 * @returns {string}
 */
function buildWordPressCss(palette) {
  // Primary・Accent の上に乗る文字色を輝度で自動判定
  const onPrimary = isLight(palette.primary) ? '#1a202c' : '#ffffff';
  const onAccent  = isLight(palette.accent)  ? '#1a202c' : '#ffffff';

  const lines = [
    // ① CSS 変数ブロック（:root）
    buildCssVariables(palette),
    '',
    '/* ----------------------------------------',
    '   ベース',
    '---------------------------------------- */',
    'body {',
    '  background-color: var(--bg);',
    '  color: var(--text);',
    '}',
    '',
    'a {',
    '  color: var(--primary);',
    '}',
    '',
    '/* ----------------------------------------',
    '   ボタン類',
    '---------------------------------------- */',
    'button,',
    'input[type="submit"],',
    '.wp-block-button__link {',
    `  background-color: var(--accent);`,
    `  color: ${onAccent};`,
    '  border: 1px solid var(--accent);',
    '}',
    '',
    '/* ----------------------------------------',
    '   サイトヘッダー',
    '---------------------------------------- */',
    '.site-header {',
    '  background-color: var(--primary);',
    `  color: ${onPrimary};`,
    '}',
    '',
    '.wp-block-navigation a {',
    `  color: ${onPrimary};`,
    '}',
    '',
    '/* ----------------------------------------',
    '   コンテンツ',
    '---------------------------------------- */',
    '.entry-content {',
    '  color: var(--text);',
    '}',
    '',
    '/* ----------------------------------------',
    '   ブロック',
    '---------------------------------------- */',
    '.wp-block-group {',
    '  background-color: var(--surface);',
    '}',
    '',
    '.wp-block-cover {',
    '  color: #ffffff;',
    '}',
  ];

  return lines.join('\n');
}


// ============================================================
// DOM レンダリング
// ============================================================

/** 表示する色の役割一覧 */
const COLOR_ROLES = [
  { key: 'bg',      label: 'Background' },
  { key: 'surface', label: 'Surface' },
  { key: 'primary', label: 'Primary' },
  { key: 'accent',  label: 'Accent' },
  { key: 'text',    label: 'Text' },
];

/**
 * カラースウォッチ部分の HTML を生成する
 * @param {Object} palette
 * @returns {string} HTML 文字列
 */
function renderSwatches(palette) {
  return COLOR_ROLES.map(({ key, label }) => `
    <div class="swatch">
      <div class="swatch-color"
           style="background: ${palette[key]};"
           title="${label}: ${palette[key]}">
      </div>
      <span class="swatch-role">${label}</span>
      <span class="swatch-hex">${palette[key]}</span>
    </div>
  `).join('');
}

/**
 * Web ページ風の簡易プレビュー HTML を生成する
 * Primary / Accent の上に乗るテキスト色は輝度で自動判定。
 * @param {Object} palette
 * @returns {string} HTML 文字列
 */
function renderPreview(palette) {
  const { bg, surface, primary, accent, text } = palette;

  // Primary・Accent の上に乗る文字色を自動選択
  const onPrimary = isLight(primary) ? '#1a202c' : '#ffffff';
  const onAccent  = isLight(accent)  ? '#1a202c' : '#ffffff';

  return `
    <div class="preview-frame" style="background:${bg}; color:${text};">
      <!-- ヘッダー -->
      <div class="preview-header" style="background:${primary}; color:${onPrimary};">
        <span class="preview-logo">Brand</span>
        <div class="preview-nav">
          <span>ホーム</span>
          <span>機能</span>
          <span>料金</span>
        </div>
      </div>
      <!-- ボディ -->
      <div class="preview-body">
        <!-- ヒーロー -->
        <div class="preview-hero">
          <div class="preview-heading" style="color:${text};">見出しテキスト</div>
          <div class="preview-lead" style="color:${text};">
            キャッチコピーや説明文がここに入ります。
          </div>
          <button class="preview-btn" style="background:${accent}; color:${onAccent};">
            ボタン
          </button>
        </div>
        <!-- カード群 -->
        <div class="preview-cards">
          <div class="preview-card" style="background:${surface}; color:${text};">
            <div class="preview-card-title">カード A</div>
            <div class="preview-card-text">説明テキストが入ります。</div>
          </div>
          <div class="preview-card" style="background:${surface}; color:${text};">
            <div class="preview-card-title">カード B</div>
            <div class="preview-card-text">説明テキストが入ります。</div>
          </div>
          <div class="preview-card" style="background:${surface}; color:${text};">
            <div class="preview-card-title">カード C</div>
            <div class="preview-card-text">説明テキストが入ります。</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * HTML 特殊文字をエスケープする（CSS コード表示用）
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * 1 パターン分のカード HTML を生成する
 * @param {Object} palette
 * @param {number} index - 0〜2（コピーボタンの data-index に使用）
 * @returns {string} HTML 文字列
 */
function renderPatternCard(palette, index) {
  const cssVars = buildCssVariables(palette);
  const wpCss   = buildWordPressCss(palette);

  return `
    <div class="pattern-card">
      <!-- カードヘッダー -->
      <div class="pattern-card-header">
        <div class="pattern-title">${palette.label}</div>
      </div>
      <!-- カードボディ -->
      <div class="pattern-card-body">
        <!-- 上段：スウォッチ + プレビュー -->
        <div class="card-top-row">
          <div class="swatches-section">
            <h4>カラー</h4>
            <div class="swatches">
              ${renderSwatches(palette)}
            </div>
          </div>
          <div class="preview-section">
            <h4>プレビュー</h4>
            ${renderPreview(palette)}
          </div>
        </div>
        <!-- 下段：CSS 変数 + WordPress 用 CSS -->
        <div class="card-code-row">
          <div class="css-section">
            <div class="code-block-header">
              <h4>CSS 変数</h4>
              <button class="code-copy-btn" data-index="${index}" data-type="vars">コピー</button>
            </div>
            <div class="css-code">${escapeHtml(cssVars)}</div>
          </div>
          <div class="wp-css-section">
            <div class="code-block-header">
              <h4>WordPress 用 CSS <span class="section-note">（追加CSSに貼って使用）</span></h4>
              <button class="code-copy-btn" data-index="${index}" data-type="wp">コピー</button>
            </div>
            <div class="css-code css-code--wp">${escapeHtml(wpCss)}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 生成したパレットをモジュールスコープで保持（コピー時に参照）
let currentPalettes = [];

/**
 * 出力エリア全体を再描画し、コピーボタンのイベントを設定する
 * @param {Array<Object>} palettes - generateAllPatterns() の戻り値
 */
function renderOutput(palettes) {
  currentPalettes = palettes;
  const section = document.getElementById('outputSection');
  section.innerHTML = palettes.map((p, i) => renderPatternCard(p, i)).join('');

  // コードブロック横のコピーボタン（.code-copy-btn）にイベントを設定
  section.querySelectorAll('.code-copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index   = parseInt(btn.dataset.index, 10);
      const type    = btn.dataset.type; // 'vars' | 'wp'
      const cssText = (type === 'wp')
        ? buildWordPressCss(currentPalettes[index])
        : buildCssVariables(currentPalettes[index]);

      navigator.clipboard.writeText(cssText).then(() => {
        btn.textContent = 'コピーしました！';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'コピー';
          btn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        alert('コピーできませんでした。ブラウザの設定をご確認ください。');
      });
    });
  });
}


// ============================================================
// カラーピッカー
// ============================================================

/**
 * プリセットカラー一覧（主要色相を12色でカバー）
 */
const PRESET_COLORS = [
  '#e53e3e', // 赤
  '#ed8936', // オレンジ
  '#ecc94b', // 黄
  '#48bb78', // 緑
  '#38b2ac', // ティール
  '#4299e1', // 青
  '#667eea', // インディゴ
  '#9f7aea', // 紫
  '#ed64a6', // ピンク
  '#a0aec0', // グレー
  '#2d3748', // ダークグレー
  '#744210', // ブラウン
];

/**
 * 全カラー入力ウィジェットを指定HEXで同期する
 * @param {string} hex         - "#rrggbb" 形式
 * @param {boolean} updateSlider - hueSlider も更新するか
 */
function syncColor(hex, updateSlider = true) {
  document.getElementById('baseColor').value = hex;
  document.getElementById('hexInput').value  = hex.slice(1).toLowerCase();

  if (updateSlider) {
    const { h } = hexToHsl(hex);
    document.getElementById('hueSlider').value = h;
  }

  // プリセットボタンの active 状態を更新
  document.querySelectorAll('.color-preset-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.color === hex.toLowerCase());
  });
}

/**
 * カラーピッカーの初期化
 * ネイティブピッカー / HEXテキスト / 色相スライダー / プリセット を相互同期する
 */
function initColorPicker() {
  const colorInput = document.getElementById('baseColor');
  const hexInput   = document.getElementById('hexInput');
  const hueSlider  = document.getElementById('hueSlider');
  const presetGrid = document.getElementById('colorPresetGrid');

  // プリセットカラーボタンを動的生成
  PRESET_COLORS.forEach((color) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'color-preset-btn';
    btn.style.background = color;
    btn.dataset.color = color;
    btn.title = color;
    btn.addEventListener('click', () => syncColor(color));
    presetGrid.appendChild(btn);
  });

  // ネイティブカラーピッカー変更時
  colorInput.addEventListener('input', () => {
    syncColor(colorInput.value);
  });

  // HEX テキスト入力（6文字揃ったら同期）
  hexInput.addEventListener('input', () => {
    const clean = hexInput.value.replace(/[^0-9a-fA-F]/g, '');
    if (clean.length === 6) {
      syncColor('#' + clean);
    }
  });

  // HEX 入力からフォーカスが外れたとき、不完全な値をリセット
  hexInput.addEventListener('blur', () => {
    hexInput.value = colorInput.value.slice(1).toLowerCase();
  });

  // 色相スライダー変更時（S/Lは現在の値を保持して H だけ変える）
  hueSlider.addEventListener('input', () => {
    const { s, l } = hexToHsl(colorInput.value);
    // 極端に彩度・明度が低い場合は見やすい値に補正
    const newS = s < 20 ? 60 : s;
    const newL = l < 20 ? 50 : l > 85 ? 55 : l;
    const newHex = hslToHex(parseInt(hueSlider.value), newS, newL);
    syncColor(newHex, false); // スライダー自体は更新しない（ループ防止）
  });

  // 初期状態を同期
  syncColor(colorInput.value);
}


// ============================================================
// UI 制御
// ============================================================

/** 現在選択中のペルソナキー */
let currentPersona = 'business';

/**
 * ペルソナを切り替え、ボタンの active 状態を更新する
 * @param {string} key - PERSONA_CONFIGS のキー
 */
function selectPersona(key) {
  currentPersona = key;
  document.querySelectorAll('.persona-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.persona === key);
  });
}

/**
 * 配色を生成して画面に反映するメイン処理
 */
function generate() {
  const baseHex = document.getElementById('baseColor').value;
  const palettes = generateAllPatterns(baseHex, currentPersona);
  renderOutput(palettes);
}

// ============================================================
// 使い方モーダル
// ============================================================

/**
 * モーダルを開く（.is-open クラスを付与して表示）
 */
function openModal() {
  document.getElementById('modalOverlay').classList.add('is-open');
  // フォーカスを閉じるボタンに当てる（アクセシビリティ）
  document.getElementById('modalClose').focus();
}

/**
 * モーダルを閉じる（.is-open クラスを除去して非表示）
 */
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('is-open');
  // フォーカスを使い方ボタンに戻す
  document.getElementById('helpBtn').focus();
}


// ============================================================
// アプリ初期化
// ============================================================

/**
 * アプリの初期化（DOMContentLoaded 後に呼ばれる）
 */
function init() {
  // ペルソナボタンのクリックイベント（イベント委譲）
  document.getElementById('personaGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('.persona-btn');
    if (btn) selectPersona(btn.dataset.persona);
  });

  // カラーピッカー（Hueスライダー / プリセット / HEX入力 / ネイティブ）を初期化
  initColorPicker();

  // 提案ボタン
  document.getElementById('generateBtn').addEventListener('click', generate);

  // 使い方モーダル：開く
  document.getElementById('helpBtn').addEventListener('click', openModal);

  // 使い方モーダル：✕ボタンで閉じる
  document.getElementById('modalClose').addEventListener('click', closeModal);

  // 使い方モーダル：オーバーレイ（背景）クリックで閉じる
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  // 使い方モーダル：Escキーで閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // URLパラメータから色を読み込む（day22連携など）
  const params = new URLSearchParams(location.search);
  const colorParam = params.get('color');
  if (colorParam) {
    const hex = colorParam.startsWith('#') ? colorParam : '#' + colorParam;
    syncColor(hex);
  }

  // 初期表示（ページロード時に即座に提案を出す）
  generate();
}

document.addEventListener('DOMContentLoaded', init);
