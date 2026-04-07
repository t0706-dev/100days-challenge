// =============================================
// 割り勘計算機 - script.js
// =============================================

'use strict';

// =====================
// 定数
// =====================
const HISTORY_KEY = 'warikan_history';  // localStorage のキー
const MAX_HISTORY = 10;                 // 保存する最大履歴件数

// 最後の計算結果（履歴保存用）
let lastResult = null;
let lastData   = null;

// =====================
// 初期化
// =====================
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  renderHistory();
});

// =====================
// イベントリスナーの登録
// =====================
function initEventListeners() {
  document.getElementById('btnCalc').addEventListener('click', handleCalculate);
  document.getElementById('btnReset').addEventListener('click', handleReset);
  document.getElementById('btnCopy').addEventListener('click', handleCopy);
  document.getElementById('btnSaveHistory').addEventListener('click', handleSaveHistory);
  document.getElementById('btnClearHistory').addEventListener('click', handleClearHistory);

  // 幹事支払方法 → 調整額フィールドの表示切り替え
  document.getElementById('hostMode').addEventListener('change', () => {
    const mode = document.getElementById('hostMode').value;
    document.getElementById('hostAdjGroup').style.display =
      (mode === 'less' || mode === 'more') ? '' : 'none';
  });

  // 男女別設定チェックボックス → フィールド表示切り替え
  document.getElementById('useMaleFemale').addEventListener('change', () => {
    const checked = document.getElementById('useMaleFemale').checked;
    document.getElementById('genderFields').style.display = checked ? '' : 'none';
  });
}

// =====================
// フォームデータ取得
// =====================
function getFormData() {
  return {
    total:               parseFloat(document.getElementById('total').value)              || 0,
    count:               parseInt(document.getElementById('count').value, 10)            || 0,
    rounding:            document.getElementById('rounding').value,
    hostCount:           parseInt(document.getElementById('hostCount').value, 10)        || 0,
    hostMode:            document.getElementById('hostMode').value,
    hostAdj:             parseFloat(document.getElementById('hostAdj').value)            || 0,
    nonDrinkerCount:     parseInt(document.getElementById('nonDrinkerCount').value, 10)  || 0,
    nonDrinkerReduction: parseFloat(document.getElementById('nonDrinkerReduction').value)|| 0,
    useMaleFemale:       document.getElementById('useMaleFemale').checked,
    maleCount:           parseInt(document.getElementById('maleCount').value, 10)        || 0,
    femaleCount:         parseInt(document.getElementById('femaleCount').value, 10)      || 0,
    femaleDiscount:      parseFloat(document.getElementById('femaleDiscount').value)     || 0,
  };
}

// =====================
// 入力バリデーション
// =====================
function validateInput(d) {
  const errors = [];

  // 合計金額チェック
  if (!d.total || d.total <= 0) {
    errors.push('合計金額を1円以上で入力してください');
  }
  // 参加人数チェック
  if (!d.count || d.count < 1) {
    errors.push('参加人数を1人以上で入力してください');
  }
  // 幹事人数チェック
  if (d.hostCount < 0) {
    errors.push('幹事人数は0以上を入力してください');
  }
  if (d.count >= 1 && d.hostCount >= d.count) {
    errors.push('幹事人数は参加人数より少なくしてください（全員が幹事にはなれません）');
  }
  // 飲まない人チェック
  if (d.nonDrinkerCount < 0) {
    errors.push('飲まない人の人数は0以上を入力してください');
  }
  if (d.count >= 1 && d.nonDrinkerCount >= d.count) {
    errors.push('飲まない人の人数は参加人数より少なくしてください');
  }
  // 幹事 + 飲まない人の合計チェック
  if (d.count >= 1 && d.hostCount + d.nonDrinkerCount > d.count) {
    errors.push('幹事人数＋飲まない人数が参加人数を超えています');
  }
  // 男女別設定チェック
  if (d.useMaleFemale) {
    if (d.maleCount + d.femaleCount !== d.count) {
      errors.push(`男性人数(${d.maleCount}人)＋女性人数(${d.femaleCount}人)が参加人数(${d.count}人)と一致しません`);
    }
    // 幹事・飲まない人は男性に含まれると想定するため、男性人数が足りるか確認
    if (d.maleCount < d.hostCount + d.nonDrinkerCount) {
      errors.push('男性人数が「幹事人数＋飲まない人数」を下回っています（幹事・飲まない人は男性に含まれる想定）');
    }
  }

  return errors;
}

