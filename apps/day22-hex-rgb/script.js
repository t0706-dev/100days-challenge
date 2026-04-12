/* ── State ── */
let currentR = 108, currentG = 99, currentB = 255, currentA = 1;
const PALETTE_URL = 'https://t0706-dev.github.io/100days-challenge/apps/day09-color-palette/';
const HISTORY_KEY = 'hexrgb_history';
const MAX_HISTORY = 20;

/* ── DOM ── */
const colorInput   = document.getElementById('colorInput');
const colorPicker  = document.getElementById('colorPicker');
const colorPreview = document.getElementById('colorPreview');
const previewHex   = document.getElementById('previewHex');
const previewRgb   = document.getElementById('previewRgb');
const previewImpr  = document.getElementById('previewImpression');
const checkerboard = document.getElementById('checkerboard');
const alphaSlider  = document.getElementById('alphaSlider');
const alphaVal     = document.getElementById('alphaVal');
const resHex       = document.getElementById('resHex');
const resRgb       = document.getElementById('resRgb');
const resRgba      = document.getElementById('resRgba');
const inputHint    = document.getElementById('inputHint');
const historyGrid  = document.getElementById('historyGrid');

/* ═══════════════════════════════════════
   PARSE
════════════════════════════════════════ */
function parseColor(str) {
  if (!str) return null;
  str = str.trim();

  // rgba(r,g,b,a)
  let m = str.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (m) {
    const r = +m[1], g = +m[2], b = +m[3], a = m[4] !== undefined ? parseFloat(m[4]) : 1;
    if (r > 255 || g > 255 || b > 255) return null;
    return { r, g, b, a: Math.min(1, Math.max(0, a)) };
  }

  // r,g,b  or  r, g, b
  m = str.match(/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/);
  if (m) {
    const r = +m[1], g = +m[2], b = +m[3];
    if (r > 255 || g > 255 || b > 255) return null;
    return { r, g, b, a: currentA };
  }

  // hex  #RGB #RRGGBB RGB RRGGBB
  str = str.replace(/^#/, '');
  if (/^[0-9a-f]{3}$/i.test(str)) {
    str = str[0]+str[0]+str[1]+str[1]+str[2]+str[2];
  }
  if (/^[0-9a-f]{6}$/i.test(str)) {
    const r = parseInt(str.slice(0,2),16);
    const g = parseInt(str.slice(2,4),16);
    const b = parseInt(str.slice(4,6),16);
    return { r, g, b, a: currentA };
  }

  return null;
}

/* ═══════════════════════════════════════
   CONVERT HELPERS
════════════════════════════════════════ */
function toHex(r, g, b) {
  return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0').toUpperCase()).join('');
}
function toRgb(r, g, b) {
  return `rgb(${r}, ${g}, ${b})`;
}
function toRgba(r, g, b, a) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/* ═══════════════════════════════════════
   LUMINANCE & CONTRAST
════════════════════════════════════════ */
function relativeLuminance(r, g, b) {
  const sRGB = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}
function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}

/* ═══════════════════════════════════════
   READABLE TEXT COLOR
════════════════════════════════════════ */
function readableColor(r, g, b) {
  const lum = relativeLuminance(r, g, b);
  return lum > 0.179 ? '#1e1e2e' : '#ffffff';
}

/* ═══════════════════════════════════════
   COLOR IMPRESSION
════════════════════════════════════════ */
function getImpression(r, g, b) {
  const tags = [];
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  const lightness = (max + min) / 2;
  const saturation = max === min ? 0 : (max - min) / (255 - Math.abs(2 * lightness - 255));

  if (lightness < 60) tags.push('ダーク');
  else if (lightness > 200) tags.push('ライト');

  if (saturation < 0.15) {
    tags.push('無彩色');
  } else {
    const hue = getHue(r, g, b);
    if (hue < 30 || hue >= 330) tags.push('暖色 🔴');
    else if (hue < 90) tags.push('暖色 🟡');
    else if (hue < 150) tags.push('寒色 🟢');
    else if (hue < 210) tags.push('寒色 🔵');
    else if (hue < 270) tags.push('寒色 💜');
    else tags.push('暖色 💗');
  }

  if (lightness > 230 && saturation < 0.2) tags.push('清潔感');
  if (lightness < 80 && saturation > 0.5) tags.push('インパクト');
  if (saturation > 0.7 && lightness > 100 && lightness < 200) tags.push('鮮やか');
  if (saturation < 0.3 && lightness > 100) tags.push('落ち着き');

  return tags.slice(0, 3);
}
function getHue(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  if (max === min) return 0;
  let h;
  const d = max - min;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return h * 360;
}

