// ===========================
// 定数・設定
// ===========================

/** テンプレート定義 */
const TEMPLATES = {
  free: {
    label: '自由メモ',
    content: ''
  },
  prep: {
    label: 'PREPメモ',
    content: '【結論】\n\n\n【理由】\n\n\n【具体例】\n\n\n【まとめ】\n'
  },
  problem: {
    label: '問題/原因/解決',
    content: '【問題】\n\n\n【原因】\n\n\n【解決策】\n'
  },
  todo: {
    label: 'ToDo整理',
    content: '【やること】\n- \n- \n\n【優先度】\n高 / 中 / 低\n\n【締切】\n\n【メモ】\n'
  },
  idea: {
    label: 'アイデア整理',
    content: '【アイデア名】\n\n\n【背景・きっかけ】\n\n\n【使い道・応用】\n\n\n【次のアクション】\n'
  },
  review: {
    label: '振り返りメモ',
    content: '【良かったこと】\n\n\n【改善したいこと】\n\n\n【次にやること】\n'
  }
};

/** 感情タグ定義 */
const EMOTIONS = {
  '😊': 'うれしい',
  '😌': '落ち着き',
  '😐': 'ふつう',
  '😢': 'しんどい',
  '😡': 'イライラ',
  '😴': '疲れた',
  '💡': 'ひらめき'
};

/** localStorageのキー */
const STORAGE_KEY = 'memopad_memos_v1';
const SETTINGS_KEY = 'memopad_settings_v1';

// ===========================
// アプリ状態
// ===========================

/** 全メモデータ */
let memos = [];

/** アプリ設定 */
let settings = {
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  sortOrder: 'newest',
  filterEmotion: 'all',
  filterTemplate: 'all',
  filterFavorite: false,
  filterRemind: false,
  lastTemplate: 'free'
};

/** 現在編集中のメモID（nullなら新規作成） */
let editingId = null;

/** 自動保存タイマーのID */
let autoSaveTimer = null;

/** トースト非表示タイマーのID */
let toastTimer = null;

/** AIアシストで提案されたタイトル（一時保持） */
let suggestedTitle = '';

// ===========================
// ストレージ操作
// ===========================

/** メモをlocalStorageから読み込む */
function loadMemos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.warn('メモの読み込みに失敗しました。初期化します。');
    return [];
  }
}

/** メモをlocalStorageへ保存する */
function saveMemos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
  } catch (e) {
    showToast('保存に失敗しました（ストレージ容量不足の可能性）');
  }
}

/** 設定をlocalStorageから読み込む */
function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    // 既存キーのみ上書き（未知キーは無視）
    Object.keys(settings).forEach(key => {
      if (key in parsed) settings[key] = parsed[key];
    });
  } catch {
    // 設定読み込み失敗時はデフォルト値を使用
  }
}

/** 設定をlocalStorageへ保存する */
function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // 設定保存失敗は無視
  }
}

// ===========================
// メモのCRUD操作
// ===========================

/**
 * 新しいメモオブジェクトを生成する
 * @param {Object} data - メモデータ
 * @returns {Object} メモオブジェクト
 */
function createMemo(data) {
  const now = new Date().toISOString();
  return {
    id: 'memo_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    title: (data.title || '').trim(),
    body: (data.body || '').trim(),
    emotion: data.emotion || '',
    template: data.template || 'free',
    createdAt: now,
    updatedAt: now,
    remindAt: data.remindAt || null,
    isFavorite: data.isFavorite || false,
    isPinned: data.isPinned || false
  };
}

/**
 * 指定IDのメモを更新する
 * @param {string} id - メモID
 * @param {Object} data - 更新データ
 */
function updateMemo(id, data) {
  const idx = memos.findIndex(m => m.id === id);
  if (idx === -1) return;
  memos[idx] = {
    ...memos[idx],
    ...data,
    updatedAt: new Date().toISOString()
  };
  saveMemos();
}

/**
 * 指定IDのメモを削除する
 * @param {string} id - メモID
 */
function deleteMemo(id) {
  memos = memos.filter(m => m.id !== id);
  saveMemos();
}

/**
 * 指定IDのメモを複製する
 * @param {string} id - コピー元メモID
 */
