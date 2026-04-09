'use strict';

// ============================================================
// 定数
// ============================================================
const HISTORY_MAX = 50;
const STORAGE_SETTINGS = 'tax_calc_settings_v1';
const STORAGE_HISTORY  = 'tax_calc_history_v1';

// ============================================================
// アプリ状態
// ============================================================
const state = {
  calcMode:       'from_ex',  // 'from_ex' | 'from_in'
  inputMode:      'single',   // 'single'  | 'multi'
  taxRatePreset:  '10',       // '10' | '8' | 'custom'
  customTaxRate:  '',
  roundingMethod: 'round',    // 'floor' | 'ceil' | 'round'
  singleRaw:      '',         // 計算用の生数値文字列（カンマなし）
  singleDisplay:  '',         // 表示用（カンマあり）
  multiText:      '',
  darkMode:       window.matchMedia('(prefers-color-scheme: dark)').matches,
  currentResult:  null,
  history:        []
};

// ============================================================
// 計算エンジン
// ============================================================

/** 端数処理 */
function applyRounding(value, method) {
  if (method === 'floor') return Math.floor(value);
  if (method === 'ceil')  return Math.ceil(value);
  return Math.round(value); // default: round
}

/** 有効な税率を取得。無効なら null */
function getEffectiveTaxRate() {
  if (state.taxRatePreset === '10') return 10;
  if (state.taxRatePreset === '8')  return 8;
  const v = parseFloat(state.customTaxRate);
  if (!isNaN(v) && v >= 0 && v <= 100) return v;
  return null;
}

/**
 * 税抜 → 税込
 * 税額に端数処理 → 税込 = 税抜 + 税額
 */
function calcFromEx(amount, taxRate, rounding) {
  const taxEx     = amount;
  const taxAmount = applyRounding(taxEx * (taxRate / 100), rounding);
  const taxIn     = taxEx + taxAmount;
  return { taxEx, taxAmount, taxIn };
}

/**
 * 税込 → 税抜
 * 税抜に端数処理 → 税額 = 税込 - 税抜
 */
function calcFromIn(amount, taxRate, rounding) {
  const taxIn     = amount;
  const taxEx     = applyRounding(taxIn / (1 + taxRate / 100), rounding);
  const taxAmount = taxIn - taxEx;
  return { taxEx, taxAmount, taxIn };
}

/** 単一入力の計算。結果オブジェクトを返す */
function runSingleCalc() {
  const taxRate = getEffectiveTaxRate();
  if (taxRate === null) return { status: 'tax_rate_error' };

  const raw = state.singleRaw.replace(/,/g, '');
  if (raw === '') return { status: 'empty' };

  const amount = parseFloat(raw);
  if (isNaN(amount) || amount < 0) return { status: 'amount_error' };

  const base = state.calcMode === 'from_ex'
    ? calcFromEx(amount, taxRate, state.roundingMethod)
    : calcFromIn(amount, taxRate, state.roundingMethod);

  return {
    status: 'ok',
    result: {
      ...base,
      taxRate,
      roundingMethod: state.roundingMethod,
      calcMode:       state.calcMode,
      inputAmount:    amount,
      inputMode:      'single'
    }
  };
}

/** 複数入力の計算 */
function runMultiCalc() {
  const taxRate = getEffectiveTaxRate();
  if (taxRate === null) return { status: 'tax_rate_error', lines: [] };

  const text = state.multiText.trim();
  if (!text) return { status: 'empty', lines: [] };

  const lines = text.split('\n').map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed === '') return { idx, raw: trimmed, status: 'skip' };

    // カンマを除去してから数値変換
    const cleaned = trimmed.replace(/,/g, '');
    const num = parseFloat(cleaned);
    if (isNaN(num))    return { idx, raw: trimmed, status: 'invalid', msg: `${idx + 1}行目: 数値として読み取れません (「${trimmed}」)` };
    if (num < 0)       return { idx, raw: trimmed, status: 'invalid', msg: `${idx + 1}行目: 負の値は無効です` };
    return { idx, raw: trimmed, status: 'valid', value: num };
  });

  const validLines   = lines.filter(l => l.status === 'valid');
  const invalidLines = lines.filter(l => l.status === 'invalid');

  if (validLines.length === 0) return { status: 'no_valid', lines };

  const total = validLines.reduce((sum, l) => sum + l.value, 0);
  const base  = state.calcMode === 'from_ex'
    ? calcFromEx(total, taxRate, state.roundingMethod)
    : calcFromIn(total, taxRate, state.roundingMethod);

  return {
    status: invalidLines.length > 0 ? 'partial' : 'ok',
    result: {
      ...base,
      taxRate,
      roundingMethod: state.roundingMethod,
      calcMode:       state.calcMode,
      inputAmount:    total,
      inputMode:      'multi',
      itemCount:      validLines.length,
      invalidCount:   invalidLines.length
    },
    lines,
    invalidLines
  };
}

