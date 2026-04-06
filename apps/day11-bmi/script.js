/**
 * BMI記録アプリ - script.js
 * =============================
 * - 身長をlocalStorageに保存
 * - 体重・BMIを日付ごとに記録
 * - 履歴一覧・グラフを更新
 * - PWA: Service Worker の登録
 */

// =============================
// 定数・設定
// =============================

/** localStorageのキー */
const LS_KEY_HEIGHT  = 'bmiAppHeight';   // 身長
const LS_KEY_RECORDS = 'bmiAppRecords';  // 記録データ（配列）

/** BMI判定の閾値とラベル */
const BMI_CATEGORIES = [
  { max: 18.5, label: '痩せ型',   cls: 'badge-thin' },
  { max: 25.0, label: '普通',     cls: 'badge-normal' },
  { max: 30.0, label: '過体重',   cls: 'badge-overweight' },
  { max: 35.0, label: '肥満1度',  cls: 'badge-obese1' },
  { max: 40.0, label: '肥満2度',  cls: 'badge-obese2' },
  { max: Infinity, label: '肥満3度', cls: 'badge-obese3' },
];

// =============================
// DOM 要素の取得
// =============================
const inputHeight        = document.getElementById('input-height');
const btnSaveHeight      = document.getElementById('btn-save-height');
const savedHeightDisplay = document.getElementById('saved-height-display');
const errorHeight        = document.getElementById('error-height');

const inputDate          = document.getElementById('input-date');
const inputWeight        = document.getElementById('input-weight');
const btnSaveRecord      = document.getElementById('btn-save-record');
const errorWeight        = document.getElementById('error-weight');

const sectionLatest      = document.getElementById('section-latest');
const resultWeight       = document.getElementById('result-weight');
const resultBmi          = document.getElementById('result-bmi');
const resultCategory     = document.getElementById('result-category');
const idealWeightText    = document.getElementById('ideal-weight-text');

const sectionHistory     = document.getElementById('section-history');
const historyList        = document.getElementById('history-list');
const btnClearAll        = document.getElementById('btn-clear-all');

const sectionChartWeight = document.getElementById('section-chart-weight');
const sectionChartBmi    = document.getElementById('section-chart-bmi');
const canvasWeight       = document.getElementById('chart-weight');
const canvasBmi          = document.getElementById('chart-bmi');

// Chart.js インスタンス（再描画のため保持）
let chartWeightInstance = null;
let chartBmiInstance    = null;

// =============================
// ユーティリティ関数
// =============================

/**
 * 今日の日付を YYYY-MM-DD 形式で返す
 */
function getTodayString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const dd   = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * BMI値から判定カテゴリを返す
 * @param {number} bmi
 * @returns {{ label: string, cls: string }}
 */
function getBmiCategory(bmi) {
  return BMI_CATEGORIES.find(c => bmi < c.max);
}

/**
 * BMIを計算する
 * @param {number} weightKg - 体重(kg)
 * @param {number} heightCm - 身長(cm)
 * @returns {number} BMI（小数点1位）
 */