// =====================
// 端数処理
// =====================
function applyRounding(amount, mode) {
  switch (mode) {
    case 'ceil1':   return Math.ceil(amount);
    case 'ceil10':  return Math.ceil(amount / 10) * 10;
    case 'ceil100': return Math.ceil(amount / 100) * 100;
    default:        return amount; // 'none': そのまま
  }
}

// =====================
// 割り勘計算メイン
// =====================
function calculateSplit(d) {
  const {
    total, count, rounding,
    hostCount, hostMode, hostAdj,
    nonDrinkerCount, nonDrinkerReduction,
    useMaleFemale, maleCount, femaleCount, femaleDiscount
  } = d;

  // ---- ベース価格（標準男性参加者）の算出 ----
  //
  // 【考え方】全員の支払いの合計 = total という方程式を解く。
  //
  //   total = effCount × base
  //         - nonDrinkerCount × nonDrinkerReduction   (飲まない人の割引分)
  //         ± hostCount × hostAdj                     (幹事の増減分)
  //         - femaleCount × femaleDiscount             (女性の割引分)
  //
  //   ∴ base = (total + 調整額合計) / effCount
  //
  // effCount：実際にお金を出す人数（幹事0円モードなら除外）
  const effCount = (hostMode === 'zero') ? count - hostCount : count;

  let numerator = total + nonDrinkerCount * nonDrinkerReduction;

  if (hostMode === 'less')      numerator += hostCount * hostAdj;
  else if (hostMode === 'more') numerator -= hostCount * hostAdj;

  if (useMaleFemale)            numerator += femaleCount * femaleDiscount;

  // base = 端数処理前の正確な金額
  const baseExact = numerator / effCount;

  // 端数処理を適用
  const base = applyRounding(baseExact, rounding);

  // ---- 各グループの金額を決定 ----

  // 標準参加者（男性）の金額
  const standardPrice = base;

  // 女性参加者の金額（男女別設定時のみ）
  const femalePrice = useMaleFemale
    ? applyRounding(base - femaleDiscount, rounding)
    : null;

  // 飲まない人の金額
  const nonDrinkerPrice = (nonDrinkerCount > 0)
    ? applyRounding(base - nonDrinkerReduction, rounding)
    : null;

  // 幹事の金額
  let hostPrice = null;
  if (hostCount > 0) {
    switch (hostMode) {
      case 'zero':   hostPrice = 0; break;
      case 'less':   hostPrice = applyRounding(base - hostAdj, rounding); break;
      case 'more':   hostPrice = applyRounding(base + hostAdj, rounding); break;
      default:       hostPrice = base; break; // 'normal'
    }
  }

  // ---- マイナス価格チェック ----
  if (standardPrice < 0)
    throw new Error('一般参加者の支払額がマイナスになります。設定を見直してください。');
  if (femalePrice !== null && femalePrice < 0)
    throw new Error('女性参加者の支払額がマイナスになります。割引額を小さくしてください。');
  if (nonDrinkerPrice !== null && nonDrinkerPrice < 0)
    throw new Error('飲まない人の支払額がマイナスになります。減額を小さくしてください。');
  if (hostPrice !== null && hostPrice < 0)
    throw new Error('幹事の支払額がマイナスになります。調整額を小さくしてください。');

  // ---- 集める総額を計算 ----
  // 男女別設定時：幹事・飲まない人は男性側と想定して計算
  let totalCollected = 0;

  if (useMaleFemale) {
    // 男性一般参加者（幹事・飲まない人を除く）
    const stdMaleCount   = maleCount - hostCount - nonDrinkerCount;
    const stdFemaleCount = femaleCount;

    totalCollected =
      stdMaleCount   * standardPrice +
      stdFemaleCount * femalePrice +
      hostCount      * (hostPrice ?? standardPrice) +
      nonDrinkerCount * (nonDrinkerPrice ?? standardPrice);
  } else {
    // 一般参加者（幹事・飲まない人を除く）
    const regularCount = count - hostCount - nonDrinkerCount;

    totalCollected =
      regularCount    * standardPrice +
      hostCount       * (hostPrice ?? standardPrice) +
      nonDrinkerCount * (nonDrinkerPrice ?? standardPrice);
  }

  // 差額（端数処理により発生するズレ）
  const diff = Math.round((totalCollected - total) * 100) / 100;

  return {
    standardPrice,
    femalePrice,
    nonDrinkerPrice,
    hostPrice,
    totalCollected,
    diff,
  };
}