// ============================================================
// フォーマットユーティリティ
// ============================================================

/** 数値を整数として3桁区切り表示 */
function fmt(n) {
  if (n === null || n === undefined || isNaN(n)) return '–';
  return Number(Math.floor(n)).toLocaleString('ja-JP');
}

/** 端数処理の日本語ラベル */
function roundingLabel(method) {
  return { floor: '切り捨て', ceil: '切り上げ', round: '四捨五入' }[method] || method;
}

/** 計算モードの日本語ラベル */
function calcModeLabel(mode) {
  return mode === 'from_ex' ? '税抜から計算' : '税込から計算';
}

/** コピー用テキスト生成 */
function buildCopyText(r) {
  return `税抜 ${fmt(r.taxEx)}円 / 消費税 ${fmt(r.taxAmount)}円 / 税込 ${fmt(r.taxIn)}円 / 税率 ${r.taxRate}% / 端数処理: ${roundingLabel(r.roundingMethod)}`;
}

// ============================================================
// LocalStorage
// ============================================================

function saveSettings() {
  try {
    localStorage.setItem(STORAGE_SETTINGS, JSON.stringify({
      calcMode:       state.calcMode,
      inputMode:      state.inputMode,
      taxRatePreset:  state.taxRatePreset,
      customTaxRate:  state.customTaxRate,
      roundingMethod: state.roundingMethod,
      darkMode:       state.darkMode,
      singleRaw:      state.singleRaw,
      singleDisplay:  state.singleDisplay,
      multiText:      state.multiText
    }));
  } catch (e) { /* quota exceeded 等は無視 */ }
}

function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_SETTINGS) || 'null');
    if (!s) return;
    Object.assign(state, {
      calcMode:       s.calcMode       || state.calcMode,
      inputMode:      s.inputMode      || state.inputMode,
      taxRatePreset:  s.taxRatePreset  || state.taxRatePreset,
      customTaxRate:  s.customTaxRate  ?? state.customTaxRate,
      roundingMethod: s.roundingMethod || state.roundingMethod,
      darkMode:       s.darkMode       !== undefined ? s.darkMode : state.darkMode,
      singleRaw:      s.singleRaw      || '',
      singleDisplay:  s.singleDisplay  || '',
      multiText:      s.multiText      || ''
    });
  } catch (e) { /* 破損データ無視 */ }
}

function saveHistory() {
  try {
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(state.history));
  } catch (e) { /* ignore */ }
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY);
    if (raw) state.history = JSON.parse(raw);
  } catch (e) {
    state.history = [];
  }
}

// ============================================================
// 履歴管理
// ============================================================

function addToHistory(result) {
  if (!result) return;

  // 直前と同一内容なら追加しない
  if (state.history.length > 0) {
    const last = state.history[0];
    if (
      last.calcMode       === result.calcMode &&
      last.inputAmount    === result.inputAmount &&
      last.taxRate        === result.taxRate &&
      last.roundingMethod === result.roundingMethod
    ) return;
  }

  const entry = {
    id:            Date.now(),
    timestamp:     new Date().toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    calcMode:      result.calcMode,
    inputAmount:   result.inputAmount,
    taxRate:       result.taxRate,
    roundingMethod:result.roundingMethod,
    taxEx:         result.taxEx,
    taxAmount:     result.taxAmount,
    taxIn:         result.taxIn,
    inputMode:     result.inputMode,
    itemCount:     result.itemCount || null
  };

  state.history.unshift(entry);
  if (state.history.length > HISTORY_MAX) {
    state.history = state.history.slice(0, HISTORY_MAX);
  }

  saveHistory();
  renderHistory();
}

function deleteHistoryItem(id) {
  state.history = state.history.filter(h => h.id !== id);
  saveHistory();
  renderHistory();
}