function calcBmi(weightKg, heightCm) {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

/**
 * 理想体重を計算する (BMI=22が標準体重)
 * @param {number} heightCm
 * @returns {number}
 */
function calcIdealWeight(heightCm) {
  const hm = heightCm / 100;
  return Math.round(22 * hm * hm * 10) / 10;
}

// =============================
// localStorage 操作
// =============================

/**
 * 保存済みの身長を取得（未設定なら null）
 */
function loadHeight() {
  const val = localStorage.getItem(LS_KEY_HEIGHT);
  return val ? parseFloat(val) : null;
}

/**
 * 身長を保存する
 * @param {number} heightCm
 */
function saveHeight(heightCm) {
  localStorage.setItem(LS_KEY_HEIGHT, heightCm);
}

/**
 * 記録データを全件取得（なければ空配列）
 * @returns {Array<{date: string, weight: number, bmi: number}>}
 */
function loadRecords() {
  const json = localStorage.getItem(LS_KEY_RECORDS);
  return json ? JSON.parse(json) : [];
}

/**
 * 記録データを全件保存する
 * @param {Array} records
 */
function saveRecords(records) {
  localStorage.setItem(LS_KEY_RECORDS, JSON.stringify(records));
}

// =============================
// 身長設定
// =============================

/**
 * 身長設定ボタンのクリックハンドラ
 */
function handleSaveHeight() {
  errorHeight.textContent = '';

  const val = parseFloat(inputHeight.value);

  // バリデーション
  if (!inputHeight.value.trim() || isNaN(val)) {
    errorHeight.textContent = '身長を入力してください';
    return;
  }
  if (val <= 0 || val < 50 || val > 250) {
    errorHeight.textContent = '身長は50〜250cmの範囲で入力してください';
    return;
  }

  saveHeight(val);
  renderSavedHeight(val);
  inputHeight.value = '';
}

/**
 * 保存済み身長をUIに表示する
 * @param {number|null} heightCm
 */
function renderSavedHeight(heightCm) {
  if (heightCm) {
    savedHeightDisplay.textContent = `保存済みの身長：${heightCm} cm`;
  } else {
    savedHeightDisplay.textContent = '身長が未設定です。上で入力して保存してください。';
  }
}

// =============================
// 体重記録
// =============================

/**
 * 「記録する」ボタンのクリックハンドラ
 */
function handleSaveRecord() {
  errorWeight.textContent = '';

  // 身長チェック
  const heightCm = loadHeight();
  if (!heightCm) {
    errorWeight.textContent = '先に身長を設定してください';
    return;
  }

  const date      = inputDate.value;
  const weightVal = parseFloat(inputWeight.value);

  // バリデーション
  if (!date) {
    errorWeight.textContent = '日付を入力してください';
    return;
  }
  if (!inputWeight.value.trim() || isNaN(weightVal)) {
    errorWeight.textContent = '体重を入力してください';
    return;
  }
  if (weightVal <= 0 || weightVal > 300) {
    errorWeight.textContent = '体重は1〜300kgの範囲で入力してください';
    return;
  }

  // BMI計算
  const bmi = calcBmi(weightVal, heightCm);

  // 既存レコードに同じ日付があれば上書き
  let records = loadRecords();
  const existingIndex = records.findIndex(r => r.date === date);
  const newRecord = { date, weight: weightVal, bmi };

  if (existingIndex >= 0) {
    records[existingIndex] = newRecord; // 上書き
  } else {
    records.push(newRecord);            // 新規追加
  }

  // 日付順に並べてから保存
  records.sort((a, b) => a.date.localeCompare(b.date));
  saveRecords(records);

  // 入力欄リセット（日付はそのまま残す）
  inputWeight.value = '';

  // 最新結果・履歴・グラフを更新
  renderLatestResult(newRecord, heightCm);
  renderHistory(records);
  renderCharts(records);
}

// =============================
// 最新結果の表示
// =============================

/**
 * 最新の計算結果をカードに表示する
 * @param {{date, weight, bmi}} record
 * @param {number} heightCm
 */
function renderLatestResult(record, heightCm) {
  const category   = getBmiCategory(record.bmi);
  const idealW     = calcIdealWeight(heightCm);
  const diffWeight = Math.round((record.weight - idealW) * 10) / 10;

  resultWeight.textContent  = record.weight;
  resultBmi.textContent     = record.bmi;

  // カテゴリバッジ
  resultCategory.textContent  = category.label;
  resultCategory.className    = `result-badge ${category.cls}`;

  // 理想体重テキスト
  const sign = diffWeight >= 0 ? '+' : '';
  idealWeightText.textContent =
    `標準体重 ${idealW} kg（現在との差：${sign}${diffWeight} kg）`;

  sectionLatest.style.display = '';
}

// =============================
// 履歴一覧の表示
// =============================

/**
 * 履歴をDOM上に描画する（新しい順）
 * @param {Array} records
 */
function renderHistory(records) {
  historyList.innerHTML = '';

  if (records.length === 0) {
    historyList.innerHTML = '<p class="history-empty">記録がありません</p>';
    sectionHistory.style.display = 'none';
    return;
  }

  sectionHistory.style.display = '';

  // 新しい順にコピーして並べる
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));

  sorted.forEach(record => {
    const category = getBmiCategory(record.bmi);
    const item = document.createElement('div');
    item.className = 'history-item';
    item.dataset.date = record.date;

    item.innerHTML = `
      <span class="history-date">${record.date}</span>
      <div class="history-data">
        <div class="history-val">
          <span class="history-val-label">体重</span>
          <span class="history-val-num">${record.weight}<small style="font-size:0.7em;font-weight:500">kg</small></span>
        </div>
        <div class="history-val">
          <span class="history-val-label">BMI</span>
          <span class="history-val-num is-bmi">${record.bmi}</span>
        </div>
        <span class="history-badge ${category.cls}">${category.label}</span>
      </div>
      <button class="btn-delete" data-date="${record.date}" aria-label="${record.date}の記録を削除">削除</button>
    `;

    historyList.appendChild(item);
  });

  // 削除ボタンにイベントを登録
  historyList.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', e => {
      const targetDate = e.currentTarget.dataset.date;
      handleDeleteRecord(targetDate);
    });
  });
}

// =============================
// 記録の削除
// =============================

/**
 * 特定日付の記録を1件削除する
 * @param {string} date - YYYY-MM-DD
 */