// =====================
// 結果を画面に描画
// =====================
function renderResult(result, d) {
  const { standardPrice, femalePrice, nonDrinkerPrice, hostPrice, totalCollected, diff } = result;

  let html = '<div class="result-grid">';

  // --- 参加者ごとの金額 ---
  if (d.useMaleFemale) {
    html += makeResultItem('男性 1人あたり', formatYen(standardPrice), true);
    html += makeResultItem('女性 1人あたり', formatYen(femalePrice), true);
  } else {
    html += makeResultItem('1人あたり', formatYen(standardPrice), true);
  }

  // 飲まない人（設定あり）
  if (nonDrinkerPrice !== null) {
    html += makeResultItem(`飲まない人（${d.nonDrinkerCount}人）`, formatYen(nonDrinkerPrice));
  }

  // 幹事（通常以外の設定）
  if (hostPrice !== null && d.hostMode !== 'normal') {
    const lbl =
      d.hostMode === 'zero' ? `幹事（${d.hostCount}人）` :
      d.hostMode === 'less' ? `幹事・少なめ（${d.hostCount}人）` :
                              `幹事・多め（${d.hostCount}人）`;
    html += makeResultItem(lbl, formatYen(hostPrice));
  }

  // 集める総額
  html += makeResultItem('集める総額', formatYen(totalCollected));

  // 差額
  const diffClass = diff > 0 ? 'diff-over' : diff < 0 ? 'diff-under' : '';
  const diffSign  = diff > 0 ? '+' : '';
  html += `
    <div class="result-item ${diffClass}">
      <div class="result-label">差額（端数）</div>
      <div class="result-value">${diffSign}${formatYen(diff)}</div>
    </div>
  `;

  html += '</div>';

  // 補足メモ
  html += `<p class="result-note">元の合計: ${formatYen(d.total)} ／ 参加人数: ${d.count}人</p>`;

  if (diff > 0) {
    html += `<p class="result-note">💡 ${formatYen(diff)} 多く集まります。返金または次回に活用してください。</p>`;
  } else if (diff < 0) {
    html += `<p class="result-note">⚠️ ${formatYen(Math.abs(diff))} 不足します。誰かが補填するか端数処理を変えてください。</p>`;
  } else {
    html += `<p class="result-note">✅ ぴったりです！</p>`;
  }

  document.getElementById('resultContent').innerHTML = html;
  document.getElementById('result-section').style.display = '';

  // コピー用テキスト生成・表示
  document.getElementById('copyText').value = generateCopyText(result, d);
  document.getElementById('copy-section').style.display = '';

  // 次の履歴保存のために一時保存
  lastResult = result;
  lastData   = d;
}

/**
 * 結果セルのHTMLを生成
 * @param {string} label ラベル
 * @param {string} value 表示する値
 * @param {boolean} highlight ハイライト表示するか
 */
function makeResultItem(label, value, highlight = false) {
  return `
    <div class="result-item ${highlight ? 'highlight' : ''}">
      <div class="result-label">${label}</div>
      <div class="result-value">${value}</div>
    </div>
  `;
}

// =====================
// エラー表示・クリア
// =====================
function showErrors(errors) {
  const area = document.getElementById('errorArea');
  if (!errors || errors.length === 0) {
    area.style.display = 'none';
    return;
  }
  area.innerHTML = '<ul>' + errors.map(e => `<li>${e}</li>`).join('') + '</ul>';
  area.style.display = '';
}