function clearAllHistory() {
  state.history = [];
  saveHistory();
  renderHistory();
}

function loadHistoryItem(entry) {
  // 設定を復元
  state.calcMode       = entry.calcMode;
  state.roundingMethod = entry.roundingMethod;
  state.inputMode      = entry.inputMode || 'single';

  if (['10', '8'].includes(String(entry.taxRate))) {
    state.taxRatePreset = String(entry.taxRate);
  } else {
    state.taxRatePreset = 'custom';
    state.customTaxRate = String(entry.taxRate);
  }

  // 入力値を復元（元のモードの入力値に戻す）
  const inputVal = entry.calcMode === 'from_ex' ? entry.taxEx : entry.taxIn;
  state.singleRaw     = String(inputVal);
  state.singleDisplay = Number(inputVal).toLocaleString('ja-JP');
  state.multiText     = '';

  syncUIFromState();
  triggerCalculation();
  saveSettings();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// Toast
// ============================================================
let toastTimer = null;

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}

// ============================================================
// コピー
// ============================================================
async function copyResult() {
  if (!state.currentResult) return;
  const text = buildCopyText(state.currentResult);
  try {
    await navigator.clipboard.writeText(text);
    showToast('コピーしました ✓');
  } catch {
    // フォールバック（古いブラウザ）
    const tmp = document.createElement('textarea');
    tmp.value = text;
    Object.assign(tmp.style, { position: 'fixed', opacity: '0', top: '0', left: '0' });
    document.body.appendChild(tmp);
    tmp.focus();
    tmp.select();
    try { document.execCommand('copy'); showToast('コピーしました ✓'); } catch { showToast('コピーに失敗しました'); }
    document.body.removeChild(tmp);
  }
}

// ============================================================
// 計算実行 & 結果描画
// ============================================================

function triggerCalculation() {
  const isSingle = state.inputMode === 'single';
  const calc     = isSingle ? runSingleCalc() : runMultiCalc();

  switch (calc.status) {
    case 'empty':
      renderPlaceholder();
      state.currentResult = null;
      break;
    case 'tax_rate_error':
      renderError('税率を正しく入力してください（0〜100）');
      state.currentResult = null;
      break;
    case 'amount_error':
      renderError('有効な金額を入力してください（0以上の数値）');
      state.currentResult = null;
      break;
    case 'no_valid':
      renderError('有効な金額が1件もありません');
      state.currentResult = null;
      renderMultiValidation(calc.lines);
      break;
    case 'ok':
    case 'partial':
      renderResult(calc.result);
      state.currentResult = calc.result;
      if (!isSingle && calc.lines) renderMultiValidation(calc.lines);
      break;
    default:
      renderPlaceholder();
      state.currentResult = null;
  }

  document.getElementById('copyBtn').disabled = !state.currentResult;
}

function renderPlaceholder() {
  document.getElementById('resultArea').innerHTML = `
    <div class="result-placeholder">
      <span class="placeholder-icon" aria-hidden="true">💡</span>
      <p>金額を入力すると<br>計算結果が表示されます</p>
    </div>`;
}

function renderError(msg) {
  document.getElementById('resultArea').innerHTML = `
    <div class="result-placeholder">
      <span class="placeholder-icon" aria-hidden="true">⚠️</span>
      <p>${escapeHtml(msg)}</p>
    </div>`;
}

