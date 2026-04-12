/* ============================================================
   文字列反転ツール - メインスクリプト
   ============================================================ */

'use strict';

// ============================================================
// 1. 定数定義
// ============================================================

/**
 * 変換モード一覧
 * id        : 内部識別子
 * label     : 表示名
 * icon      : 絵文字アイコン
 * desc      : 短い説明（aria-label・tooltip 用）
 */
const MODES = [
  { id: 'charReverse',  label: '文字反転',      icon: '🔄', desc: '1文字ずつ逆順に並べ替えます' },
  { id: 'wordReverse',  label: '単語反転',       icon: '🔤', desc: '単語の並び順を逆にします' },
  { id: 'lineReverse',  label: '行反転',         icon: '📄', desc: '行の順番を逆にします' },
  { id: 'mirror',       label: 'ミラー文字',     icon: '🪞', desc: 'Unicode鏡文字に変換します' },
  { id: 'cipher',       label: '暗号風変換',     icon: '🔐', desc: 'シーザー暗号で英字をずらします' },
  { id: 'shuffle',      label: 'シャッフル',     icon: '🎲', desc: '文字をランダムに並び替えます' },
  { id: 'uppercase',    label: '大文字',         icon: '🔠', desc: '英字をすべて大文字にします' },
  { id: 'lowercase',    label: '小文字',         icon: '🔡', desc: '英字をすべて小文字にします' },
  { id: 'titleCase',    label: 'タイトルケース', icon: 'Aa', desc: '各単語の先頭を大文字にします' },
  { id: 'fullWidth',    label: '全角化',         icon: '全', desc: 'ASCII英数字を全角に変換します' },
  { id: 'halfWidth',    label: '半角化',         icon: '半', desc: '全角英数字を半角に変換します' },
  { id: 'removeSymbol', label: '記号除去',       icon: '✂️', desc: '記号・句読点を取り除きます' },
  { id: 'removeDigit',  label: '数字除去',       icon: '🔢', desc: '数字を取り除きます' },
  { id: 'removeAlpha',  label: '英字除去',       icon: '🔡', desc: '英字を取り除きます' },
  { id: 'removeSpace',  label: '空白除去',       icon: '⎵',  desc: 'スペース・タブを取り除きます' },
  { id: 'format',       label: '整形',           icon: '📐', desc: '空白・改行を整形します' },
  { id: 'sns',          label: 'SNS映え',        icon: '📱', desc: '装飾を付けてオシャレに変換します' },
];

/**
 * ミラー文字変換マップ
 * キー   : 変換前の文字
 * 値     : 変換後のUnicode文字（対応なしはそのまま出力）
 */
const MIRROR_MAP = {
  // 小文字アルファベット
  a:'ɐ', b:'q', c:'ɔ', d:'p', e:'ǝ',
  f:'ɟ', g:'ƃ', h:'ɥ', i:'ı', j:'ɾ',
  k:'ʞ', l:'l', m:'ɯ', n:'u', o:'o',
  p:'d', q:'b', r:'ɹ', s:'s', t:'ʇ',
  u:'n', v:'ʌ', w:'ʍ', x:'x', y:'ʎ', z:'z',
  // 大文字アルファベット
  A:'∀', B:'ꓭ', C:'Ɔ', D:'ꓷ', E:'Ǝ',
  F:'Ⅎ', G:'פ', H:'H', I:'I', J:'ꓤ',
  K:'ꓘ', L:'⅂', M:'W', N:'N', O:'O',
  P:'ꓒ', Q:'Ọ', R:'ꓤ', S:'S', T:'⊥',
  U:'∩', V:'Λ', W:'M', X:'X', Y:'⅄', Z:'Z',
  // 数字
  '0':'0', '1':'Ɩ', '2':'ᄅ', '3':'Ɛ', '4':'ㄣ',
  '5':'ϛ', '6':'9', '7':'ʄ', '8':'8', '9':'6',
  // 記号・括弧
  '!':'¡', '?':'¿', '.':'˙', ',': "'", "'":', ',
  '(':')', ')':'(', '[':']', ']':'[', '{':'}', '}':'{',
  '<':'>', '>':'<', '&':'⅋',
};

