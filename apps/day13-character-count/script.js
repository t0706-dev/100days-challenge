/* =============================================================
   高機能文字数カウントツール - script.js
   ============================================================= */

// =============================================================
// DOM 参照
// =============================================================
const textarea        = document.getElementById('mainTextarea');
const targetInput     = document.getElementById('targetCount');
const liveCount       = document.getElementById('liveCount');

// カウント表示
const totalCountEl    = document.getElementById('totalCount');
const noNewlineCountEl= document.getElementById('noNewlineCount');
const noSpaceCountEl  = document.getElementById('noSpaceCount');
const lineCountEl     = document.getElementById('lineCount');
const wordCountEl     = document.getElementById('wordCount');
const remainingCountEl= document.getElementById('remainingCount');
const remainingCard   = document.getElementById('remainingCard');

// 目標プログレス
const targetCard      = document.getElementById('targetCard');
const progressBar     = document.getElementById('progressBar');
const targetPctEl     = document.getElementById('targetPercentage');

// SNS
const snsBar140  = document.getElementById('snsBar140');
const snsBar280  = document.getElementById('snsBar280');
const snsCount140= document.getElementById('snsCount140');
const snsCount280= document.getElementById('snsCount280');

// チェックボックス
const cbHalfSpace = document.getElementById('excludeHalfSpace');
const cbFullSpace = document.getElementById('excludeFullSpace');
const cbNewline   = document.getElementById('excludeNewline');
const cbSymbol    = document.getElementById('excludeSymbol');
const cbUrl       = document.getElementById('excludeUrl');

// ボタン
const copyBtn       = document.getElementById('copyBtn');
const pasteBtn      = document.getElementById('pasteBtn');
const clearBtn      = document.getElementById('clearBtn');
const clearTargetBtn= document.getElementById('clearTarget');
const saveBtn       = document.getElementById('saveBtn');
const loadBtn       = document.getElementById('loadBtn');
const darkModeToggle= document.getElementById('darkModeToggle');
const fontSizeBtns  = document.querySelectorAll('.btn-icon[data-size]');

// ステータス
const statusMessage = document.getElementById('statusMessage');

// =============================================================
// 状態
// =============================================================
let isDarkMode    = false;
let currentFont   = 'small';
let statusTimer   = null;

// =============================================================
// ユーティリティ: デバウンス
// 連続入力時に無駄な再計算を防ぐ
// =============================================================
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// =============================================================
// カウントロジック
// =============================================================

/** チェックボックスの状態をオブジェクトで取得 */
function getOptions() {
  return {
    excludeHalfSpace: cbHalfSpace.checked,
    excludeFullSpace: cbFullSpace.checked,
    excludeNewline:   cbNewline.checked,
    excludeSymbol:    cbSymbol.checked,
    excludeUrl:       cbUrl.checked,
  };
}

/**
 * 除外オプションをテキストに適用して "有効テキスト" を返す
 * 目標文字数の残り計算に使用する
 */