function clearErrors() {
  const area = document.getElementById('errorArea');
  area.style.display = 'none';
  area.innerHTML = '';
}

// =====================
// コピー用テキスト生成
// =====================
function generateCopyText(result, d) {
  const { standardPrice, femalePrice, nonDrinkerPrice, hostPrice, totalCollected, diff } = result;
  const lines = [];

  lines.push(`合計${formatYen(d.total)}、${d.count}人で割り勘します。`);

  if (d.useMaleFemale) {
    lines.push(`男性: ${formatYen(standardPrice)}、女性: ${formatYen(femalePrice)}`);
  } else {
    lines.push(`1人あたり: ${formatYen(standardPrice)}`);
  }

  if (nonDrinkerPrice !== null) {
    lines.push(`飲まない人（${d.nonDrinkerCount}人）: ${formatYen(nonDrinkerPrice)}`);
  }

  if (hostPrice !== null && d.hostMode !== 'normal') {
    lines.push(`幹事（${d.hostCount}人）: ${formatYen(hostPrice)}`);
  }

  lines.push(`集める総額: ${formatYen(totalCollected)}`);

  if (diff !== 0) {
    const sign = diff > 0 ? '+' : '';
    lines.push(`差額: ${sign}${formatYen(diff)}`);
  }

  return lines.join('\n');
}

// =====================
// ボタンハンドラ：計算
// =====================
function handleCalculate() {
  clearErrors();

  const d = getFormData();
  const errors = validateInput(d);

  if (errors.length > 0) {
    showErrors(errors);
    return;
  }

  try {
    const result = calculateSplit(d);
    renderResult(result, d);
  } catch (e) {
    showErrors([e.message]);
  }
}

// =====================
// ボタンハンドラ：リセット
// =====================
function handleReset() {
  // 入力値を初期状態に戻す
  document.getElementById('total').value              = '';
  document.getElementById('count').value             = '2';
  document.getElementById('rounding').value          = 'ceil10';
  document.getElementById('hostCount').value         = '0';
  document.getElementById('hostMode').value          = 'normal';
  document.getElementById('hostAdj').value           = '500';
  document.getElementById('hostAdjGroup').style.display = 'none';
  document.getElementById('nonDrinkerCount').value   = '0';
  document.getElementById('nonDrinkerReduction').value = '0';
  document.getElementById('useMaleFemale').checked   = false;
  document.getElementById('genderFields').style.display = 'none';
  document.getElementById('maleCount').value         = '0';
  document.getElementById('femaleCount').value       = '0';
  document.getElementById('femaleDiscount').value    = '0';

  // エラー・結果エリアを非表示
  clearErrors();
  document.getElementById('result-section').style.display = 'none';
  document.getElementById('copy-section').style.display   = 'none';

  lastResult = null;
  lastData   = null;
}

// =====================
// ボタンハンドラ：コピー
// =====================
function handleCopy() {
  const text = document.getElementById('copyText').value;
  if (!text) return;

  const showMsg = () => {
    const msg = document.getElementById('copyMsg');
    msg.style.display = '';
    setTimeout(() => { msg.style.display = 'none'; }, 2000);
  };

  // Clipboard API（モダンブラウザ）
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(showMsg).catch(() => {
      execCopyFallback(text);
      showMsg();
    });
  } else {
    execCopyFallback(text);
    showMsg();
  }
}

/** テキストエリアを使ったコピーフォールバック */
function execCopyFallback(text) {
  const ta = document.getElementById('copyText');
  ta.select();
  try { document.execCommand('copy'); } catch (_) { /* ignore */ }
}

// =====================
// ボタンハンドラ：履歴保存
// =====================
function handleSaveHistory() {
  if (!lastResult || !lastData) return;

  saveHistory(lastData, lastResult);
  renderHistory();

  const btn = document.getElementById('btnSaveHistory');
  btn.textContent = '保存しました！';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '履歴を保存';
    btn.disabled = false;
  }, 1500);
}

// =====================
// ボタンハンドラ：全履歴削除
// =====================
function handleClearHistory() {
  if (!confirm('すべての履歴を削除しますか？')) return;
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}