/**
 * SNS装飾パターン
 * キー : パターン識別子
 * 値   : テキストを受け取り装飾済み文字列を返す関数
 */
const SNS_DECORATIONS = {
  star:    (t) => `★ ${t} ★`,
  kakko:   (t) => `『${t}』`,
  fancy:   (t) => `꧁ ${t} ꧂`,
  bracket: (t) => `【${t}】`,
  sparkle: (t) => `✨ ${t} ✨`,
  diamond: (t) => `◆ ${t} ◆`,
  heart:   (t) => `♡ ${t} ♡`,
  wave:    (t) => `〜 ${t} 〜`,
};
const SNS_DECORATION_KEYS = Object.keys(SNS_DECORATIONS);

/** localStorage に使うキー */
const STORAGE_KEY_HISTORY   = 'stringReverseTool_history_v1';
const STORAGE_KEY_DARK_MODE = 'stringReverseTool_darkMode';

/** 履歴の最大保存件数 */
const HISTORY_MAX = 20;

// ============================================================
// 2. 状態管理
// ============================================================

let currentMode = 'charReverse'; // 現在選択されている変換モード
let isDarkMode  = false;          // ダークモードのフラグ

// ============================================================
// 3. DOM 要素の参照
// ============================================================

const $inputText         = document.getElementById('inputText');
const $outputArea        = document.getElementById('outputArea');
const $modeGrid          = document.getElementById('modeGrid');
const $cipherOptions     = document.getElementById('cipherOptions');
const $cipherShift       = document.getElementById('cipherShift');
const $cipherShiftDisplay = document.getElementById('cipherShiftDisplay');
const $snsOptions        = document.getElementById('snsOptions');
const $snsDecoration     = document.getElementById('snsDecoration');
const $copyBtn           = document.getElementById('copyBtn');
const $inputClearBtn     = document.getElementById('inputClearBtn');
const $saveHistoryBtn    = document.getElementById('saveHistoryBtn');
const $reshuffleBtn      = document.getElementById('reshuffleBtn');
const $clearHistoryBtn   = document.getElementById('clearHistoryBtn');
const $darkModeBtn       = document.getElementById('darkModeBtn');
const $historyList       = document.getElementById('historyList');
const $palindromeCheck   = document.getElementById('palindromeCheck');
const $toast             = document.getElementById('toast');
const $inputCharCount    = document.getElementById('inputCharCount');
const $inputWordCount    = document.getElementById('inputWordCount');
const $inputLineCount    = document.getElementById('inputLineCount');
const $outputCharCount   = document.getElementById('outputCharCount');
const $outputWordCount   = document.getElementById('outputWordCount');
const $outputLineCount   = document.getElementById('outputLineCount');

// ============================================================
// 4. 文字列変換ユーティリティ
// ============================================================

/**
 * 文字列を Unicode コードポイント単位の配列に変換する。
 * Array.from() は絵文字・サロゲートペアを1文字として扱うため安全。
 *
 * @param {string} str
 * @returns {string[]}
 */
function toChars(str) {
  return Array.from(str);
}

// ============================================================
// 5. 変換関数（各モード）
// ============================================================

/**
 * [1] 文字単位で逆順
 * 絵文字・サロゲートペアに対応するため Array.from を使用。
 */
function transformCharReverse(str) {
  return toChars(str).reverse().join('');
}

/**
 * [2] 単語単位で逆順
 * 各行に対して、空白区切りの単語順を逆にする。
 * 単語内の文字順はそのまま維持する。
 */
function transformWordReverse(str) {
  return str
    .split('\n')
    .map(line => line.split(/\s+/).filter(Boolean).reverse().join(' '))
    .join('\n');
}

/**
 * [3] 行単位で逆順
 * 複数行の入力の行順を逆にする。
 */
function transformLineReverse(str) {
  return str.split('\n').reverse().join('\n');
}

/**
 * [4] ミラー文字変換
 * MIRROR_MAP に従って各文字を変換する。対応なし文字はそのまま出力。
 */