function applyExclusions(text, opts) {
  let t = text;

  // URL 除外（https:// または http:// で始まる空白区切りのトークン）
  if (opts.excludeUrl) {
    t = t.replace(/https?:\/\/[^\s\u3000\n]*/g, '');
  }
  // 半角スペース除外
  if (opts.excludeHalfSpace) {
    t = t.replace(/ /g, '');
  }
  // 全角スペース除外
  if (opts.excludeFullSpace) {
    t = t.replace(/\u3000/g, '');
  }
  // 改行除外
  if (opts.excludeNewline) {
    t = t.replace(/\r?\n/g, '');
  }
  // 記号除外（日本語記号 + 一般的な ASCII 記号）
  if (opts.excludeSymbol) {
    t = t.replace(/[。、！？「」『』【】〔〕…・〜〈〉《》；：，．]/g, '');
    t = t.replace(/[!?;:,.'"()\[\]{}`~@#$%^&*_+=|\\/<>]/g, '');
  }

  return t;
}

/** 総文字数（改行・スペース含む生の長さ） */
function countTotal(text) {
  return text.length;
}

/** 改行を除いた文字数 */
function countWithoutNewlines(text) {
  return text.replace(/\r?\n/g, '').length;
}

/** 空白（半角・全角）と改行を除いた文字数 */
function countWithoutSpaces(text) {
  return text.replace(/[ \u3000\r\n\t]/g, '').length;
}

/** 行数（空文字のときは 0 を返す） */
function countLines(text) {
  if (text === '') return 0;
  return text.split('\n').length;
}

/**
 * 単語数（英語スペース区切り + 日本語はスペース/改行で区切られた塊）
 * 英文テキストや混在テキストを想定
 */
function countWords(text) {
  if (text.trim() === '') return 0;
  return text.trim().split(/[\s\u3000]+/).filter(w => w.length > 0).length;
}

/** 除外オプション適用後の実効文字数（目標管理用） */
function countEffective(text, opts) {
  return applyExclusions(text, opts).length;
}

/**
 * X（旧 Twitter）向け文字数カウント
 * URL は長さに関わらず 23 文字として換算
 */
function countSnsChars(text) {
  // URL を 23 文字のプレースホルダーで置換してから長さを取る
  return text.replace(/https?:\/\/[^\s\u3000\n]*/g, () => 'X'.repeat(23)).length;
}

// =============================================================
// 表示更新
// =============================================================

/** すべてのカウント表示を一括更新（入力イベント時に呼ぶ） */
function updateDisplay() {
  const text   = textarea.value;
  const opts   = getOptions();
  const target = parseInt(targetInput.value, 10) || 0;

  // --- 各カウント計算 ---
  const total     = countTotal(text);
  const noNewline = countWithoutNewlines(text);
  const noSpace   = countWithoutSpaces(text);
  const lines     = countLines(text);
  const words     = countWords(text);
  const effective = countEffective(text, opts);

  // --- 基本カウント表示 ---
  liveCount.textContent         = `${total.toLocaleString()} 文字`;
  totalCountEl.textContent      = total.toLocaleString();
  noNewlineCountEl.textContent  = noNewline.toLocaleString();
  noSpaceCountEl.textContent    = noSpace.toLocaleString();
  lineCountEl.textContent       = lines.toLocaleString();
  wordCountEl.textContent       = words.toLocaleString();

  // --- 目標 / 残り文字数 ---
  updateTarget(effective, target);

  // --- SNS カウント ---
  const snsChars = countSnsChars(text);
  updateSnsBar(snsBar140, snsCount140, snsChars, 140);
  updateSnsBar(snsBar280, snsCount280, snsChars, 280);

  // --- 自動保存 ---
  autoSave(text, targetInput.value);
}

/** 目標プログレスバーと残り文字数カードを更新 */
function updateTarget(effective, target) {
  if (target > 0) {
    const remaining = target - effective;

    // 残り文字数テキスト
    if (remaining > 0) {
      remainingCountEl.textContent = remaining.toLocaleString();
    } else if (remaining === 0) {
      remainingCountEl.textContent = '達成！';
    } else {
      remainingCountEl.textContent = `+${Math.abs(remaining).toLocaleString()}`;
    }

    // 残り文字数カードの色
    remainingCard.className = 'result-card';
    if (remaining < 0) {
      remainingCard.classList.add('danger');
    } else if (remaining === 0) {
      remainingCard.classList.add('success');
    } else if (remaining <= Math.ceil(target * 0.1)) {
      remainingCard.classList.add('warning');
    }

    // プログレスバー表示
    const pct = Math.min((effective / target) * 100, 100);
    targetCard.style.display = 'block';
    progressBar.style.width  = pct + '%';
    targetPctEl.textContent  = Math.floor(pct) + '%';

    progressBar.className = 'progress-bar';
    if (effective >= target) {
      progressBar.classList.add('success');
      targetPctEl.style.color = 'var(--success)';
    } else if (pct >= 80) {
      progressBar.classList.add('warning');
      targetPctEl.style.color = 'var(--warning)';
    } else {
      targetPctEl.style.color = 'var(--accent)';
    }
  } else {
    // 目標未設定
    remainingCountEl.textContent = '—';
    remainingCard.className      = 'result-card';
    targetCard.style.display     = 'none';
  }
}

/**
 * SNS プログレスバーを1つ更新する
 * @param {HTMLElement} barEl   - バー要素
 * @param {HTMLElement} countEl - カウント表示要素
 * @param {number} count        - 現在の文字数
 * @param {number} limit        - 制限文字数
 */
function updateSnsBar(barEl, countEl, count, limit) {
  const pct  = Math.min((count / limit) * 100, 100);
  const over = count > limit;

  barEl.style.width = pct + '%';
  barEl.className   = 'sns-bar';
  countEl.className = 'sns-count';

  if (over) {
    barEl.classList.add('danger');
    countEl.classList.add('danger');
    countEl.textContent = `${count} / ${limit}（${count - limit}文字超過）`;
  } else if (pct >= 80) {
    barEl.classList.add('warning');
    countEl.classList.add('warning');
    countEl.textContent = `${count} / ${limit}`;
  } else {
    countEl.textContent = `${count} / ${limit}`;
  }
}

// デバウンス付き更新（50ms）
const debouncedUpdate = debounce(updateDisplay, 50);

// =============================================================
// localStorage（自動保存・手動保存）
// =============================================================
const KEY_TEXT   = 'charcount_text';
const KEY_TARGET = 'charcount_target';
const KEY_MANUAL = 'charcount_manual';
const KEY_DARK   = 'charcount_dark';
const KEY_FONT   = 'charcount_font';

/** テキストと目標文字数を自動保存（毎入力時） */
function autoSave(text, target) {
  localStorage.setItem(KEY_TEXT,   text);
  localStorage.setItem(KEY_TARGET, target);
}

/** 起動時に自動保存済みのデータを復元 */
function restoreAutoSave() {
  const text   = localStorage.getItem(KEY_TEXT);
  const target = localStorage.getItem(KEY_TARGET);
  if (text   !== null) textarea.value    = text;
  if (target !== null) targetInput.value = target;
}

/** 手動保存：現在のテキストと目標を保存日時付きで記録 */
function manualSave() {
  const savedAt = new Date().toLocaleString('ja-JP');
  const data = {
    text:    textarea.value,
    target:  targetInput.value,
    savedAt,
  };
  localStorage.setItem(KEY_MANUAL, JSON.stringify(data));
  showStatus(`保存しました（${savedAt}）`, 'success');
}

/** 手動保存済みデータを読み込む */
function manualLoad() {
  const raw = localStorage.getItem(KEY_MANUAL);
  if (!raw) {
    showStatus('保存データが見つかりません', 'error');
    return;
  }
  const data = JSON.parse(raw);
  textarea.value    = data.text   || '';
  targetInput.value = data.target || '';
  updateDisplay();
  showStatus(`読み込みました（${data.savedAt}）`, 'success');
}

// =============================================================
// ステータスメッセージ
// =============================================================
function showStatus(message, type = 'success') {
  statusMessage.textContent = message;
  statusMessage.className   = `status-message ${type} show`;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    statusMessage.className = 'status-message';
  }, 3000);
}