// =====================
// 履歴の保存（localStorage）
// =====================
function saveHistory(d, result) {
  const history = loadHistoryData();

  const entry = {
    date: new Date().toLocaleString('ja-JP'),
    data: d,
    result: {
      standardPrice:   result.standardPrice,
      femalePrice:     result.femalePrice,
      nonDrinkerPrice: result.nonDrinkerPrice,
      hostPrice:       result.hostPrice,
      totalCollected:  result.totalCollected,
      diff:            result.diff,
    },
    summary: buildSummaryText(d, result),
  };

  history.unshift(entry);                          // 先頭に追加
  if (history.length > MAX_HISTORY) history.pop(); // 最大件数を超えたら末尾を削除

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

/** 履歴一覧用の1行テキストを生成 */
function buildSummaryText(d, result) {
  if (d.useMaleFemale) {
    return `${formatYen(d.total)} / ${d.count}人 ｜ 男性${formatYen(result.standardPrice)} 女性${formatYen(result.femalePrice)}`;
  }
  return `${formatYen(d.total)} / ${d.count}人 ｜ 1人${formatYen(result.standardPrice)}`;
}

// =====================
// 履歴データを読み込む（localStorage）
// =====================
function loadHistoryData() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch (_) {
    return [];
  }
}

// =====================
// 履歴リストの描画
// =====================
function renderHistory() {
  const history  = loadHistoryData();
  const container = document.getElementById('historyList');

  if (history.length === 0) {
    container.innerHTML = '<p class="empty-msg">履歴がありません</p>';
    return;
  }

  container.innerHTML = history.map((entry, idx) => `
    <div class="history-item">
      <div class="history-info">
        <div class="history-date">${entry.date}</div>
        <div class="history-summary">${entry.summary}</div>
      </div>
      <div class="history-actions">
        <button class="btn btn-primary btn-sm" onclick="loadHistoryEntry(${idx})">読込</button>
        <button class="btn btn-danger btn-sm"  onclick="deleteHistoryEntry(${idx})">削除</button>
      </div>
    </div>
  `).join('');
}

// =====================
// 履歴エントリをフォームに読み込み
// =====================
function loadHistoryEntry(index) {
  const history = loadHistoryData();
  const entry   = history[index];
  if (!entry) return;

  const d = entry.data;

  // フォームに値をセット
  document.getElementById('total').value              = d.total;
  document.getElementById('count').value             = d.count;
  document.getElementById('rounding').value          = d.rounding;
  document.getElementById('hostCount').value         = d.hostCount;
  document.getElementById('hostMode').value          = d.hostMode;
  document.getElementById('hostAdj').value           = d.hostAdj;
  document.getElementById('hostAdjGroup').style.display =
    (d.hostMode === 'less' || d.hostMode === 'more') ? '' : 'none';
  document.getElementById('nonDrinkerCount').value   = d.nonDrinkerCount;
  document.getElementById('nonDrinkerReduction').value = d.nonDrinkerReduction;
  document.getElementById('useMaleFemale').checked   = d.useMaleFemale;
  document.getElementById('genderFields').style.display = d.useMaleFemale ? '' : 'none';
  document.getElementById('maleCount').value         = d.maleCount;
  document.getElementById('femaleCount').value       = d.femaleCount;
  document.getElementById('femaleDiscount').value    = d.femaleDiscount;

  // 再計算して結果を表示
  handleCalculate();

  // ページ先頭にスクロール
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =====================
// 履歴エントリを1件削除
// =====================
function deleteHistoryEntry(index) {
  const history = loadHistoryData();
  history.splice(index, 1);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

// =====================
// 金額フォーマット
// =====================
/**
 * 数値を「X,XXX円」形式にフォーマットする
 * 端数処理なしの場合は小数が残るため、小数点以下2桁まで表示する
 * @param {number} amount
 * @returns {string}
 */
function formatYen(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return '---';

  // 浮動小数点の誤差を丸める
  const val = Math.round(amount * 100) / 100;

  if (Number.isInteger(val)) {
    return val.toLocaleString('ja-JP') + '円';
  }
  // 小数あり（端数処理「そのまま」の場合）
  return val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '円';
}