function transformMirror(str) {
  return toChars(str).map(ch => MIRROR_MAP[ch] ?? ch).join('');
}

/**
 * [5] 暗号風変換（シーザー暗号）
 * 英字のみ指定シフト数だけ文字コードをずらす。
 * 大文字・小文字をそれぞれ保持。
 * マイナスシフトにすると逆方向にずれるため、暗号化した文字を復号できる。
 *   例: shift +1 → hello → ifmmp  /  shift -1 → ifmmp → hello
 *
 * @param {string} str   入力文字列
 * @param {number} shift シフト数（-5〜+5）負の値で逆方向（復号）
 */
function transformCipher(str, shift) {
  // ((n % 26) + 26) % 26 で負の剰余を正しく扱う
  const normalized = ((shift % 26) + 26) % 26;
  return str.split('').map(ch => {
    if (ch >= 'a' && ch <= 'z') {
      return String.fromCharCode(((ch.charCodeAt(0) - 97 + normalized) % 26) + 97);
    }
    if (ch >= 'A' && ch <= 'Z') {
      return String.fromCharCode(((ch.charCodeAt(0) - 65 + normalized) % 26) + 65);
    }
    return ch;
  }).join('');
}

/**
 * [6] ランダムシャッフル（Fisher-Yates アルゴリズム）
 * 文字をランダムに並び替える。
 */
function transformShuffle(str) {
  const chars = toChars(str);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

/** [7] 全大文字 */
function transformUppercase(str) {
  return str.toUpperCase();
}

/** [8] 全小文字 */
function transformLowercase(str) {
  return str.toLowerCase();
}

/**
 * [9] タイトルケース
 * 行頭・空白の直後に来る文字を大文字にする。
 */
function transformTitleCase(str) {
  return str.toLowerCase().replace(/(^|\s)(\S)/g, (_, pre, ch) => pre + ch.toUpperCase());
}

/**
 * [10] 全角化（ASCII 英数字・記号 → 全角）
 * U+0021〜U+007E の範囲を U+FF01〜U+FF5E にシフトする。
 * 半角スペース U+0020 → 全角スペース U+3000。
 */
function transformFullWidth(str) {
  return str
    .replace(/[!-~]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0xFEE0))
    .replace(/ /g, '\u3000');
}

/**
 * [11] 半角化（全角英数字・記号 → 半角）
 * U+FF01〜U+FF5E → U+0021〜U+007E にシフトする。
 * 全角スペース U+3000 → 半角スペース U+0020。
 */