// =============================================================
// クリップボード操作
// =============================================================

/** テキストエリアの内容をクリップボードにコピー */
async function copyText() {
  if (!textarea.value) {
    showStatus('コピーするテキストがありません', 'error');
    return;
  }
  try {
    await navigator.clipboard.writeText(textarea.value);
    showStatus('クリップボードにコピーしました', 'success');
  } catch {
    // Clipboard API が使えない環境では fallback
    try {
      textarea.select();
      document.execCommand('copy');
      showStatus('コピーしました', 'success');
    } catch {
      showStatus('コピーに失敗しました', 'error');
    }
  }
}

/** クリップボードのテキストをテキストエリアに追加貼り付け */
async function pasteText() {
  try {
    const text = await navigator.clipboard.readText();
    const start = textarea.selectionStart;
    const end   = textarea.selectionEnd;
    const prev  = textarea.value;
    // カーソル位置に挿入
    textarea.value = prev.slice(0, start) + text + prev.slice(end);
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    updateDisplay();
    showStatus('貼り付けました', 'success');
  } catch {
    showStatus('貼り付けに失敗しました（ブラウザの権限が必要です）', 'error');
  }
}

/** テキストをクリア（確認ダイアログ付き） */
function clearText() {
  if (!textarea.value) return;
  if (confirm('テキストをすべてクリアしますか？')) {
    textarea.value = '';
    updateDisplay();
    showStatus('クリアしました', 'success');
  }
}

// =============================================================
// ダークモード
// =============================================================
function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  applyDarkMode(isDarkMode);
  localStorage.setItem(KEY_DARK, isDarkMode ? '1' : '0');
}

function applyDarkMode(enabled) {
  document.documentElement.setAttribute('data-theme', enabled ? 'dark' : '');
  darkModeToggle.textContent = enabled ? '☀️' : '🌙';
}

function loadDarkMode() {
  isDarkMode = localStorage.getItem(KEY_DARK) === '1';
  applyDarkMode(isDarkMode);
}

// =============================================================
// フォントサイズ切替
// =============================================================
function setFontSize(size) {
  currentFont = size;
  document.documentElement.setAttribute('data-font', size);
  fontSizeBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.size === size);
  });
  localStorage.setItem(KEY_FONT, size);
}

function loadFontSize() {
  const saved = localStorage.getItem(KEY_FONT) || 'small';
  setFontSize(saved);
}

// =============================================================
// イベントリスナー
// =============================================================

// テキスト入力（デバウンスで軽量化）
textarea.addEventListener('input', debouncedUpdate);

// 目標文字数
targetInput.addEventListener('input', updateDisplay);
clearTargetBtn.addEventListener('click', () => {
  targetInput.value = '';
  updateDisplay();
});

// 除外チェックボックス変更時に再計算
[cbHalfSpace, cbFullSpace, cbNewline, cbSymbol, cbUrl].forEach(cb => {
  cb.addEventListener('change', updateDisplay);
});

// ボタン
copyBtn.addEventListener('click', copyText);
pasteBtn.addEventListener('click', pasteText);
clearBtn.addEventListener('click', clearText);
saveBtn.addEventListener('click', manualSave);
loadBtn.addEventListener('click', manualLoad);
darkModeToggle.addEventListener('click', toggleDarkMode);

// フォントサイズボタン
fontSizeBtns.forEach(btn => {
  btn.addEventListener('click', () => setFontSize(btn.dataset.size));
});

// =============================================================
// 初期化
// =============================================================
function init() {
  loadDarkMode();       // ダークモード設定復元
  loadFontSize();       // フォントサイズ復元
  restoreAutoSave();    // テキスト・目標文字数復元
  updateDisplay();      // 初期カウント表示
}

init();