/* ═══════════════════════════════════════
   UPDATE UI
════════════════════════════════════════ */
function updateUI(r, g, b, a) {
  const hex  = toHex(r, g, b);
  const rgb  = toRgb(r, g, b);
  const rgba = toRgba(r, g, b, a);
  const tc   = readableColor(r, g, b);

  // Preview
  colorPreview.style.backgroundColor = rgba;
  previewHex.textContent  = hex;
  previewRgb.textContent  = `R${r} G${g} B${b}${a < 1 ? ` A${a}` : ''}`;
  previewHex.style.color  = tc;
  previewRgb.style.color  = tc;

  // Show checker when alpha < 1
  checkerboard.style.display = a < 1 ? 'block' : 'none';

  // Impressions
  const tags = getImpression(r, g, b);
  previewImpr.innerHTML = tags.map(t =>
    `<span class="impression-tag" style="color:${tc}">${t}</span>`
  ).join('');

  // Result values
  resHex.textContent  = hex;
  resRgb.textContent  = rgb;
  resRgba.textContent = rgba;

  // Alpha slider gradient
  alphaSlider.style.background =
    `linear-gradient(to right, rgba(${r},${g},${b},0), rgb(${r},${g},${b}))`;

  // CSS examples
  document.getElementById('cssColor').innerHTML =
    `<span class="css-prop">color</span>: <span class="css-val">${hex}</span>;`;
  document.getElementById('cssBg').innerHTML =
    `<span class="css-prop">background-color</span>: <span class="css-val">${rgba}</span>;`;
  document.getElementById('cssBorder').innerHTML =
    `<span class="css-prop">border</span>: <span class="css-val">1px solid ${hex}</span>;`;
  document.getElementById('cssBox').innerHTML =
    `<span class="css-prop">box-shadow</span>: <span class="css-val">0 4px 12px ${toRgba(r,g,b,0.3)}</span>;`;

  // Color picker sync
  colorPicker.value = hex;

  // Contrast
  const bgLum = relativeLuminance(r, g, b);
  const whiteLum = 1, blackLum = 0;
  const wRatio = contrastRatio(bgLum, whiteLum);
  const bRatio = contrastRatio(bgLum, blackLum);

  updateContrast('contrastWhite', '#ffffff', r, g, b, wRatio);
  updateContrast('contrastBlack', '#000000', r, g, b, bRatio);

  // Palette button hex
  document.getElementById('paletteBtn').dataset.hex = hex.replace('#','');
}

function updateContrast(id, textColor, r, g, b, ratio) {
  const el = document.getElementById(id);
  el.style.background = toRgb(r, g, b);
  el.querySelector('.contrast-swatch').style.color = textColor;
  el.querySelector('.contrast-ratio').style.color = textColor;
  el.querySelector('.contrast-ratio').textContent = ratio + ':1';
  const n = parseFloat(ratio);
  const aaLarge = n >= 3, aa = n >= 4.5, aaa = n >= 7;
  el.querySelector('.contrast-badges').innerHTML = `
    <span class="badge ${aa ? 'badge-pass' : 'badge-fail'}">AA</span>
    <span class="badge ${aaa ? 'badge-pass' : 'badge-fail'}">AAA</span>
    <span class="badge ${aaLarge ? 'badge-pass' : 'badge-fail'}">大文字</span>
  `;
}

/* ═══════════════════════════════════════
   PROCESS INPUT
════════════════════════════════════════ */
function processInput(val, silent) {
  const parsed = parseColor(val);
  if (!parsed) {
    if (!silent && val.length > 0) {
      colorInput.classList.add('error');
      inputHint.textContent = '⚠ 認識できない形式です';
      inputHint.className = 'input-hint error-msg';
    }
    return false;
  }
  colorInput.classList.remove('error');
  inputHint.textContent = '入力例: #FF5733 / rgb(255,87,51) / rgba(255,87,51,0.5)';
  inputHint.className = 'input-hint';

  currentR = parsed.r;
  currentG = parsed.g;
  currentB = parsed.b;
  currentA = parsed.a;
  alphaSlider.value = parsed.a;
  alphaVal.textContent = parsed.a.toFixed(2);

  updateUI(parsed.r, parsed.g, parsed.b, parsed.a);
  return true;
}