function transformHalfWidth(str) {
  return str
    .replace(/[\uFF01-\uFF5E]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
    .replace(/\u3000/g, ' ');
}

/**
 * [12] 記号除去
 * Unicode 字母クラス（\p{L}）と数字クラス（\p{N}）と空白以外を除去する。
 * 日本語・英数字・空白・改行は保持する。
 */
function transformRemoveSymbol(str) {
  return str.replace(/[^\p{L}\p{N}\s]/gu, '');
}

/**
 * [13] 数字除去
 * Unicode 数字クラス（\p{N}）を除去する。
 * 全角数字も含む。
 */
function transformRemoveDigit(str) {
  return str.replace(/\p{N}/gu, '');
}

/**
 * [14] 英字除去
 * Unicode 字母クラス（\p{L}）を除去する。
 * 日本語・漢字等も対象になるため、必要に応じてラテン文字のみに絞ることも可能だが、
 * ここでは仕様通りすべての Unicode 字母を除去する。
 */
function transformRemoveAlpha(str) {
  return str.replace(/\p{L}/gu, '');
}

/**
 * [15] 空白除去
 * スペース・タブを除去する。改行は保持する。
 */
function transformRemoveSpace(str) {
  return str.replace(/[^\S\n]/g, '');
}

/**
 * [16] 整形モード
 * - 改行コード (CRLF / CR) を LF に統一
 * - 連続スペース・タブを1つのスペースに圧縮
 * - 行頭・行末の空白除去
 * - 3行以上連続する空行を2行（1空行）に統一
 */
function transformFormat(str) {
  return str
    .replace(/\r\n/g, '\n')        // CRLF → LF
    .replace(/\r/g, '\n')          // CR → LF
    .replace(/[^\S\n]+/g, ' ')     // 連続スペース・タブを1つに圧縮
    .split('\n')
    .map(line => line.trim())      // 行頭・行末の空白除去
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');   // 3行以上の空行を2行に統一
}

/**
 * [17] SNS映えモード
 * 入力テキストに装飾パターンを適用する。
 *
 * @param {string} str           入力文字列
 * @param {string} decorationType 装飾パターン識別子（'random' の場合はランダム選択）
 */
function transformSNS(str, decorationType) {
  const text = str.trim() || str;
  if (decorationType === 'random') {
    const key = SNS_DECORATION_KEYS[Math.floor(Math.random() * SNS_DECORATION_KEYS.length)];
    return SNS_DECORATIONS[key](text);
  }
  const fn = SNS_DECORATIONS[decorationType];
  return fn ? fn(text) : text;
}

/**
 * メイン変換ディスパッチャー
 * 現在のモードに応じて対応する変換関数を呼び出す。
 *
 * @param {string} str  入力文字列
 * @param {string} mode モード識別子
 * @returns {string}    変換後の文字列
 */
function transform(str, mode) {
  if (!str) return '';

  const shift   = parseInt($cipherShift.value, 10);
  const decoType = $snsDecoration.value;

  switch (mode) {
    case 'charReverse':  return transformCharReverse(str);
    case 'wordReverse':  return transformWordReverse(str);
    case 'lineReverse':  return transformLineReverse(str);
    case 'mirror':       return transformMirror(str);
    case 'cipher':       return transformCipher(str, shift);
    case 'shuffle':      return transformShuffle(str);
    case 'uppercase':    return transformUppercase(str);
    case 'lowercase':    return transformLowercase(str);
    case 'titleCase':    return transformTitleCase(str);
    case 'fullWidth':    return transformFullWidth(str);
    case 'halfWidth':    return transformHalfWidth(str);
    case 'removeSymbol': return transformRemoveSymbol(str);
    case 'removeDigit':  return transformRemoveDigit(str);
    case 'removeAlpha':  return transformRemoveAlpha(str);
    case 'removeSpace':  return transformRemoveSpace(str);
    case 'format':       return transformFormat(str);
    case 'sns':          return transformSNS(str, decoType);
    default:             return str;
  }
}

// ============================================================
// 6. 統計計算
// ============================================================

/**
 * 文字数・単語数・行数を計算して返す。
 * chars は絵文字対応のため Array.from を使用。
 *
 * @param {string} str
 * @returns {{ chars: number, words: number, lines: number }}
 */
function calcStats(str) {
  const chars = toChars(str).length;
  const words = str.trim() === '' ? 0 : str.trim().split(/\s+/).length;
  const lines = str === '' ? 0 : str.split('\n').length;
  return { chars, words, lines };
}

// ============================================================
// 7. 回文チェック
// ============================================================

/**
 * 回文チェック
 *
 * - isStrict  : 入力をそのまま比較（大文字小文字・空白も区別）
 * - isRelaxed : 小文字化・空白除去・句読点除去後に比較
 *
 * @param {string} str
 * @returns {{ isStrict: boolean, isRelaxed: boolean } | null}
 */
function checkPalindrome(str) {
  if (!str || str.trim() === '') return null;

  // 厳密チェック
  const chars       = toChars(str);
  const reversed    = [...chars].reverse().join('');
  const isStrict    = str === reversed;

  // 緩めチェック（小文字 + 空白・記号除去）
  const normalized  = str.toLowerCase().replace(/[\s\p{P}]/gu, '');
  const normChars   = toChars(normalized);
  const normRevd    = [...normChars].reverse().join('');
  const isRelaxed   = normalized.length > 0 && normalized === normRevd;

  return { isStrict, isRelaxed };
}

// ============================================================
// 8. UI 更新関数
// ============================================================

/**
 * 出力エリア・統計・回文チェックを一括更新する。
 * 入力変更・モード変更のたびに呼び出す。
 */
function updateOutput() {
  const input  = $inputText.value;
  const result = transform(input, currentMode);

  // ---- 出力テキストの更新 ----
  $outputArea.textContent = result;
  $outputArea.dataset.empty = result === '' ? 'true' : 'false';

  // 更新アニメーション（クラスを付け直すことで再生させる）
  $outputArea.classList.remove('updated');
  void $outputArea.offsetWidth; // リフロー強制
  $outputArea.classList.add('updated');

  // ---- 入力統計の更新 ----
  const inStats = calcStats(input);
  $inputCharCount.textContent = inStats.chars;
  $inputWordCount.textContent = inStats.words;
  $inputLineCount.textContent = inStats.lines;

  // ---- 出力統計の更新 ----
  const outStats = calcStats(result);
  $outputCharCount.textContent = outStats.chars;
  $outputWordCount.textContent = outStats.words;
  $outputLineCount.textContent = outStats.lines;

  // ---- 回文チェックの更新 ----
  updatePalindromeDisplay(input);

}

/**
 * 回文チェック結果を表示する。
 *
 * @param {string} str 入力文字列
 */
function updatePalindromeDisplay(str) {
  const result = checkPalindrome(str);

  if (!result) {
    $palindromeCheck.hidden = true;
    return;
  }

  $palindromeCheck.hidden = false;

  if (result.isStrict) {
    $palindromeCheck.className = 'palindrome-check is-palindrome';
    $palindromeCheck.textContent = '🎉 回文です！（完全一致）';
  } else if (result.isRelaxed) {
    $palindromeCheck.className = 'palindrome-check is-palindrome';
    $palindromeCheck.textContent = '✅ 回文です（大文字小文字・空白・記号を無視した場合）';
  } else {
    $palindromeCheck.className = 'palindrome-check not-palindrome';
    $palindromeCheck.textContent = '🔍 回文ではありません';
  }
}

/**
 * モードボタンのアクティブ状態を更新する。
 * aria-pressed も合わせて更新してアクセシビリティを確保。
 */
function updateModeButtons() {
  document.querySelectorAll('.mode-btn').forEach(btn => {
    const isActive = btn.dataset.mode === currentMode;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

/**
 * モード依存の追加オプション UI を表示・非表示にする。
 * また、シャッフルモード専用の「再シャッフル」ボタンも制御する。
 */
function updateExtraOptions() {
  $cipherOptions.hidden = currentMode !== 'cipher';
  $snsOptions.hidden    = currentMode !== 'sns';
  $reshuffleBtn.hidden  = currentMode !== 'shuffle';
}

// ============================================================
// 9. モード変更
// ============================================================

/**
 * 変換モードを切り替え、UI を更新する。
 *
 * @param {string} modeId 変換モードの識別子
 */
function setMode(modeId) {
  if (!MODES.find(m => m.id === modeId)) return; // 不正な ID は無視
  currentMode = modeId;
  updateModeButtons();
  updateExtraOptions();
  updateOutput();
}

// ============================================================
// 10. 履歴管理（localStorage）
// ============================================================

/**
 * localStorage から履歴を読み込む。
 * パースエラー時は空配列を返して安全に処理する。
 *
 * @returns {Array<object>}
 */
function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('[履歴] 読み込みに失敗しました:', e);
    return [];
  }
}

/**
 * 履歴を localStorage に保存する。
 *
 * @param {Array<object>} items
 */
function saveHistoryToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(items));
  } catch (e) {
    console.warn('[履歴] 保存に失敗しました:', e);
  }
}

