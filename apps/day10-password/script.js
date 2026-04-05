// ===========================
// 文字セット定義
// ===========================
const CHAR_SETS = {
  lower:  'abcdefghijklmnopqrstuvwxyz',
  upper:  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  number: '0123456789',
  symbol: '!@#$%^&*()-_=+[]{}|;:,.<>?',
};

// 似た文字（見分けにくい文字）
const SIMILAR_CHARS = new Set(['0', 'O', 'o', '1', 'l', 'I']);

// ===========================
// DOM 要素の取得
// ===========================
const passwordField     = document.getElementById('password-field');
const toggleVisibilityBtn = document.getElementById('toggle-visibility');
const iconEye           = document.getElementById('icon-eye');
const iconEyeOff        = document.getElementById('icon-eye-off');
const copyBtn           = document.getElementById('copy-btn');
const messageEl         = document.getElementById('message');
const strengthFill      = document.getElementById('strength-fill');
const strengthLabel     = document.getElementById('strength-label');

const lengthSlider      = document.getElementById('length-slider');
const lengthDisplay     = document.getElementById('length-display');
const useLower          = document.getElementById('use-lower');
const useUpper          = document.getElementById('use-upper');
const useNumber         = document.getElementById('use-number');
const useSymbol         = document.getElementById('use-symbol');
const excludeSimilar    = document.getElementById('exclude-similar');

const generateBtn       = document.getElementById('generate-btn');

// ===========================
// パスワード生成処理
// ===========================

/**
 * 選択中の文字種と設定から使用文字プールを構築する
 * @returns {{ pool: string, selectedSets: string[] } | null}
 *   有効な設定なら pool と選択済みセット配列を返す。無効なら null。
 */
function buildCharPool() {
  const shouldExclude = excludeSimilar.checked;
  const selectedSets = [];

  if (useLower.checked)  selectedSets.push(CHAR_SETS.lower);
  if (useUpper.checked)  selectedSets.push(CHAR_SETS.upper);
  if (useNumber.checked) selectedSets.push(CHAR_SETS.number);
  if (useSymbol.checked) selectedSets.push(CHAR_SETS.symbol);

  if (selectedSets.length === 0) return null;

  // 似た文字の除外が有効なら各セットからフィルタリング
  const filteredSets = shouldExclude
    ? selectedSets.map(set => [...set].filter(c => !SIMILAR_CHARS.has(c)).join(''))
    : selectedSets;

  // フィルタリング後にすべて空になってしまうケース（理論上まずないが保険）
  const nonEmpty = filteredSets.filter(s => s.length > 0);
  if (nonEmpty.length === 0) return null;

  const pool = nonEmpty.join('');
  return { pool, filteredSets: nonEmpty };
}

/**
 * Fisher-Yates シャッフル（配列をインプレースでシャッフル）
 * @param {string[]} arr
 * @returns {string[]}
 */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * パスワードを生成する
 * 各選択文字種から最低1文字を保証し、残りをランダムに補充してシャッフルする
 * @returns {string | null} 生成されたパスワード。文字種未選択なら null。
 */
function generatePassword() {
  const length = parseInt(lengthSlider.value, 10);
  const result = buildCharPool();

  if (!result) return null;

  const { pool, filteredSets } = result;
  const chars = [];

  // 各文字種から最低1文字を保証する
  for (const set of filteredSets) {
    chars.push(set[Math.floor(Math.random() * set.length)]);
  }

  // 残りの文字数をプール全体からランダムに補充
  const remaining = length - chars.length;
  for (let i = 0; i < remaining; i++) {
    chars.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  // シャッフルして自然なランダム文字列にする
  return shuffleArray(chars).join('');
}

// ===========================
// 強度判定処理
// ===========================

/**
 * パスワードの強度を簡易判定する
 * 判定基準:
 *   - 強い: 文字数16以上 かつ 文字種3種以上、または文字種4種すべて使用
 *   - 弱い: 文字数12未満 または 文字種1種のみ
 *   - 普通: それ以外
 * @param {string} password
 * @returns {'weak' | 'medium' | 'strong'}
 */
function evaluateStrength(password) {
  const length = password.length;

  // 選択中の文字種の数をカウント
  const typeCount = [useLower, useUpper, useNumber, useSymbol]
    .filter(cb => cb.checked).length;

  if (typeCount === 4 || (length >= 16 && typeCount >= 3)) {
    return 'strong';
  }
  if (length < 12 || typeCount === 1) {
    return 'weak';
  }
  return 'medium';
}

/**
 * 強度表示を更新する
 * @param {string} password
 */
function updateStrengthUI(password) {
  const level = evaluateStrength(password);

  const labels = {
    weak:   '弱い',
    medium: '普通',
    strong: '強い',
  };

  // バー・ラベルのクラスをリセットして再適用
  strengthFill.className  = `strength-fill ${level}`;
  strengthLabel.className = `strength-label ${level}`;
  strengthLabel.textContent = labels[level];
}

// ===========================
// コピー処理
// ===========================

/**
 * パスワードをクリップボードにコピーする
 */
async function copyPassword() {
  const password = passwordField.value;

  if (!password) {
    showMessage('パスワードがありません', true);
    return;
  }

  try {
    await navigator.clipboard.writeText(password);
    showMessage('コピーしました！');
  } catch {
    // Clipboard API が使えない環境へのフォールバック
    try {
      passwordField.select();
      document.execCommand('copy');
      showMessage('コピーしました！');
    } catch {
      showMessage('コピーに失敗しました', true);
    }
  }
}

// ===========================
// UI ユーティリティ
// ===========================

/**
 * フィードバックメッセージを表示し、一定時間後に消す
 * @param {string} text   表示するメッセージ
 * @param {boolean} isError  エラー表示にするか
 */
let messageTimer = null;
function showMessage(text, isError = false) {
  clearTimeout(messageTimer);
  messageEl.textContent = text;
  messageEl.className = isError ? 'message error' : 'message';

  messageTimer = setTimeout(() => {
    messageEl.textContent = '';
    messageEl.className = 'message';
  }, 2500);
}

/**
 * パスワード表示/非表示を切り替える
 */
function togglePasswordVisibility() {
  const isHidden = passwordField.type === 'password';
  passwordField.type = isHidden ? 'text' : 'password';
  iconEye.style.display    = isHidden ? 'none'  : '';
  iconEyeOff.style.display = isHidden ? ''      : 'none';
}

/**
 * 生成ボタンを押したときのメイン処理
 */
function handleGenerate() {
  const password = generatePassword();

  if (!password) {
    showMessage('文字種を1つ以上選択してください', true);
    // 強度表示をリセット
    strengthFill.className = 'strength-fill';
    strengthLabel.className = 'strength-label';
    strengthLabel.textContent = '-';
    return;
  }

  passwordField.value = password;
  updateStrengthUI(password);
  showMessage('');
}

// ===========================
// イベントリスナー登録
// ===========================

// 生成ボタン
generateBtn.addEventListener('click', handleGenerate);

// スライダー ↔ 数値表示の連動
lengthSlider.addEventListener('input', () => {
  lengthDisplay.textContent = lengthSlider.value;
});

// コピーボタン
copyBtn.addEventListener('click', copyPassword);

// 表示/非表示切り替え
toggleVisibilityBtn.addEventListener('click', togglePasswordVisibility);

// ===========================
// 初期化：ページ読み込み時に1つ生成
// ===========================
handleGenerate();