function duplicateMemo(id) {
  const original = memos.find(m => m.id === id);
  if (!original) return;

  const copy = createMemo({
    ...original,
    title: original.title ? `${original.title}（コピー）` : '',
    isPinned: false // コピーはピン留めしない
  });

  memos.unshift(copy);
  saveMemos();
  showToast('メモを複製しました');
  renderMemoList();
}

// ===========================
// フィルタ・ソート
// ===========================

/**
 * 現在のフィルタ・ソート条件でメモ一覧を返す
 * @returns {Array} フィルタ・ソート後のメモ配列
 */
function getFilteredMemos() {
  const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();

  // フィルタリング
  let filtered = memos.filter(memo => {
    // テキスト検索
    if (searchQuery) {
      const inTitle = memo.title.toLowerCase().includes(searchQuery);
      const inBody = memo.body.toLowerCase().includes(searchQuery);
      if (!inTitle && !inBody) return false;
    }

    // 感情フィルタ
    if (settings.filterEmotion !== 'all') {
      if (settings.filterEmotion === 'none') {
        if (memo.emotion) return false;
      } else {
        if (memo.emotion !== settings.filterEmotion) return false;
      }
    }

    // テンプレートフィルタ
    if (settings.filterTemplate !== 'all') {
      if (memo.template !== settings.filterTemplate) return false;
    }

    // お気に入りフィルタ
    if (settings.filterFavorite && !memo.isFavorite) return false;

    // リマインドフィルタ
    if (settings.filterRemind && !memo.remindAt) return false;

    return true;
  });

  // 並び替え関数
  function sortList(list) {
    const sorted = [...list];
    switch (settings.sortOrder) {
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'updated':
        return sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      case 'favorite':
        return sorted.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)
          || new Date(b.createdAt) - new Date(a.createdAt));
      default: // newest
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }

  // お気に入り優先・ピン留め優先は全体ソートで処理
  if (settings.sortOrder === 'favorite') {
    return sortList(filtered);
  }

  // ピン留めを先頭にまとめて、それぞれソート
  const pinned = filtered.filter(m => m.isPinned);
  const unpinned = filtered.filter(m => !m.isPinned);
  return [...sortList(pinned), ...sortList(unpinned)];
}

// ===========================
// レンダリング
// ===========================