/**
 * 履歴に1件追加する。
 * - 入力・出力が空の場合は追加しない
 * - 直前と同じ内容（入力・モード・出力が一致）は重複保存しない
 * - HISTORY_MAX 件を超えた分は末尾から削除する
 *
 * @param {string} input  入力テキスト
 * @param {string} mode   モード識別子
 * @param {string} output 変換結果テキスト
 */
function addHistoryItem(input, mode, output) {
  if (!input.trim() || !output.trim()) return;

  const history  = loadHistory();
  const modeName = MODES.find(m => m.id === mode)?.label ?? mode;

  // 直前と同じ内容は保存しない
  if (history.length > 0) {
    const last = history[0];
    if (last.input === input && last.mode === mode && last.output === output) return;
  }

  const item = {
    id:       Date.now(),
    input,
    mode,
    modeName,
    output,
    time:     new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
  };

  history.unshift(item);
  if (history.length > HISTORY_MAX) history.splice(HISTORY_MAX);

  saveHistoryToStorage(history);
  renderHistory();
}

/**
 * 履歴リストを DOM に描画する。
 * 履歴アイテムクリックで入力を復元できるようにする。
 */
function renderHistory() {
  const history = loadHistory();

  if (history.length === 0) {
    $historyList.innerHTML = '<p class="empty-message">📭 まだ履歴はありません</p>';
    return;
  }

  $historyList.innerHTML = history.map(item => `
    <div
      class="history-item"
      data-id="${item.id}"
      role="button"
      tabindex="0"
      aria-label="履歴: ${escapeHtml(item.input)} → ${escapeHtml(item.output)}（タップで復元）"
    >
      <div class="history-meta">
        <span class="history-mode-badge">${escapeHtml(item.modeName)}</span>
        <span class="history-time">${escapeHtml(item.time)}</span>
      </div>
      <div class="history-row">
        <span class="history-input">${escapeHtml(truncateStr(item.input, 30))}</span>
        <span class="history-arrow">→</span>
        <span class="history-output">${escapeHtml(truncateStr(item.output, 30))}</span>
      </div>
    </div>
  `).join('');

  // 各アイテムにクリック・キーボード操作を追加
  $historyList.querySelectorAll('.history-item').forEach(el => {
    const handler = () => restoreFromHistory(el.dataset.id);
    el.addEventListener('click', handler);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  });
}