function renderResult(r) {
  const isFromEx   = r.calcMode === 'from_ex';
  const multiInfo  = r.inputMode === 'multi'
    ? `<div class="result-multi-summary">📦 ${r.itemCount}件の合計 | 不正行: ${r.invalidCount}件</div>`
    : '';

  // 3行を calcMode に応じて並べ替える
  // from_ex: [税抜(入力), 消費税, 税込(強調)]
  // from_in: [税込(入力), 税抜(強調), 消費税]
  const rows = isFromEx ? `
    <div class="result-row">
      <span class="result-row-label">入力（税抜）</span>
      <span class="result-row-value">¥${fmt(r.taxEx)}<span class="result-row-unit">円</span></span>
    </div>
    <div class="result-row">
      <span class="result-row-label">消費税額</span>
      <span class="result-row-value">¥${fmt(r.taxAmount)}<span class="result-row-unit">円</span></span>
    </div>
    <div class="result-row highlight">
      <span class="result-row-label">税込価格</span>
      <span class="result-row-value">¥${fmt(r.taxIn)}<span class="result-row-unit">円</span></span>
    </div>
  ` : `
    <div class="result-row">
      <span class="result-row-label">入力（税込）</span>
      <span class="result-row-value">¥${fmt(r.taxIn)}<span class="result-row-unit">円</span></span>
    </div>
    <div class="result-row highlight">
      <span class="result-row-label">税抜価格</span>
      <span class="result-row-value">¥${fmt(r.taxEx)}<span class="result-row-unit">円</span></span>
    </div>
    <div class="result-row">
      <span class="result-row-label">消費税額</span>
      <span class="result-row-value">¥${fmt(r.taxAmount)}<span class="result-row-unit">円</span></span>
    </div>
  `;

  document.getElementById('resultArea').innerHTML = `
    <div class="result-content">
      <div class="result-meta">
        <span class="result-meta-tag">${calcModeLabel(r.calcMode)}</span>
        <span class="result-meta-tag">税率 ${r.taxRate}%</span>
        <span class="result-meta-tag">${roundingLabel(r.roundingMethod)}</span>
      </div>
      ${multiInfo}
      <div class="result-rows">${rows}</div>
    </div>`;
}

function renderMultiValidation(lines) {
  const el           = document.getElementById('multiValidation');
  const validCount   = lines.filter(l => l.status === 'valid').length;
  const invalidLines = lines.filter(l => l.status === 'invalid');

  if (invalidLines.length === 0) {
    el.innerHTML = `<div class="multi-val-item valid">✓ ${validCount}件すべて有効です</div>`;
    return;
  }

  let html = `<div class="multi-val-item valid">✓ ${validCount}件が有効</div>`;
  invalidLines.forEach(l => {
    html += `<div class="multi-val-item invalid">✗ ${escapeHtml(l.msg)}</div>`;
  });
  el.innerHTML = html;
}

// ============================================================
// 履歴描画
// ============================================================

function renderHistory() {
  const container = document.getElementById('historyList');

  if (state.history.length === 0) {
    container.innerHTML = `
      <div class="history-empty">
        <div class="history-empty-icon">📋</div>
        <p>まだ履歴がありません</p>
      </div>`;
    return;
  }

  container.innerHTML = state.history.map(e => `
    <div class="history-item" role="listitem">
      <div class="history-item-header">
        <span class="history-item-mode">${calcModeLabel(e.calcMode)}</span>
        <span class="history-item-time">${e.timestamp}</span>
      </div>
      <div class="history-item-values">
        <div class="history-value">
          <span class="history-value-label">税率</span>
          <span class="history-value-num">${e.taxRate}%</span>
        </div>
        <div class="history-value">
          <span class="history-value-label">税抜</span>
          <span class="history-value-num">¥${fmt(e.taxEx)}</span>
        </div>
        <div class="history-value">
          <span class="history-value-label">税額</span>
          <span class="history-value-num">¥${fmt(e.taxAmount)}</span>
        </div>
        <div class="history-value">
          <span class="history-value-label">税込</span>
          <span class="history-value-num">¥${fmt(e.taxIn)}</span>
        </div>
        ${e.itemCount ? `<div class="history-value"><span class="history-value-label">件数</span><span class="history-value-num">${e.itemCount}件</span></div>` : ''}
      </div>
      <div class="history-item-actions">
        <button class="history-btn history-btn-load" data-id="${e.id}" aria-label="この履歴を再利用">再利用</button>
        <button class="history-btn history-btn-delete" data-id="${e.id}" aria-label="この履歴を削除">削除</button>
      </div>
    </div>`).join('');
}

// ============================================================
// UI 同期（state → DOM）
// ============================================================