function handleDeleteRecord(date) {
  if (!confirm(`${date} の記録を削除しますか？`)) return;

  let records = loadRecords();
  records = records.filter(r => r.date !== date);
  saveRecords(records);

  renderHistory(records);
  renderCharts(records);

  // 最新結果を更新（残っていれば最新を表示）
  if (records.length > 0) {
    const latest  = [...records].sort((a, b) => b.date.localeCompare(a.date))[0];
    const heightCm = loadHeight();
    renderLatestResult(latest, heightCm);
  } else {
    sectionLatest.style.display = 'none';
  }
}

/**
 * 全件削除ボタンのクリックハンドラ
 */
function handleClearAll() {
  if (!confirm('すべての記録を削除しますか？\nこの操作は取り消せません。')) return;

  saveRecords([]);
  renderHistory([]);
  renderCharts([]);
  sectionLatest.style.display = 'none';
}

// =============================
// グラフの描画
// =============================

/**
 * 体重・BMI の折れ線グラフを描画する
 * @param {Array} records - 日付順のレコード配列
 */
function renderCharts(records) {
  // データがなければグラフを非表示
  if (records.length === 0) {
    sectionChartWeight.style.display = 'none';
    sectionChartBmi.style.display    = 'none';
    if (chartWeightInstance) { chartWeightInstance.destroy(); chartWeightInstance = null; }
    if (chartBmiInstance)    { chartBmiInstance.destroy();    chartBmiInstance    = null; }
    return;
  }

  // 日付順にソート（念のため）
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));

  const labels  = sorted.map(r => r.date.slice(5)); // MM-DD
  const weights = sorted.map(r => r.weight);
  const bmis    = sorted.map(r => r.bmi);

  sectionChartWeight.style.display = '';
  sectionChartBmi.style.display    = '';

  // --- 体重グラフ ---
  if (chartWeightInstance) chartWeightInstance.destroy();
  chartWeightInstance = new Chart(canvasWeight, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: '体重 (kg)',
        data: weights,
        borderColor: '#4caf8a',
        backgroundColor: 'rgba(76, 175, 138, 0.1)',
        pointBackgroundColor: '#4caf8a',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.3,
        fill: true,
        borderWidth: 2.5,
      }],
    },
    options: buildChartOptions('kg'),
  });

  // --- BMIグラフ ---
  if (chartBmiInstance) chartBmiInstance.destroy();
  chartBmiInstance = new Chart(canvasBmi, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'BMI',
        data: bmis,
        borderColor: '#ff8c5a',
        backgroundColor: 'rgba(255, 140, 90, 0.1)',
        pointBackgroundColor: '#ff8c5a',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.3,
        fill: true,
        borderWidth: 2.5,
      }],
    },
    options: buildChartOptions(''),
  });
}

/**
 * Chart.js 共通オプションを返す
 * @param {string} yUnit - Y軸の単位ラベル（例: 'kg'）
 */
function buildChartOptions(yUnit) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.parsed.y}${yUnit}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          font: { family: "'M PLUS Rounded 1c', sans-serif", size: 11 },
          color: '#7a9080',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 7,
        },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          font: { family: "'M PLUS Rounded 1c', sans-serif", size: 11 },
          color: '#7a9080',
          callback: val => `${val}${yUnit}`,
        },
        beginAtZero: false,
      },
    },
  };
}

// =============================
// 初期化処理
// =============================

/**
 * ページ読み込み時の初期化
 */
function init() {
  // 今日の日付をセット
  inputDate.value = getTodayString();

  // 保存済みの身長を復元
  const savedHeight = loadHeight();
  renderSavedHeight(savedHeight);
  if (savedHeight) {
    inputHeight.value = savedHeight;
  }

  // 保存済みの記録を復元
  const records = loadRecords();
  renderHistory(records);
  renderCharts(records);

  // 最新結果を表示（記録があれば）
  if (records.length > 0 && savedHeight) {
    const latest = [...records].sort((a, b) => b.date.localeCompare(a.date))[0];
    renderLatestResult(latest, savedHeight);
  }

  // イベントリスナーを登録
  btnSaveHeight.addEventListener('click', handleSaveHeight);
  btnSaveRecord.addEventListener('click', handleSaveRecord);
  btnClearAll.addEventListener('click', handleClearAll);

  // Enterキーでも記録できるようにする
  inputWeight.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSaveRecord();
  });
  inputHeight.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSaveHeight();
  });
}

// =============================
// PWA: Service Worker 登録
// =============================

/**
 * Service Worker を登録する
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(reg => {
        console.log('[SW] 登録成功:', reg.scope);
      })
      .catch(err => {
        console.warn('[SW] 登録失敗:', err);
      });
  }
}

// =============================
// エントリーポイント
// =============================
document.addEventListener('DOMContentLoaded', () => {
  init();
  registerServiceWorker();
});