/**
 * 履歴から入力を復元する。
 * 対応するモードも切り替え、入力欄にスクロールする。
 *
 * @param {string} id 履歴アイテムの id（Date.now() ベースの数値文字列）
 */
function restoreFromHistory(id) {
  const history = loadHistory();
  const item    = history.find(h => String(h.id) === String(id));
  if (!item) return;

  $inputText.value = item.input;
  setMode(item.mode);

  // 入力欄まで滑らかにスクロール
  $inputText.scrollIntoView({ behavior: 'smooth', block: 'center' });
  showToast('📚 履歴から復元しました');
}

// ============================================================
// 11. ユーティリティ関数
// ============================================================

/**
 * HTML エスケープ
 * innerHTML に差し込む文字列には必ず通す。
 *
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 文字列を指定コードポイント数で切り詰める。
 * 改行はスペースに置換して表示する。
 *
 * @param {string} str
 * @param {number} max
 * @returns {string}
 */
function truncateStr(str, max) {
  const chars = toChars(str.replace(/\n/g, ' '));
  if (chars.length <= max) return chars.join('');
  return chars.slice(0, max).join('') + '…';
}

/**
 * トースト通知を表示する。
 * 一定時間後に自動的に非表示にする。
 *
 * @param {string} message 表示するメッセージ
 * @param {number} duration 表示時間（ms） デフォルト: 2500
 */
let toastTimer = null;

function showToast(message, duration = 2500) {
  $toast.textContent = message;
  $toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $toast.classList.remove('show'), duration);
}

// ============================================================
// 12. モードボタンの生成
// ============================================================

/**
 * MODES 配列からモード選択ボタンを動的に生成し、modeGrid に追加する。
 */
function initModeButtons() {
  $modeGrid.innerHTML = MODES.map(mode => `
    <button
      class="mode-btn${mode.id === currentMode ? ' active' : ''}"
      data-mode="${mode.id}"
      aria-pressed="${mode.id === currentMode ? 'true' : 'false'}"
      title="${mode.desc}"
      aria-label="${mode.label}：${mode.desc}"
    >
      <span class="mode-icon" aria-hidden="true">${mode.icon}</span>
      <span>${mode.label}</span>
    </button>
  `).join('');

  // クリックイベントを各ボタンに登録
  $modeGrid.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => setMode(btn.dataset.mode));
  });
}