function syncUIFromState() {
  // Dark mode
  document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');

  // Calc mode tabs
  document.querySelectorAll('.calc-tab').forEach(btn => {
    const active = btn.dataset.mode === state.calcMode;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', String(active));
  });

  // Input mode buttons
  document.querySelectorAll('.input-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.input === state.inputMode);
  });

  // Input area visibility
  document.getElementById('singleInputArea').classList.toggle('hidden', state.inputMode !== 'single');
  document.getElementById('multiInputArea').classList.toggle('hidden',  state.inputMode !== 'multi');

  // Amount label
  document.getElementById('amountLabel').textContent =
    state.calcMode === 'from_ex' ? '税抜金額' : '税込金額';

  // Amount input
  const amtEl = document.getElementById('amountInput');
  if (amtEl !== document.activeElement) {
    amtEl.value = state.singleDisplay;
  }

  // Multi textarea
  const multiEl = document.getElementById('multiAmountInput');
  if (multiEl !== document.activeElement) {
    multiEl.value = state.multiText;
  }

  // Tax rate buttons
  document.querySelectorAll('[data-rate]').forEach(btn => {
    const active = btn.dataset.rate === state.taxRatePreset;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  // Custom rate area
  document.getElementById('customRateArea').classList.toggle('hidden', state.taxRatePreset !== 'custom');
  if (state.taxRatePreset === 'custom') {
    const cr = document.getElementById('customRateInput');
    if (cr !== document.activeElement) cr.value = state.customTaxRate;
  }

  // Rounding buttons
  document.querySelectorAll('[data-round]').forEach(btn => {
    const active = btn.dataset.round === state.roundingMethod;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  // Formula hint
  updateFormulaHint();
}

function updateFormulaHint() {
  const rl = roundingLabel(state.roundingMethod);
  const el = document.getElementById('formulaHint');

  if (state.calcMode === 'from_ex') {
    el.innerHTML = `
      <div class="formula-line">① 税額 ＝ <code>税抜価格 × 税率 ÷ 100</code></div>
      <div class="formula-line">② 税額に <span class="formula-highlight">${rl}</span> を適用</div>
      <div class="formula-line">③ 税込価格 ＝ <code>税抜価格 + 税額</code></div>`;
  } else {
    el.innerHTML = `
      <div class="formula-line">① 税抜価格 ＝ <code>税込価格 ÷ (1 + 税率 ÷ 100)</code></div>
      <div class="formula-line">② 税抜価格に <span class="formula-highlight">${rl}</span> を適用</div>
      <div class="formula-line">③ 税額 ＝ <code>税込価格 − 税抜価格</code></div>`;
  }
}

// ============================================================
// 入力処理
// ============================================================

/** 入力中：不正な文字を除去するのみ（カーソル位置を保つ） */
function handleAmountInput(e) {
  const input  = e.target;
  let raw      = input.value.replace(/[^\d.]/g, '');

  // 小数点の重複を排除
  const dotIdx = raw.indexOf('.');
  if (dotIdx !== -1) {
    raw = raw.slice(0, dotIdx + 1) + raw.slice(dotIdx + 1).replace(/\./g, '');
  }
  // 小数2桁に制限
  if (dotIdx !== -1 && raw.slice(dotIdx + 1).length > 2) {
    raw = raw.slice(0, dotIdx + 3);
  }

  // フィールドに変化があれば更新（カーソル維持）
  if (input.value !== raw) {
    const cursor = input.selectionStart - (input.value.length - raw.length);
    input.value  = raw;
    const pos    = Math.max(0, Math.min(cursor, raw.length));
    input.setSelectionRange(pos, pos);
  }

  state.singleRaw     = raw;
  state.singleDisplay = raw;

  triggerCalculation();
  saveSettings();
}

/** フォーカス時：カンマ除去（生の数字のみにする） */
function handleAmountFocus(e) {
  e.target.value = state.singleRaw;
}

/** フォーカスアウト時：カンマ付きで整形 */
function handleAmountBlur(e) {
  const raw = state.singleRaw;
  if (raw !== '' && !isNaN(parseFloat(raw))) {
    const num   = parseFloat(raw);
    const parts = raw.split('.');
    const formatted = parts.length > 1
      ? num.toLocaleString('ja-JP', {
          minimumFractionDigits:  parts[1].length,
          maximumFractionDigits:  2
        })
      : num.toLocaleString('ja-JP');
    state.singleDisplay = formatted;
    e.target.value      = formatted;
  }
  // 結果を履歴へ
  if (state.currentResult) addToHistory(state.currentResult);
}

// ============================================================
// イベントバインド
// ============================================================

function bindEvents() {
  // ダークモード
  document.getElementById('darkModeToggle').addEventListener('click', () => {
    state.darkMode = !state.darkMode;
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
    saveSettings();
  });

  // 計算モードタブ
  document.querySelectorAll('.calc-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      state.calcMode = btn.dataset.mode;
      syncUIFromState();
      triggerCalculation();
      saveSettings();
    });
  });

  // 入力モード切替
  document.querySelectorAll('.input-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.inputMode = btn.dataset.input;
      syncUIFromState();
      triggerCalculation();
      saveSettings();
    });
  });

  // 単一金額入力
  const amtEl = document.getElementById('amountInput');
  amtEl.addEventListener('input',  handleAmountInput);
  amtEl.addEventListener('focus',  handleAmountFocus);
  amtEl.addEventListener('blur',   handleAmountBlur);
  amtEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      amtEl.blur();
    }
  });

  // 金額クリアボタン
  document.getElementById('clearAmountBtn').addEventListener('click', () => {
    state.singleRaw     = '';
    state.singleDisplay = '';
    amtEl.value         = '';
    triggerCalculation();
    saveSettings();
    amtEl.focus();
  });

  // 複数入力テキストエリア
  const multiEl = document.getElementById('multiAmountInput');
  multiEl.addEventListener('input', () => {
    state.multiText = multiEl.value;
    triggerCalculation();
    saveSettings();
  });
  multiEl.addEventListener('blur', () => {
    if (state.currentResult) addToHistory(state.currentResult);
  });

  // 税率ボタン
  document.querySelectorAll('[data-rate]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.taxRatePreset = btn.dataset.rate;
      syncUIFromState();
      triggerCalculation();
      saveSettings();
    });
  });

  // 任意税率入力
  const customRateEl = document.getElementById('customRateInput');
  customRateEl.addEventListener('input', () => {
    state.customTaxRate = customRateEl.value;
    const v             = parseFloat(customRateEl.value);
    const errEl         = document.getElementById('customRateError');
    if (customRateEl.value !== '' && (isNaN(v) || v < 0 || v > 100)) {
      errEl.textContent = '0〜100 の範囲で入力してください';
      errEl.classList.remove('hidden');
    } else {
      errEl.classList.add('hidden');
    }
    triggerCalculation();
    saveSettings();
  });

  // 端数処理ボタン
  document.querySelectorAll('[data-round]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.roundingMethod = btn.dataset.round;
      syncUIFromState();
      triggerCalculation();
      saveSettings();
      if (state.currentResult) addToHistory(state.currentResult);
    });
  });

  // コピーボタン
  document.getElementById('copyBtn').addEventListener('click', copyResult);

  // 全クリアボタン
  document.getElementById('clearAllBtn').addEventListener('click', () => {
    state.singleRaw     = '';
    state.singleDisplay = '';
    state.multiText     = '';
    document.getElementById('amountInput').value      = '';
    document.getElementById('multiAmountInput').value = '';
    document.getElementById('multiValidation').innerHTML = '';
    triggerCalculation();
    saveSettings();
  });

  // 履歴ボタン（イベント委任）
  document.getElementById('historyList').addEventListener('click', e => {
    const loadBtn = e.target.closest('.history-btn-load');
    const delBtn  = e.target.closest('.history-btn-delete');

    if (loadBtn) {
      const id    = Number(loadBtn.dataset.id);
      const entry = state.history.find(h => h.id === id);
      if (entry) loadHistoryItem(entry);
    }
    if (delBtn) {
      const id = Number(delBtn.dataset.id);
      deleteHistoryItem(id);
    }
  });

  // 履歴一括クリア
  document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    if (state.history.length === 0) return;
    if (confirm('履歴をすべて削除しますか？')) {
      clearAllHistory();
      showToast('履歴をクリアしました');
    }
  });

  // オフライン検知
  window.addEventListener('offline', () => document.getElementById('offlineBanner').classList.remove('hidden'));
  window.addEventListener('online',  () => document.getElementById('offlineBanner').classList.add('hidden'));
}

// ============================================================
// Service Worker 登録
// ============================================================

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .catch(err => console.warn('SW registration failed:', err));
  }
}

// ============================================================
// セキュリティユーティリティ
// ============================================================

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================
// 初期化
// ============================================================

function init() {
  loadSettings();
  loadHistory();

  document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');

  syncUIFromState();
  triggerCalculation();
  renderHistory();
  bindEvents();
  registerSW();

  if (!navigator.onLine) {
    document.getElementById('offlineBanner').classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', init);