/** メモ一覧を再描画する */
function renderMemoList() {
  const list = document.getElementById('memoList');
  const filtered = getFilteredMemos();

  // 件数表示を更新
  document.getElementById('memoCount').textContent = `メモ ${filtered.length}件`;

  // 空状態
  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-text">メモが見つかりません</div>
      </div>
    `;
    return;
  }

  const hasPinned = filtered.some(m => m.isPinned);
  const hasUnpinned = filtered.some(m => !m.isPinned);
  const showDividers = hasPinned && hasUnpinned && settings.sortOrder !== 'favorite';

  let html = '';

  if (showDividers) {
    html += '<div class="pinned-divider">📌 ピン留め</div>';
    filtered.filter(m => m.isPinned).forEach(memo => { html += buildMemoCardHtml(memo); });
    html += '<div class="pinned-divider">その他</div>';
    filtered.filter(m => !m.isPinned).forEach(memo => { html += buildMemoCardHtml(memo); });
  } else {
    filtered.forEach(memo => { html += buildMemoCardHtml(memo); });
  }

  list.innerHTML = html;

  // カードにイベントリスナーを設定
  list.querySelectorAll('.memo-card').forEach(card => {
    const id = card.dataset.id;

    // カード本体クリック → 編集
    card.querySelector('.memo-card-clickable').addEventListener('click', () => openEditor(id));

    // 各アクションボタン
    card.querySelector('.btn-edit')?.addEventListener('click', e => {
      e.stopPropagation();
      openEditor(id);
    });

    card.querySelector('.btn-delete')?.addEventListener('click', e => {
      e.stopPropagation();
      confirmDelete(id);
    });

    card.querySelector('.btn-duplicate')?.addEventListener('click', e => {
      e.stopPropagation();
      duplicateMemo(id);
    });

    card.querySelector('.btn-favorite')?.addEventListener('click', e => {
      e.stopPropagation();
      const memo = memos.find(m => m.id === id);
      if (!memo) return;
      updateMemo(id, { isFavorite: !memo.isFavorite });
      renderMemoList();
    });

    card.querySelector('.btn-pin')?.addEventListener('click', e => {
      e.stopPropagation();
      const memo = memos.find(m => m.id === id);
      if (!memo) return;
      updateMemo(id, { isPinned: !memo.isPinned });
      renderMemoList();
    });
  });
}

/**
 * メモカードのHTML文字列を生成する
 * @param {Object} memo - メモオブジェクト
 * @returns {string} HTML文字列
 */
function buildMemoCardHtml(memo) {
  const createdLabel = formatDate(memo.createdAt);
  const updatedLabel = (memo.updatedAt !== memo.createdAt) ? formatDate(memo.updatedAt) : '';
  const templateLabel = TEMPLATES[memo.template]?.label || '';
  const bodyPreview = memo.body.slice(0, 150);

  // タイトル
  const titleHtml = memo.title
    ? `<span class="memo-card-title">${escapeHtml(memo.title)}</span>`
    : `<span class="memo-card-title untitled">（タイトルなし）</span>`;

  // フラグバッジ
  const flagsHtml = [
    memo.isFavorite ? '<span class="flag-badge" title="お気に入り">⭐</span>' : '',
    memo.isPinned ? '<span class="flag-badge" title="ピン留め">📌</span>' : ''
  ].join('');

  // リマインドチップ
  let remindHtml = '';
  if (memo.remindAt) {
    const remindDate = new Date(memo.remindAt);
    const isOverdue = remindDate < new Date();
    const label = isOverdue ? '⚠️ 期限到来' : `⏰ ${formatDate(memo.remindAt)}`;
    remindHtml = `<span class="remind-chip ${isOverdue ? 'overdue' : ''}">${escapeHtml(label)}</span>`;
  }

  return `
    <div class="memo-card" data-id="${memo.id}" data-emotion="${memo.emotion || ''}">
      <div class="memo-card-clickable">
        <div class="memo-card-header">
          ${titleHtml}
          <div class="memo-card-flags">${flagsHtml}</div>
        </div>
        <div class="memo-card-meta">
          ${memo.emotion ? `<span class="emotion-chip" title="${EMOTIONS[memo.emotion] || ''}">${memo.emotion}</span>` : ''}
          ${memo.template !== 'free' ? `<span class="template-chip">${escapeHtml(templateLabel)}</span>` : ''}
          ${remindHtml}
          <span class="meta-chip">📅 ${createdLabel}</span>
          ${updatedLabel ? `<span class="meta-chip">✏️ ${updatedLabel}</span>` : ''}
        </div>
        ${bodyPreview ? `<div class="memo-card-body">${escapeHtml(bodyPreview)}</div>` : ''}
      </div>
      <div class="memo-card-actions">
        <button class="card-btn btn-edit">✏️ 編集</button>
        <button class="card-btn btn-favorite ${memo.isFavorite ? 'btn-active' : ''}">
          ${memo.isFavorite ? '⭐' : '☆'} お気に入り
        </button>
        <button class="card-btn btn-pin ${memo.isPinned ? 'pin-active' : ''}">
          📌 ${memo.isPinned ? 'ピン中' : 'ピン留め'}
        </button>
        <button class="card-btn btn-duplicate">📄 複製</button>
        <button class="card-btn danger btn-delete">🗑️ 削除</button>
      </div>
    </div>
  `;
}

// ===========================
// エディタモーダル
// ===========================

/**
 * メモ編集モーダルを開く
 * @param {string|null} id - 編集するメモID。nullなら新規作成
 */
function openEditor(id = null) {
  editingId = id;

  const modal = document.getElementById('editorModal');
  const titleInput = document.getElementById('memoTitle');
  const bodyInput = document.getElementById('memoBody');
  const templateSelect = document.getElementById('memoTemplate');
  const emotionSelect = document.getElementById('memoEmotion');
  const remindInput = document.getElementById('memoRemind');
  const btnFavorite = document.getElementById('btnFavorite');
  const btnPin = document.getElementById('btnPin');
  const btnDuplicate = document.getElementById('btnDuplicate');
  const btnDelete = document.getElementById('btnDeleteInModal');
  const aiResult = document.getElementById('aiResult');

  // AIアシスト結果をリセット
  aiResult.innerHTML = '';
  suggestedTitle = '';

  if (id) {
    // 既存メモの編集
    const memo = memos.find(m => m.id === id);
    if (!memo) return;

    document.getElementById('modalTitle').textContent = 'メモを編集';
    titleInput.value = memo.title;
    bodyInput.value = memo.body;
    templateSelect.value = memo.template;
    emotionSelect.value = memo.emotion;
    remindInput.value = memo.remindAt ? memo.remindAt.slice(0, 16) : '';
    btnFavorite.dataset.active = String(memo.isFavorite);
    btnPin.dataset.active = String(memo.isPinned);
    btnDuplicate.style.display = '';
    btnDelete.style.display = '';
  } else {
    // 新規作成
    document.getElementById('modalTitle').textContent = '新規メモ';
    titleInput.value = '';
    bodyInput.value = TEMPLATES[settings.lastTemplate]?.content || '';
    templateSelect.value = settings.lastTemplate;
    emotionSelect.value = '';
    remindInput.value = '';
    btnFavorite.dataset.active = 'false';
    btnPin.dataset.active = 'false';
    btnDuplicate.style.display = 'none';
    btnDelete.style.display = 'none';
  }

  updateWordCount();
  document.getElementById('autosaveIndicator').textContent = '';
  modal.style.display = 'flex';

  // フォーカスをタイトルへ
  setTimeout(() => titleInput.focus(), 100);
}

/** モーダルを閉じる */
function closeEditor() {
  document.getElementById('editorModal').style.display = 'none';
  editingId = null;
  clearAutoSave();
  document.getElementById('autosaveIndicator').textContent = '';
}

/** モーダルの内容を保存する */
function saveMemoFromEditor() {
  const title = document.getElementById('memoTitle').value;
  const body = document.getElementById('memoBody').value;
  const template = document.getElementById('memoTemplate').value;
  const emotion = document.getElementById('memoEmotion').value;
  const remindRaw = document.getElementById('memoRemind').value;
  const remindAt = remindRaw ? new Date(remindRaw).toISOString() : null;
  const isFavorite = document.getElementById('btnFavorite').dataset.active === 'true';
  const isPinned = document.getElementById('btnPin').dataset.active === 'true';

  // 空チェック
  if (!title.trim() && !body.trim()) {
    showToast('タイトルまたは本文を入力してください');
    return;
  }

  if (editingId) {
    updateMemo(editingId, { title: title.trim(), body: body.trim(), emotion, template, remindAt, isFavorite, isPinned });
    showToast('メモを更新しました');
  } else {
    const memo = createMemo({ title, body, emotion, template, remindAt, isFavorite, isPinned });
    memos.unshift(memo);
    saveMemos();
    showToast('メモを保存しました');
  }

  settings.lastTemplate = template;
  saveSettings();
  closeEditor();
  renderMemoList();
}

// ===========================
// 自動保存
// ===========================

/** 自動保存をスケジュールする（既存メモ編集時のみ） */
function scheduleAutoSave() {
  if (!editingId) return; // 新規作成時は自動保存しない

  clearAutoSave();
  document.getElementById('autosaveIndicator').textContent = '編集中...';

  autoSaveTimer = setTimeout(() => {
    performAutoSave();
  }, 1500);
}

/** 自動保存を実行する */
function performAutoSave() {
  if (!editingId) return;

  const title = document.getElementById('memoTitle').value;
  const body = document.getElementById('memoBody').value;
  const template = document.getElementById('memoTemplate').value;
  const emotion = document.getElementById('memoEmotion').value;
  const remindRaw = document.getElementById('memoRemind').value;
  const remindAt = remindRaw ? new Date(remindRaw).toISOString() : null;
  const isFavorite = document.getElementById('btnFavorite').dataset.active === 'true';
  const isPinned = document.getElementById('btnPin').dataset.active === 'true';

  updateMemo(editingId, { title: title.trim(), body: body.trim(), emotion, template, remindAt, isFavorite, isPinned });
  document.getElementById('autosaveIndicator').textContent = '✓ 自動保存';
}

/** 自動保存タイマーをキャンセルする */
function clearAutoSave() {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = null;
  }
}

// ===========================
// クイックメモ
// ===========================

/** クイックメモを保存する */
function saveQuickMemo() {
  const text = document.getElementById('quickMemoText').value.trim();
  if (!text) {
    showToast('メモを入力してください');
    return;
  }

  const memo = createMemo({ body: text });
  memos.unshift(memo);
  saveMemos();
  document.getElementById('quickMemoText').value = '';
  // textareaの高さをリセット
  document.getElementById('quickMemoText').style.height = '';
  showToast('クイックメモを保存しました ⚡');
  renderMemoList();
}

// ===========================
// 削除確認
// ===========================

/**
 * 削除確認ダイアログを表示して削除実行
 * @param {string} id - 削除するメモID
 */
function confirmDelete(id) {
  const memo = memos.find(m => m.id === id);
  if (!memo) return;

  const title = memo.title || '（タイトルなし）';
  if (!confirm(`「${title}」を削除しますか？\nこの操作は取り消せません。`)) return;

  deleteMemo(id);
  showToast('メモを削除しました');
  if (editingId === id) closeEditor();
  renderMemoList();
}

// ===========================
// AIアシスト機能（ローカル処理）
// ===========================

/** 本文からタイトル候補を生成する */
function suggestTitleFromBody() {
  const body = document.getElementById('memoBody').value.trim();
  const aiResult = document.getElementById('aiResult');

  if (!body) {
    aiResult.textContent = '本文を入力してからお試しください';
    return;
  }

  // テンプレートのセクションヘッダー（【〇〇】）を除いた最初の有意な行を取得
  const lines = body
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.match(/^【.*】$/) && !l.match(/^[-・*#\s]*$/));

  let candidate = '';
  if (lines.length > 0) {
    // 先頭の箇条書き記号を除去し、最大30文字
    candidate = lines[0].replace(/^[-・*#→▶\s]+/, '').trim().slice(0, 30);
  }

  if (!candidate) {
    candidate = body.replace(/\s+/g, ' ').trim().slice(0, 25);
  }

  suggestedTitle = candidate;

  // 結果を表示（XSS防止のためescapeHtml使用）
  aiResult.innerHTML = '';
  const textNode = document.createTextNode(`タイトル候補：「${candidate}」　`);
  aiResult.appendChild(textNode);

  const applyBtn = document.createElement('button');
  applyBtn.className = 'btn-ai';
  applyBtn.textContent = '適用する';
  applyBtn.addEventListener('click', () => {
    document.getElementById('memoTitle').value = suggestedTitle;
    aiResult.textContent = '✓ タイトルをセットしました';
  });
  aiResult.appendChild(applyBtn);
}

/** 本文からキーワードを抽出する */
function extractKeywordsFromBody() {
  const body = document.getElementById('memoBody').value.trim();
  const aiResult = document.getElementById('aiResult');

  if (!body) {
    aiResult.textContent = '本文を入力してからお試しください';
    return;
  }

  // 日本語の一般的な助詞・接続詞をストップワードとして除外
  const stopWords = new Set([
    'こと', 'ため', 'もの', 'これ', 'それ', 'あれ', 'この', 'その', 'あの',
    'ここ', 'そこ', 'あそこ', 'いう', 'なる', 'する', 'ある', 'いる', 'できる',
    'から', 'まで', 'より', 'ので', 'のに', 'ては', 'など', 'また', 'さらに',
    'そして', 'しかし', 'ただ', 'もし', 'すでに', '以下', '以上', '場合',
    '必要', '次に', '最後', 'つまり', 'しかも', 'ただし', 'なお', '以外'
  ]);

  // テキストを単語に分割して頻度を集計
  const words = body
    .replace(/[【】「」『』（）()、。\n\r\t!?！？]/g, ' ')
    .split(/\s+/)
    .map(w => w.replace(/[^\u3000-\u9FFF\u30A0-\u30FF\u3040-\u309F\w]/g, '').trim())
    .filter(w => w.length >= 2 && !stopWords.has(w));

  const freq = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });

  const keywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word]) => `#${word}`);

  if (keywords.length === 0) {
    aiResult.textContent = 'キーワードを抽出できませんでした';
  } else {
    aiResult.textContent = `キーワード：${keywords.join('  ')}`;
  }
}