// ============================================================
// 13. イベントリスナーの登録
// ============================================================

/** テキスト入力 → リアルタイム変換 */
$inputText.addEventListener('input', updateOutput);

/** コピーボタン */
$copyBtn.addEventListener('click', async () => {
  const text = $outputArea.textContent;

  // 出力が空なら何もしない
  if (!text || $outputArea.dataset.empty === 'true') {
    showToast('⚠️ コピーする内容がありません');
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast('✅ コピーしました！');

    // ボタンのラベルを一時的に変更
    $copyBtn.textContent = '✅ コピー済み';
    setTimeout(() => { $copyBtn.textContent = '📋 コピー'; }, 2000);
  } catch {
    // Clipboard API 非対応環境へのフォールバック
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity  = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('✅ コピーしました！');
    } catch {
      showToast('❌ コピーに失敗しました');
    }
  }
});

/** 入力エリアのクリアボタン（入力欄の統計バー右端） */
$inputClearBtn.addEventListener('click', () => {
  $inputText.value = '';
  updateOutput();
  $inputText.focus();
});

/** 履歴保存ボタン */
$saveHistoryBtn.addEventListener('click', () => {
  const input  = $inputText.value;
  const output = $outputArea.textContent;

  if (!input.trim()) {
    showToast('⚠️ 入力テキストが空です');
    return;
  }
  if ($outputArea.dataset.empty === 'true') {
    showToast('⚠️ 変換結果がありません');
    return;
  }

  addHistoryItem(input, currentMode, output);
  showToast('💾 履歴に保存しました');
});

/** 再シャッフルボタン（シャッフルモード専用） */
$reshuffleBtn.addEventListener('click', () => {
  updateOutput(); // 毎回 Math.random() が走るので再呼び出しだけで OK
  showToast('🎲 シャッフルしました！');
});

/** 履歴全削除ボタン */
$clearHistoryBtn.addEventListener('click', () => {
  if (!confirm('履歴をすべて削除しますか？')) return;
  localStorage.removeItem(STORAGE_KEY_HISTORY);
  renderHistory();
  showToast('🗑️ 履歴を全削除しました');
});

/** ダークモードトグル */
$darkModeBtn.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  $darkModeBtn.textContent = isDarkMode ? '☀️' : '🌙';
  $darkModeBtn.setAttribute('aria-label', isDarkMode ? 'ライトモードに切替' : 'ダークモードに切替');
  localStorage.setItem(STORAGE_KEY_DARK_MODE, isDarkMode ? '1' : '0');
});

/** サンプルボタン群 */
document.querySelectorAll('.sample-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $inputText.value = btn.dataset.sample;
    updateOutput();
    $inputText.focus();
  });
});

/** シーザー暗号シフト数スライダー */
$cipherShift.addEventListener('input', () => {
  const val = parseInt($cipherShift.value, 10);
  // 正の値は「+」を付けて表示。0 や負の値はそのまま
  $cipherShiftDisplay.textContent = val > 0 ? `+${val}` : String(val);
  updateOutput();
});

/** SNS装飾パターン選択 */
$snsDecoration.addEventListener('change', updateOutput);

// ============================================================
// 14. 初期化
// ============================================================

/**
 * ダークモードの初期状態を設定する。
 * localStorage の保存値を優先し、なければシステム設定に従う。
 */
function initDarkMode() {
  const saved = localStorage.getItem(STORAGE_KEY_DARK_MODE);
  if (saved === '1') {
    isDarkMode = true;
  } else if (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDarkMode = true;
  }

  if (isDarkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
    $darkModeBtn.textContent = '☀️';
    $darkModeBtn.setAttribute('aria-label', 'ライトモードに切替');
  }
}

/**
 * アプリ全体の初期化処理。
 * DOMContentLoaded 後に実行する。
 */
function init() {
  initDarkMode();    // テーマを先に適用
  initModeButtons(); // モードボタンを生成
  renderHistory();   // localStorage から履歴を復元して表示
  updateOutput();    // 初期状態の出力エリアを整える
}

// DOM の準備が完了したら初期化を実行
document.addEventListener('DOMContentLoaded', init);