/* ═══════════════════════════════════════
   EVENTS
════════════════════════════════════════ */
colorInput.addEventListener('input', () => {
  const ok = processInput(colorInput.value, false);
  if (ok) saveHistory();
});

colorPicker.addEventListener('input', () => {
  colorInput.value = colorPicker.value;
  processInput(colorPicker.value, true);
  saveHistory();
});

alphaSlider.addEventListener('input', () => {
  currentA = parseFloat(alphaSlider.value);
  alphaVal.textContent = currentA.toFixed(2);
  updateUI(currentR, currentG, currentB, currentA);
});

/* ── Copy buttons ── */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    const val = document.getElementById(target).textContent;
    copyText(val, btn);
  });
});
document.querySelectorAll('.css-copy').forEach(btn => {
  btn.addEventListener('click', () => {
    const code = btn.previousElementSibling.textContent;
    copyText(code, btn);
  });
});

function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add('copied');
    btn.textContent = '✓';
    showToast('コピーしました ✓');
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.textContent = btn.classList.contains('css-copy') ? '⎘' : '⎘';
    }, 1500);
  });
}

/* ── Toast ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2000);
}

/* ── Palette button ── */
document.getElementById('paletteBtn').addEventListener('click', function() {
  const hex = this.dataset.hex || '6c63ff';
  window.open(PALETTE_URL + '?color=' + encodeURIComponent(hex), '_blank');
});

/* ── Section toggles ── */
document.querySelectorAll('.section-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('collapsed');
    const body = btn.nextElementSibling;
    body.classList.toggle('collapsed');
  });
});

/* ═══════════════════════════════════════
   HISTORY
════════════════════════════════════════ */
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
}
function saveHistory() {
  const hex = toHex(currentR, currentG, currentB);
  let hist = loadHistory().filter(h => h.hex !== hex);
  hist.unshift({ hex, r: currentR, g: currentG, b: currentB });
  if (hist.length > MAX_HISTORY) hist = hist.slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
  renderHistory();
}
function renderHistory() {
  const hist = loadHistory();
  if (hist.length === 0) {
    historyGrid.innerHTML = '<div class="history-empty">まだ履歴がありません</div>';
    return;
  }
  historyGrid.innerHTML = hist.map((h, i) => `
    <div class="history-item" title="${h.hex}" data-index="${i}">
      <div class="history-swatch" style="background:${h.hex}"></div>
      <button class="history-del" data-index="${i}" title="削除">×</button>
    </div>
  `).join('');

  historyGrid.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', e => {
      if (e.target.classList.contains('history-del')) return;
      const hist = loadHistory();
      const h = hist[+item.dataset.index];
      colorInput.value = h.hex;
      processInput(h.hex, true);
    });
  });
  historyGrid.querySelectorAll('.history-del').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      let hist = loadHistory();
      hist.splice(+btn.dataset.index, 1);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
      renderHistory();
    });
  });
}

/* ═══════════════════════════════════════
   URL PARAMS
════════════════════════════════════════ */
function initFromURL() {
  const params = new URLSearchParams(location.search);
  const c = params.get('color');
  if (c) {
    const val = c.startsWith('#') ? c : '#' + c;
    colorInput.value = val;
    processInput(val, false);
    return;
  }
  // default
  processInput('#6C63FF', true);
}

/* ═══════════════════════════════════════
   THEME TOGGLE
════════════════════════════════════════ */
function initTheme() {
  const saved = localStorage.getItem('hexrgb_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved ? saved === 'dark' : prefersDark;
  applyTheme(isDark ? 'dark' : 'light');
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggle');
  btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  btn.title = theme === 'dark' ? 'ライトモードに切替' : 'ダークモードに切替';
  localStorage.setItem('hexrgb_theme', theme);
}
document.getElementById('themeToggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ═══════════════════════════════════════
   INIT
════════════════════════════════════════ */
initTheme();
renderHistory();
initFromURL();

/* ── Service Worker ── */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js');
}