/** 文字数カウントを更新する */
function updateWordCount() {
  const body = document.getElementById('memoBody').value;
  document.getElementById('wordCount').textContent = `${body.length}文字`;
}

// ===========================
// ダークモード
// ===========================

/** ダークモードを適用する */
function applyDarkMode() {
  document.documentElement.dataset.theme = settings.darkMode ? 'dark' : 'light';
  document.getElementById('btnDarkMode').textContent = settings.darkMode ? '☀️' : '🌙';
}

// ===========================
// バックアップ（エクスポート・インポート）
// ===========================

/** 全メモをJSONファイルとしてエクスポートする */
function exportMemos() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    memos: memos
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `memopad_backup_${formatDateForFileName(new Date())}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('バックアップを保存しました ⬇️');
}

/**
 * JSONファイルからメモをインポートする
 * @param {File} file - インポートするJSONファイル
 */
function importMemos(file) {
  const reader = new FileReader();

  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      let imported = [];

      // フォーマット判定（配列直接 or {memos: [...]} 形式）
      if (Array.isArray(data)) {
        imported = data;
      } else if (data.memos && Array.isArray(data.memos)) {
        imported = data.memos;
      } else {
        throw new Error('不正なフォーマット');
      }

      // 最低限のバリデーション
      imported = imported.filter(m =>
        m && typeof m === 'object' && typeof m.id === 'string' &&
        (m.title !== undefined || m.body !== undefined)
      );

      if (imported.length === 0) {
        showToast('インポートできるメモが見つかりませんでした');
        return;
      }

      if (!confirm(`${imported.length}件のメモをインポートします。\n既存のメモは保持されます。よろしいですか？`)) return;

      // 重複IDを除外してマージ
      const existingIds = new Set(memos.map(m => m.id));
      const newMemos = imported.filter(m => !existingIds.has(m.id));

      memos = [...newMemos, ...memos];
      saveMemos();
      renderMemoList();
      showToast(`${newMemos.length}件のメモをインポートしました ⬆️`);

    } catch {
      showToast('インポートに失敗しました（ファイル形式が正しくありません）');
    }
  };

  reader.readAsText(file, 'UTF-8');
}

// ===========================
// トースト通知
// ===========================

/**
 * トースト通知を表示する
 * @param {string} message - 表示するメッセージ
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// ===========================
// ユーティリティ
// ===========================

/**
 * ISO日時文字列を読みやすい形式に変換する
 * @param {string} isoStr - ISO 8601形式の日時文字列
 * @returns {string} フォーマットされた日時文字列
 */
function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const now = new Date();
  const diffMs = now - d;

  // 過去の日時のみ相対表示（未来の日時は絶対表示へ）
  if (diffMs >= 0 && diffMs < 60 * 1000) return 'たった今';
  if (diffMs >= 0 && diffMs < 60 * 60 * 1000) return `${Math.floor(diffMs / 60000)}分前`;
  if (diffMs >= 0 && diffMs < 24 * 60 * 60 * 1000) return `${Math.floor(diffMs / 3600000)}時間前`;

  const y = d.getFullYear();
  const mo = d.getMonth() + 1;
  const day = d.getDate();
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');

  if (y === now.getFullYear()) {
    return `${mo}/${day} ${h}:${min}`;
  }
  return `${y}/${mo}/${day}`;
}

/**
 * ファイル名用の日付文字列を生成する
 * @param {Date} d - 日付オブジェクト
 * @returns {string} YYYYMMDD形式の文字列
 */
function formatDateForFileName(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

/**
 * HTMLエスケープを行う（XSS防止）
 * @param {string} str - エスケープする文字列
 * @returns {string} エスケープ済み文字列
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ===========================
// サンプルメモ
// ===========================

/** 初回起動用サンプルメモを生成する */
function createSampleMemos() {
  const now = new Date();
  const d1 = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const d2 = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  const d3 = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  // 半年後のリマインド
  const future = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);

  return [
    {
      id: 'sample_welcome',
      title: 'ようこそ！MemoPadへ',
      body: 'MemoPadをご利用いただきありがとうございます 📝\n\n' +
        '主な使い方：\n' +
        '⚡ 3秒メモ  → 上の欄にサクッと入力して保存\n' +
        '✏️ 新規メモ → テンプレートや感情タグが使えます\n' +
        '😊 感情タグ → 今の気持ちを記録しておけます\n' +
        '📌 ピン留め → 重要なメモを一覧の先頭に固定\n' +
        '⭐ お気に入り → よく見るメモに印をつけて絞り込み\n' +
        '⏰ リマインド → 未来の自分へのメモとして活用\n' +
        '💾 バックアップ → ヘッダーの ⬇️ でJSONを保存',
      emotion: '😊',
      template: 'free',
      createdAt: d1.toISOString(),
      updatedAt: d1.toISOString(),
      remindAt: null,
      isFavorite: true,
      isPinned: true
    },
    {
      id: 'sample_prep',
      title: '朝の読書習慣を続ける理由',
      body: '【結論】\n毎朝30分の読書を続ける\n\n' +
        '【理由】\n情報収集と思考整理に読書習慣が効果的だから\n\n' +
        '【具体例】\n先週から試してみて、仕事前に頭がスッキリする感覚があった。\n集中力も上がった気がする。\n\n' +
        '【まとめ】\n来月末まで継続して、効果を振り返ってみる。',
      emotion: '💡',
      template: 'prep',
      createdAt: d2.toISOString(),
      updatedAt: d2.toISOString(),
      remindAt: null,
      isFavorite: false,
      isPinned: false
    },
    {
      id: 'sample_emotion',
      title: '今日の気持ちメモ',
      body: '午後から少し疲れてきた。\n締め切りが近くてプレッシャーを感じている。\n\n' +
        'でも、昨日より確実に前進はしている。\n今夜は早めに休んで、明日またがんばろう。',
      emotion: '😴',
      template: 'free',
      createdAt: d3.toISOString(),
      updatedAt: d3.toISOString(),
      remindAt: null,
      isFavorite: false,
      isPinned: false
    },
    {
      id: 'sample_future',
      title: '半年後の自分へ',
      body: '今日、新しい一歩を踏み出すと決めた。\n\n' +
        '怖くても、不安でも、あの時の自分は前を向いた。\n半年後に読み返したとき、どこまで来れているかな？\n\n' +
        'きっと大丈夫。今の自分を誇りに思う。',
      emotion: '😊',
      template: 'free',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      remindAt: future.toISOString(),
      isFavorite: true,
      isPinned: false
    }
  ];
}

// ===========================
// イベントリスナー登録
// ===========================

/** 全イベントリスナーを初期化する */
function initEventListeners() {

  // ---- ヘッダー ----
  document.getElementById('btnDarkMode').addEventListener('click', () => {
    settings.darkMode = !settings.darkMode;
    applyDarkMode();
    saveSettings();
  });

  document.getElementById('btnExport').addEventListener('click', exportMemos);

  document.getElementById('btnImport').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });

  document.getElementById('importFile').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
      importMemos(file);
      e.target.value = ''; // 同じファイルを再インポートできるようにリセット
    }
  });

  // ---- クイックメモ ----
  document.getElementById('btnQuickSave').addEventListener('click', saveQuickMemo);

  // Ctrl+Enter で保存
  document.getElementById('quickMemoText').addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      saveQuickMemo();
    }
  });

  // テキストエリアの自動リサイズ
  document.getElementById('quickMemoText').addEventListener('input', e => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  });

  // ---- 新規メモボタン ----
  document.getElementById('btnNewMemo').addEventListener('click', () => openEditor());

  // ---- 検索 ----
  const searchInput = document.getElementById('searchInput');
  const btnClearSearch = document.getElementById('btnClearSearch');

  searchInput.addEventListener('input', () => {
    btnClearSearch.style.display = searchInput.value ? '' : 'none';
    renderMemoList();
  });

  btnClearSearch.addEventListener('click', () => {
    searchInput.value = '';
    btnClearSearch.style.display = 'none';
    renderMemoList();
  });

  // ---- 感情フィルタ（ピル） ----
  document.getElementById('emotionFilter').addEventListener('click', e => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    document.querySelectorAll('#emotionFilter .pill').forEach(p => p.classList.remove('pill-active'));
    pill.classList.add('pill-active');
    settings.filterEmotion = pill.dataset.emotion;
    saveSettings();
    renderMemoList();
  });

  // ---- テンプレートフィルタ ----
  document.getElementById('templateFilter').addEventListener('change', e => {
    settings.filterTemplate = e.target.value;
    saveSettings();
    renderMemoList();
  });

  // ---- 並び替え ----
  document.getElementById('sortOrder').addEventListener('change', e => {
    settings.sortOrder = e.target.value;
    saveSettings();
    renderMemoList();
  });

  // ---- トグルフィルタ ----
  document.getElementById('filterFavorite').addEventListener('click', e => {
    settings.filterFavorite = !settings.filterFavorite;
    e.currentTarget.dataset.active = String(settings.filterFavorite);
    saveSettings();
    renderMemoList();
  });

  document.getElementById('filterRemind').addEventListener('click', e => {
    settings.filterRemind = !settings.filterRemind;
    e.currentTarget.dataset.active = String(settings.filterRemind);
    saveSettings();
    renderMemoList();
  });

  // ---- モーダル操作 ----
  document.getElementById('btnCloseModal').addEventListener('click', closeEditor);
  document.getElementById('btnCancelModal').addEventListener('click', closeEditor);
  document.getElementById('btnSaveMemo').addEventListener('click', saveMemoFromEditor);

  document.getElementById('btnDuplicate').addEventListener('click', () => {
    if (!editingId) return;
    const id = editingId;
    closeEditor();
    duplicateMemo(id);
  });

  document.getElementById('btnDeleteInModal').addEventListener('click', () => {
    if (editingId) confirmDelete(editingId);
  });

  // オーバーレイクリックで閉じる
  document.getElementById('editorModal').addEventListener('click', e => {
    if (e.target === document.getElementById('editorModal')) closeEditor();
  });

  // ---- エディタ内フォーム ----

  // テンプレート切り替え
  document.getElementById('memoTemplate').addEventListener('change', e => {
    const newTemplate = e.target.value;
    const body = document.getElementById('memoBody').value;
    const templateContent = TEMPLATES[newTemplate]?.content || '';

    if (!body.trim() || !templateContent) {
      // 本文が空またはテンプレートに内容がなければそのまま適用
      document.getElementById('memoBody').value = templateContent;
      updateWordCount();
    } else if (confirm('テンプレートを適用しますか？\n現在の本文は上書きされます。')) {
      document.getElementById('memoBody').value = templateContent;
      updateWordCount();
    }
  });

  // お気に入り・ピン留めトグル
  document.getElementById('btnFavorite').addEventListener('click', e => {
    const btn = e.currentTarget;
    btn.dataset.active = String(btn.dataset.active !== 'true');
    scheduleAutoSave();
  });

  document.getElementById('btnPin').addEventListener('click', e => {
    const btn = e.currentTarget;
    btn.dataset.active = String(btn.dataset.active !== 'true');
    scheduleAutoSave();
  });

  // 本文入力 → 文字数更新・自動保存
  document.getElementById('memoBody').addEventListener('input', () => {
    updateWordCount();
    scheduleAutoSave();
  });

  // タイトル入力 → 自動保存
  document.getElementById('memoTitle').addEventListener('input', scheduleAutoSave);

  // ---- AIアシスト ----
  document.getElementById('btnSuggestTitle').addEventListener('click', suggestTitleFromBody);
  document.getElementById('btnExtractKeywords').addEventListener('click', extractKeywordsFromBody);

  // ---- キーボードショートカット ----
  document.addEventListener('keydown', e => {
    // Escでモーダルを閉じる
    if (e.key === 'Escape') {
      const modal = document.getElementById('editorModal');
      if (modal.style.display !== 'none') closeEditor();
    }
  });
}

// ===========================
// 初期化
// ===========================

/** アプリを初期化する */
function init() {
  // データ・設定を読み込む
  loadSettings();
  memos = loadMemos();

  // 初回起動時はサンプルメモを追加
  if (memos.length === 0) {
    memos = createSampleMemos();
    saveMemos();
  }

  // ダークモードを適用
  applyDarkMode();

  // UI状態を設定値に合わせる
  document.getElementById('sortOrder').value = settings.sortOrder;
  document.getElementById('templateFilter').value = settings.filterTemplate;
  document.getElementById('filterFavorite').dataset.active = String(settings.filterFavorite);
  document.getElementById('filterRemind').dataset.active = String(settings.filterRemind);

  // 感情フィルタのピルを復元
  document.querySelectorAll('#emotionFilter .pill').forEach(p => {
    p.classList.toggle('pill-active', p.dataset.emotion === settings.filterEmotion);
  });

  // イベントリスナーを設定
  initEventListeners();

  // メモ一覧を描画
  renderMemoList();

  // Service Workerを登録（PWA対応）
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(err => {
      console.warn('Service Worker の登録に失敗しました:', err);
    });
  }
}

// DOMの準備が整ったら初期化を実行
document.addEventListener('DOMContentLoaded', init);
