// ===========================
// 翻訳定義（日本語・英語）
// ===========================
const TRANSLATIONS = {
  ja: {
    // クイックメモ
    quickMemoLabel: '⚡ 3秒メモ',
    quickMemoHint: 'Ctrl+Enter で保存',
    quickMemoPlaceholder: '今思ったことをすぐメモ...',
    quickMemoSaveBtn: '保存',
    // 新規メモ
    newMemoBtn: '新規メモを作成',
    // 検索・フィルタ
    searchPlaceholder: 'タイトル・本文を検索...',
    emotionFilterLabel: '感情で絞り込み',
    templateFilterLabel: 'テンプレートで絞り込み',
    sortLabel: '並び替え',
    filterToggleLabel: '絞り込み',
    allTemplates: 'すべてのテンプレート',
    sortNewest: '新しい順',
    sortOldest: '古い順',
    sortUpdated: '更新順',
    sortFavoriteFirst: 'お気に入り優先',
    sortPinnedFirst: 'ピン留め優先',
    filterFavBtn: '⭐ お気に入り',
    filterRemindBtn: '⏰ リマインド',
    emotionAll: 'すべて',
    emotionNone: 'なし',
    // メモ一覧
    memoCount: (n) => `メモ ${n}件`,
    pinnedLabel: '📌 ピン留め',
    othersLabel: 'その他',
    emptyState: 'メモが見つかりません',
    // カードアクション
    editBtn: '✏️ 編集',
    favoriteOnBtn: '⭐ お気に入り',
    favoriteOffBtn: '☆ お気に入り',
    pinOnBtn: '📌 ピン中',
    pinOffBtn: '📌 ピン留め',
    duplicateBtn: '📄 複製',
    deleteBtn: '🗑️ 削除',
    untitled: '（タイトルなし）',
    overdueLabel: '⚠️ 期限到来',
    // モーダル
    newMemoModalTitle: '新規メモ',
    editMemoModalTitle: 'メモを編集',
    titlePlaceholder: 'タイトル（省略可）',
    templateLabel: 'テンプレート',
    emotionLabel: '今の気持ち',
    noEmotion: '選択しない',
    bodyLabel: '本文',
    bodyPlaceholder: 'メモを入力...',
    autoSaving: '編集中...',
    autoSaved: '✓ 自動保存',
    // AIアシスト
    aiLabel: '✨ アシスト',
    suggestTitleBtn: 'タイトル候補',
    extractKeywordsBtn: 'キーワード',
    wordCountLabel: (n) => `${n}文字`,
    remindLabel: '⏰ リマインド日時',
    flagLabel: 'フラグ',
    // モーダルフッター
    duplicateModalBtn: '📄 複製',
    deleteModalBtn: '🗑️ 削除',
    cancelBtn: 'キャンセル',
    saveBtn: '保存',
    // テンプレートラベル
    tplFree: '自由メモ',
    tplPrep: 'PREPメモ',
    tplProblem: '問題/原因/解決',
    tplTodo: 'ToDo整理',
    tplIdea: 'アイデア整理',
    tplReview: '振り返りメモ',
    // テンプレート本文
    tplPrepContent: '【結論】\n\n\n【理由】\n\n\n【具体例】\n\n\n【まとめ】\n',
    tplProblemContent: '【問題】\n\n\n【原因】\n\n\n【解決策】\n',
    tplTodoContent: '【やること】\n- \n- \n\n【優先度】\n高 / 中 / 低\n\n【締切】\n\n【メモ】\n',
    tplIdeaContent: '【アイデア名】\n\n\n【背景・きっかけ】\n\n\n【使い道・応用】\n\n\n【次のアクション】\n',
    tplReviewContent: '【良かったこと】\n\n\n【改善したいこと】\n\n\n【次にやること】\n',
    // 感情ラベル
    emo_happy: 'うれしい', emo_calm: '落ち着き', emo_normal: 'ふつう',
    emo_sad: 'しんどい', emo_angry: 'イライラ', emo_tired: '疲れた', emo_idea: 'ひらめき',
    // トースト
    toastQuickSaved: 'クイックメモを保存しました ⚡',
    toastSaved: 'メモを保存しました',
    toastUpdated: 'メモを更新しました',
    toastDeleted: 'メモを削除しました',
    toastDuplicated: 'メモを複製しました',
    toastExported: 'バックアップを保存しました ⬇️',
    toastImported: (n) => `${n}件のメモをインポートしました ⬆️`,
    toastEmptyQuick: 'メモを入力してください',
    toastEmptyMemo: 'タイトルまたは本文を入力してください',
    toastStorageError: '保存に失敗しました（ストレージ容量不足の可能性）',
    toastImportNoMemos: 'インポートできるメモが見つかりませんでした',
    toastImportFail: 'インポートに失敗しました（ファイル形式が正しくありません）',
    // AIアシスト結果
    aiNoBody: '本文を入力してからお試しください',
    aiTitlePrefix: (s) => `タイトル候補：「${s}」　`,
    aiTitleApply: '適用する',
    aiTitleApplied: '✓ タイトルをセットしました',
    aiNoKeywords: 'キーワードを抽出できませんでした',
    aiKeywordsResult: (kw) => `キーワード：${kw}`,
    // 確認ダイアログ
    confirmDelete: (t) => `「${t}」を削除しますか？\nこの操作は取り消せません。`,
    confirmImport: (n) => `${n}件のメモをインポートします。\n既存のメモは保持されます。よろしいですか？`,
    confirmTemplate: 'テンプレートを適用しますか？\n現在の本文は上書きされます。',
    // 日時フォーマット
    justNow: 'たった今',
    minutesAgo: (m) => `${m}分前`,
    hoursAgo: (h) => `${h}時間前`,
  },

  en: {
    quickMemoLabel: '⚡ Quick Memo',
    quickMemoHint: 'Ctrl+Enter to save',
    quickMemoPlaceholder: 'Write a quick thought...',
    quickMemoSaveBtn: 'Save',
    newMemoBtn: 'New Memo',
    searchPlaceholder: 'Search title or body...',
    emotionFilterLabel: 'Filter by emotion',
    templateFilterLabel: 'Filter by template',
    sortLabel: 'Sort by',
    filterToggleLabel: 'Filter',
    allTemplates: 'All templates',
    sortNewest: 'Newest first',
    sortOldest: 'Oldest first',
    sortUpdated: 'Recently updated',
    sortFavoriteFirst: 'Favorites first',
    sortPinnedFirst: 'Pinned first',
    filterFavBtn: '⭐ Favorites',
    filterRemindBtn: '⏰ Reminders',
    emotionAll: 'All',
    emotionNone: 'None',
    memoCount: (n) => `${n} memo${n !== 1 ? 's' : ''}`,
    pinnedLabel: '📌 Pinned',
    othersLabel: 'Others',
    emptyState: 'No memos found',
    editBtn: '✏️ Edit',
    favoriteOnBtn: '⭐ Favorited',
    favoriteOffBtn: '☆ Favorite',
    pinOnBtn: '📌 Pinned',
    pinOffBtn: '📌 Pin',
    duplicateBtn: '📄 Duplicate',
    deleteBtn: '🗑️ Delete',
    untitled: '(Untitled)',
    overdueLabel: '⚠️ Overdue',
    newMemoModalTitle: 'New Memo',
    editMemoModalTitle: 'Edit Memo',
    titlePlaceholder: 'Title (optional)',
    templateLabel: 'Template',
    emotionLabel: 'How do you feel?',
    noEmotion: 'No emotion',
    bodyLabel: 'Body',
    bodyPlaceholder: 'Write your memo...',
    autoSaving: 'Editing...',
    autoSaved: '✓ Auto-saved',
    aiLabel: '✨ Assist',
    suggestTitleBtn: 'Suggest title',
    extractKeywordsBtn: 'Keywords',
    wordCountLabel: (n) => `${n} chars`,
    remindLabel: '⏰ Reminder',
    flagLabel: 'Flags',
    duplicateModalBtn: '📄 Duplicate',
    deleteModalBtn: '🗑️ Delete',
    cancelBtn: 'Cancel',
    saveBtn: 'Save',
    tplFree: 'Free note',
    tplPrep: 'PREP note',
    tplProblem: 'Problem / Cause / Solution',
    tplTodo: 'To-Do list',
    tplIdea: 'Idea organizer',
    tplReview: 'Retrospective',
    tplPrepContent: '[Conclusion]\n\n\n[Reason]\n\n\n[Example]\n\n\n[Summary]\n',
    tplProblemContent: '[Problem]\n\n\n[Cause]\n\n\n[Solution]\n',
    tplTodoContent: '[Tasks]\n- \n- \n\n[Priority]\nHigh / Medium / Low\n\n[Deadline]\n\n[Notes]\n',
    tplIdeaContent: '[Idea name]\n\n\n[Background]\n\n\n[Application]\n\n\n[Next action]\n',
    tplReviewContent: '[What went well]\n\n\n[What to improve]\n\n\n[Next steps]\n',
    emo_happy: 'Happy', emo_calm: 'Calm', emo_normal: 'Okay',
    emo_sad: 'Down', emo_angry: 'Frustrated', emo_tired: 'Tired', emo_idea: 'Inspired',
    toastQuickSaved: 'Quick memo saved ⚡',
    toastSaved: 'Memo saved',
    toastUpdated: 'Memo updated',
    toastDeleted: 'Memo deleted',
    toastDuplicated: 'Memo duplicated',
    toastExported: 'Backup saved ⬇️',
    toastImported: (n) => `${n} memo${n !== 1 ? 's' : ''} imported ⬆️`,
    toastEmptyQuick: 'Please enter a memo',
    toastEmptyMemo: 'Please enter a title or body',
    toastStorageError: 'Failed to save (storage may be full)',
    toastImportNoMemos: 'No importable memos found',
    toastImportFail: 'Import failed (invalid file format)',
    aiNoBody: 'Please enter body text first',
    aiTitlePrefix: (s) => `Suggested: "${s}"  `,
    aiTitleApply: 'Apply',
    aiTitleApplied: '✓ Title applied',
    aiNoKeywords: 'Could not extract keywords',
    aiKeywordsResult: (kw) => `Keywords: ${kw}`,
    confirmDelete: (title) => `Delete "${title}"?\nThis cannot be undone.`,
    confirmImport: (n) => `Import ${n} memo${n !== 1 ? 's' : ''}?\nExisting memos will be kept.`,
    confirmTemplate: 'Apply template?\nThis will overwrite the current body.',
    justNow: 'just now',
    minutesAgo: (m) => `${m}m ago`,
    hoursAgo: (h) => `${h}h ago`,
  }
};

// 感情絵文字 → 翻訳キーのマッピング
const EMOTION_KEYS = {
  '😊': 'emo_happy', '😌': 'emo_calm', '😐': 'emo_normal',
  '😢': 'emo_sad',   '😡': 'emo_angry', '😴': 'emo_tired', '💡': 'emo_idea'
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
  lang: 'ja',
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
// 翻訳ヘルパー
// ===========================

/**
 * 現在の言語で翻訳文字列を返す
 * @param {string} key - 翻訳キー
 * @param {...any} args - 関数型翻訳の引数
 * @returns {string} 翻訳された文字列
 */
function t(key, ...args) {
  const tr = TRANSLATIONS[settings.lang] || TRANSLATIONS.ja;
  const val = (key in tr) ? tr[key] : TRANSLATIONS.ja[key];
  if (val === undefined) return key;
  if (typeof val === 'function') return val(...args);
  return val;
}

/**
 * 現在の言語でのテンプレート定義を返す
 * @returns {Object} テンプレートオブジェクト
 */
function getTemplates() {
  return {
    free:    { label: t('tplFree'),    content: '' },
    prep:    { label: t('tplPrep'),    content: t('tplPrepContent') },
    problem: { label: t('tplProblem'), content: t('tplProblemContent') },
    todo:    { label: t('tplTodo'),    content: t('tplTodoContent') },
    idea:    { label: t('tplIdea'),    content: t('tplIdeaContent') },
    review:  { label: t('tplReview'), content: t('tplReviewContent') },
  };
}

/**
 * 感情絵文字のラベルを取得する
 * @param {string} emoji - 感情絵文字
 * @returns {string} 感情ラベル
 */
function getEmotionLabel(emoji) {
  return t(EMOTION_KEYS[emoji] || '') || '';
}

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
  } catch {
    showToast(t('toastStorageError'));
  }
}

/** 設定をlocalStorageから読み込む */
function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
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
  memos[idx] = { ...memos[idx], ...data, updatedAt: new Date().toISOString() };
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
    isPinned: false
  });
  memos.unshift(copy);
  saveMemos();
  showToast(t('toastDuplicated'));
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

  let filtered = memos.filter(memo => {
    if (searchQuery) {
      const inTitle = memo.title.toLowerCase().includes(searchQuery);
      const inBody = memo.body.toLowerCase().includes(searchQuery);
      if (!inTitle && !inBody) return false;
    }
    if (settings.filterEmotion !== 'all') {
      if (settings.filterEmotion === 'none') {
        if (memo.emotion) return false;
      } else {
        if (memo.emotion !== settings.filterEmotion) return false;
      }
    }
    if (settings.filterTemplate !== 'all') {
      if (memo.template !== settings.filterTemplate) return false;
    }
    if (settings.filterFavorite && !memo.isFavorite) return false;
    if (settings.filterRemind && !memo.remindAt) return false;
    return true;
  });

  function sortList(list) {
    const sorted = [...list];
    switch (settings.sortOrder) {
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'updated':
        return sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      case 'favorite':
        return sorted.sort((a, b) =>
          (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0) ||
          new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }

  if (settings.sortOrder === 'favorite') return sortList(filtered);

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

  document.getElementById('memoCount').textContent = t('memoCount', filtered.length);

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-text">${t('emptyState')}</div>
      </div>
    `;
    return;
  }

  const hasPinned = filtered.some(m => m.isPinned);
  const hasUnpinned = filtered.some(m => !m.isPinned);
  const showDividers = hasPinned && hasUnpinned && settings.sortOrder !== 'favorite';

  let html = '';
  if (showDividers) {
    html += `<div class="pinned-divider">${t('pinnedLabel')}</div>`;
    filtered.filter(m => m.isPinned).forEach(memo => { html += buildMemoCardHtml(memo); });
    html += `<div class="pinned-divider">${t('othersLabel')}</div>`;
    filtered.filter(m => !m.isPinned).forEach(memo => { html += buildMemoCardHtml(memo); });
  } else {
    filtered.forEach(memo => { html += buildMemoCardHtml(memo); });
  }

  list.innerHTML = html;

  // カードにイベントリスナーを設定
  list.querySelectorAll('.memo-card').forEach(card => {
    const id = card.dataset.id;

    card.querySelector('.memo-card-clickable').addEventListener('click', () => openEditor(id));

    card.querySelector('.btn-edit')?.addEventListener('click', e => {
      e.stopPropagation(); openEditor(id);
    });
    card.querySelector('.btn-delete')?.addEventListener('click', e => {
      e.stopPropagation(); confirmDelete(id);
    });
    card.querySelector('.btn-duplicate')?.addEventListener('click', e => {
      e.stopPropagation(); duplicateMemo(id);
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
  const templates = getTemplates();
  const templateLabel = templates[memo.template]?.label || '';
  const bodyPreview = memo.body.slice(0, 150);

  const titleHtml = memo.title
    ? `<span class="memo-card-title">${escapeHtml(memo.title)}</span>`
    : `<span class="memo-card-title untitled">${t('untitled')}</span>`;

  const flagsHtml = [
    memo.isFavorite ? '<span class="flag-badge" title="お気に入り">⭐</span>' : '',
    memo.isPinned   ? '<span class="flag-badge" title="ピン留め">📌</span>'  : ''
  ].join('');

  let remindHtml = '';
  if (memo.remindAt) {
    const isOverdue = new Date(memo.remindAt) < new Date();
    const label = isOverdue ? t('overdueLabel') : `⏰ ${formatDate(memo.remindAt)}`;
    remindHtml = `<span class="remind-chip ${isOverdue ? 'overdue' : ''}">${escapeHtml(label)}</span>`;
  }

  const emotionLabel = getEmotionLabel(memo.emotion);

  return `
    <div class="memo-card" data-id="${memo.id}" data-emotion="${memo.emotion || ''}">
      <div class="memo-card-clickable">
        <div class="memo-card-header">
          ${titleHtml}
          <div class="memo-card-flags">${flagsHtml}</div>
        </div>
        <div class="memo-card-meta">
          ${memo.emotion ? `<span class="emotion-chip" title="${escapeHtml(emotionLabel)}">${memo.emotion}</span>` : ''}
          ${memo.template !== 'free' ? `<span class="template-chip">${escapeHtml(templateLabel)}</span>` : ''}
          ${remindHtml}
          <span class="meta-chip">📅 ${createdLabel}</span>
          ${updatedLabel ? `<span class="meta-chip">✏️ ${updatedLabel}</span>` : ''}
        </div>
        ${bodyPreview ? `<div class="memo-card-body">${escapeHtml(bodyPreview)}</div>` : ''}
      </div>
      <div class="memo-card-actions">
        <button class="card-btn btn-edit">${t('editBtn')}</button>
        <button class="card-btn btn-favorite ${memo.isFavorite ? 'btn-active' : ''}">
          ${memo.isFavorite ? t('favoriteOnBtn') : t('favoriteOffBtn')}
        </button>
        <button class="card-btn btn-pin ${memo.isPinned ? 'pin-active' : ''}">
          ${memo.isPinned ? t('pinOnBtn') : t('pinOffBtn')}
        </button>
        <button class="card-btn btn-duplicate">${t('duplicateBtn')}</button>
        <button class="card-btn danger btn-delete">${t('deleteBtn')}</button>
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

  const titleInput   = document.getElementById('memoTitle');
  const bodyInput    = document.getElementById('memoBody');
  const tplSelect    = document.getElementById('memoTemplate');
  const emoSelect    = document.getElementById('memoEmotion');
  const remindInput  = document.getElementById('memoRemind');
  const btnFavorite  = document.getElementById('btnFavorite');
  const btnPin       = document.getElementById('btnPin');
  const btnDuplicate = document.getElementById('btnDuplicate');
  const btnDelete    = document.getElementById('btnDeleteInModal');
  const aiResult     = document.getElementById('aiResult');

  aiResult.innerHTML = '';
  suggestedTitle = '';

  if (id) {
    const memo = memos.find(m => m.id === id);
    if (!memo) return;
    document.getElementById('modalTitle').textContent = t('editMemoModalTitle');
    titleInput.value   = memo.title;
    bodyInput.value    = memo.body;
    tplSelect.value    = memo.template;
    emoSelect.value    = memo.emotion;
    remindInput.value  = memo.remindAt ? memo.remindAt.slice(0, 16) : '';
    btnFavorite.dataset.active = String(memo.isFavorite);
    btnPin.dataset.active      = String(memo.isPinned);
    btnDuplicate.style.display = '';
    btnDelete.style.display    = '';
  } else {
    document.getElementById('modalTitle').textContent = t('newMemoModalTitle');
    titleInput.value   = '';
    bodyInput.value    = getTemplates()[settings.lastTemplate]?.content || '';
    tplSelect.value    = settings.lastTemplate;
    emoSelect.value    = '';
    remindInput.value  = '';
    btnFavorite.dataset.active = 'false';
    btnPin.dataset.active      = 'false';
    btnDuplicate.style.display = 'none';
    btnDelete.style.display    = 'none';
  }

  updateWordCount();
  document.getElementById('autosaveIndicator').textContent = '';
  document.getElementById('editorModal').style.display = 'flex';
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
  const title     = document.getElementById('memoTitle').value;
  const body      = document.getElementById('memoBody').value;
  const template  = document.getElementById('memoTemplate').value;
  const emotion   = document.getElementById('memoEmotion').value;
  const remindRaw = document.getElementById('memoRemind').value;
  const remindAt  = remindRaw ? new Date(remindRaw).toISOString() : null;
  const isFavorite = document.getElementById('btnFavorite').dataset.active === 'true';
  const isPinned   = document.getElementById('btnPin').dataset.active === 'true';

  if (!title.trim() && !body.trim()) {
    showToast(t('toastEmptyMemo'));
    return;
  }

  if (editingId) {
    updateMemo(editingId, { title: title.trim(), body: body.trim(), emotion, template, remindAt, isFavorite, isPinned });
    showToast(t('toastUpdated'));
  } else {
    const memo = createMemo({ title, body, emotion, template, remindAt, isFavorite, isPinned });
    memos.unshift(memo);
    saveMemos();
    showToast(t('toastSaved'));
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
  if (!editingId) return;
  clearAutoSave();
  document.getElementById('autosaveIndicator').textContent = t('autoSaving');
  autoSaveTimer = setTimeout(performAutoSave, 1500);
}

/** 自動保存を実行する */
function performAutoSave() {
  if (!editingId) return;
  const title     = document.getElementById('memoTitle').value;
  const body      = document.getElementById('memoBody').value;
  const template  = document.getElementById('memoTemplate').value;
  const emotion   = document.getElementById('memoEmotion').value;
  const remindRaw = document.getElementById('memoRemind').value;
  const remindAt  = remindRaw ? new Date(remindRaw).toISOString() : null;
  const isFavorite = document.getElementById('btnFavorite').dataset.active === 'true';
  const isPinned   = document.getElementById('btnPin').dataset.active === 'true';
  updateMemo(editingId, { title: title.trim(), body: body.trim(), emotion, template, remindAt, isFavorite, isPinned });
  document.getElementById('autosaveIndicator').textContent = t('autoSaved');
}

/** 自動保存タイマーをキャンセルする */
function clearAutoSave() {
  if (autoSaveTimer) { clearTimeout(autoSaveTimer); autoSaveTimer = null; }
}

// ===========================
// クイックメモ
// ===========================

/** クイックメモを保存する */
function saveQuickMemo() {
  const text = document.getElementById('quickMemoText').value.trim();
  if (!text) { showToast(t('toastEmptyQuick')); return; }

  const memo = createMemo({ body: text });
  memos.unshift(memo);
  saveMemos();

  const el = document.getElementById('quickMemoText');
  el.value = '';
  el.style.height = '';
  showToast(t('toastQuickSaved'));
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

  const title = memo.title || t('untitled');
  if (!confirm(t('confirmDelete', title))) return;

  deleteMemo(id);
  showToast(t('toastDeleted'));
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

  if (!body) { aiResult.textContent = t('aiNoBody'); return; }

  const lines = body
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.match(/^【.*】$/) && !l.match(/^\[.*\]$/) && !l.match(/^[-・*#\s]*$/));

  let candidate = lines.length > 0
    ? lines[0].replace(/^[-・*#→▶\s]+/, '').trim().slice(0, 30)
    : body.replace(/\s+/g, ' ').trim().slice(0, 25);

  suggestedTitle = candidate;

  aiResult.innerHTML = '';
  aiResult.appendChild(document.createTextNode(t('aiTitlePrefix', candidate)));

  const applyBtn = document.createElement('button');
  applyBtn.className = 'btn-ai';
  applyBtn.textContent = t('aiTitleApply');
  applyBtn.addEventListener('click', () => {
    document.getElementById('memoTitle').value = suggestedTitle;
    aiResult.textContent = t('aiTitleApplied');
  });
  aiResult.appendChild(applyBtn);
}

/** 本文からキーワードを抽出する */
function extractKeywordsFromBody() {
  const body = document.getElementById('memoBody').value.trim();
  const aiResult = document.getElementById('aiResult');

  if (!body) { aiResult.textContent = t('aiNoBody'); return; }

  const stopWords = new Set([
    'こと', 'ため', 'もの', 'これ', 'それ', 'あれ', 'この', 'その', 'あの',
    'ここ', 'そこ', 'あそこ', 'いう', 'なる', 'する', 'ある', 'いる', 'できる',
    'から', 'まで', 'より', 'ので', 'のに', 'ては', 'など', 'また', 'さらに',
    'そして', 'しかし', 'ただ', 'もし', 'すでに', '以下', '以上', '場合',
    '必要', '次に', '最後', 'つまり', 'しかも', 'ただし', 'なお', '以外',
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'to', 'of', 'in', 'for', 'on', 'with', 'as', 'by', 'at', 'this', 'that'
  ]);

  const words = body
    .replace(/[【】「」『』（）()\[\]、。\n\r\t!?！？]/g, ' ')
    .split(/\s+/)
    .map(w => w.replace(/[^\u3000-\u9FFF\u30A0-\u30FF\u3040-\u309F\w]/g, '').trim())
    .filter(w => w.length >= 2 && !stopWords.has(w.toLowerCase()));

  const freq = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });

  const keywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word]) => `#${word}`);

  aiResult.textContent = keywords.length > 0
    ? t('aiKeywordsResult', keywords.join('  '))
    : t('aiNoKeywords');
}

/** 文字数カウントを更新する */
function updateWordCount() {
  const body = document.getElementById('memoBody').value;
  document.getElementById('wordCount').textContent = t('wordCountLabel', body.length);
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
  const data = { version: 1, exportedAt: new Date().toISOString(), memos };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `memopad_backup_${formatDateForFileName(new Date())}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(t('toastExported'));
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
      let imported = Array.isArray(data) ? data : (data.memos && Array.isArray(data.memos) ? data.memos : null);
      if (!imported) throw new Error('Invalid format');

      imported = imported.filter(m =>
        m && typeof m === 'object' && typeof m.id === 'string' &&
        (m.title !== undefined || m.body !== undefined)
      );

      if (imported.length === 0) { showToast(t('toastImportNoMemos')); return; }
      if (!confirm(t('confirmImport', imported.length))) return;

      const existingIds = new Set(memos.map(m => m.id));
      const newMemos = imported.filter(m => !existingIds.has(m.id));
      memos = [...newMemos, ...memos];
      saveMemos();
      renderMemoList();
      showToast(t('toastImported', newMemos.length));
    } catch {
      showToast(t('toastImportFail'));
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
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===========================
// ユーティリティ
// ===========================

/**
 * ISO日時文字列を読みやすい形式に変換する（過去は相対、未来は絶対表示）
 * @param {string} isoStr - ISO 8601形式の日時文字列
 * @returns {string} フォーマットされた日時文字列
 */
function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const now = new Date();
  const diffMs = now - d;

  // 過去の日時のみ相対表示（未来の日時は絶対表示）
  if (diffMs >= 0 && diffMs < 60 * 1000) return t('justNow');
  if (diffMs >= 0 && diffMs < 60 * 60 * 1000) return t('minutesAgo', Math.floor(diffMs / 60000));
  if (diffMs >= 0 && diffMs < 24 * 60 * 60 * 1000) return t('hoursAgo', Math.floor(diffMs / 3600000));

  const y  = d.getFullYear();
  const mo = d.getMonth() + 1;
  const day = d.getDate();
  const h  = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');

  if (y === now.getFullYear()) return `${mo}/${day} ${h}:${min}`;
  return `${y}/${mo}/${day}`;
}

/**
 * ファイル名用の日付文字列を生成する
 * @param {Date} d - 日付オブジェクト
 * @returns {string} YYYYMMDD形式の文字列
 */
function formatDateForFileName(d) {
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, '0');
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
// i18n 適用
// ===========================

/** 全UIテキストを現在の言語で更新する */
function applyI18n() {
  const id = s => document.getElementById(s);

  // <html lang="..."> 更新
  document.getElementById('htmlRoot').lang = settings.lang;

  // クイックメモ
  document.querySelector('.quick-memo-label').textContent = t('quickMemoLabel');
  document.querySelector('.quick-memo-hint').textContent   = t('quickMemoHint');
  id('quickMemoText').placeholder = t('quickMemoPlaceholder');
  id('btnQuickSave').textContent  = t('quickMemoSaveBtn');

  // 新規メモボタン
  const newBtn = id('btnNewMemo');
  newBtn.innerHTML = `<span class="btn-new-memo-icon">+</span> ${t('newMemoBtn')}`;

  // 検索
  id('searchInput').placeholder = t('searchPlaceholder');

  // フィルタラベル
  const lfe = id('labelFilterEmotion');   if (lfe) lfe.textContent = t('emotionFilterLabel');
  const lft = id('labelFilterTemplate');  if (lft) lft.textContent = t('templateFilterLabel');
  const ls  = id('labelSort');            if (ls)  ls.textContent  = t('sortLabel');
  const lto = id('labelFilterToggle');    if (lto) lto.textContent = t('filterToggleLabel');

  // 感情ピル「すべて」「なし」
  const allPill  = document.querySelector('[data-emotion="all"]');
  const nonePill = document.querySelector('[data-emotion="none"]');
  if (allPill)  allPill.textContent  = t('emotionAll');
  if (nonePill) nonePill.textContent = t('emotionNone');

  // テンプレートフィルタ select
  const tplFilter = id('templateFilter');
  if (tplFilter) {
    const tpls = getTemplates();
    tplFilter.innerHTML = `
      <option value="all">${t('allTemplates')}</option>
      <option value="free">${tpls.free.label}</option>
      <option value="prep">${tpls.prep.label}</option>
      <option value="problem">${tpls.problem.label}</option>
      <option value="todo">${tpls.todo.label}</option>
      <option value="idea">${tpls.idea.label}</option>
      <option value="review">${tpls.review.label}</option>
    `;
    tplFilter.value = settings.filterTemplate;
  }

  // 並び替え select
  const sortSel = id('sortOrder');
  if (sortSel) {
    sortSel.innerHTML = `
      <option value="newest">${t('sortNewest')}</option>
      <option value="oldest">${t('sortOldest')}</option>
      <option value="updated">${t('sortUpdated')}</option>
      <option value="favorite">${t('sortFavoriteFirst')}</option>
      <option value="pinned">${t('sortPinnedFirst')}</option>
    `;
    sortSel.value = settings.sortOrder;
  }

  // トグルフィルタボタン
  id('filterFavorite').textContent = t('filterFavBtn');
  id('filterRemind').textContent   = t('filterRemindBtn');

  // モーダル内フォームラベル
  const lt  = id('labelTemplate'); if (lt)  lt.textContent  = t('templateLabel');
  const le  = id('labelEmotion');  if (le)  le.textContent  = t('emotionLabel');
  const lb  = id('labelBody');     if (lb)  lb.textContent  = t('bodyLabel');
  const lr  = id('labelRemind');   if (lr)  lr.textContent  = t('remindLabel');
  const lf  = id('labelFlag');     if (lf)  lf.textContent  = t('flagLabel');

  // テンプレート select（エディタモーダル）
  const memoTpl = id('memoTemplate');
  if (memoTpl) {
    const currentVal = memoTpl.value;
    const tpls = getTemplates();
    memoTpl.innerHTML = `
      <option value="free">${tpls.free.label}</option>
      <option value="prep">${tpls.prep.label}</option>
      <option value="problem">${tpls.problem.label}</option>
      <option value="todo">${tpls.todo.label}</option>
      <option value="idea">${tpls.idea.label}</option>
      <option value="review">${tpls.review.label}</option>
    `;
    memoTpl.value = currentVal;
  }

  // 感情 select（エディタモーダル）
  const memoEmo = id('memoEmotion');
  if (memoEmo) {
    const currentVal = memoEmo.value;
    memoEmo.innerHTML = `
      <option value="">${t('noEmotion')}</option>
      <option value="😊">😊 ${t('emo_happy')}</option>
      <option value="😌">😌 ${t('emo_calm')}</option>
      <option value="😐">😐 ${t('emo_normal')}</option>
      <option value="😢">😢 ${t('emo_sad')}</option>
      <option value="😡">😡 ${t('emo_angry')}</option>
      <option value="😴">😴 ${t('emo_tired')}</option>
      <option value="💡">💡 ${t('emo_idea')}</option>
    `;
    memoEmo.value = currentVal;
  }

  // プレースホルダー
  id('memoTitle').placeholder = t('titlePlaceholder');
  id('memoBody').placeholder  = t('bodyPlaceholder');

  // AIアシスト
  document.querySelector('.ai-label').textContent = t('aiLabel');
  id('btnSuggestTitle').textContent    = t('suggestTitleBtn');
  id('btnExtractKeywords').textContent = t('extractKeywordsBtn');
  updateWordCount();

  // モーダルフッター
  id('btnDuplicate').textContent    = t('duplicateModalBtn');
  id('btnDeleteInModal').textContent = t('deleteModalBtn');
  id('btnCancelModal').textContent  = t('cancelBtn');
  id('btnSaveMemo').textContent     = t('saveBtn');

  // モーダルタイトルを再セット（開いている場合）
  const modal = id('editorModal');
  if (modal.style.display !== 'none') {
    id('modalTitle').textContent = editingId ? t('editMemoModalTitle') : t('newMemoModalTitle');
  }

  // 🌐ボタンのラベルを切り替え
  id('btnLang').title = settings.lang === 'ja' ? 'Switch to English' : '日本語に切り替え';

  // メモ一覧を再描画
  renderMemoList();
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
        '💾 バックアップ → ヘッダーの ⬇️ でJSONを保存\n' +
        '🌐 言語切替 → ヘッダーの 🌐 で日英切り替え',
      emotion: '😊', template: 'free',
      createdAt: d1.toISOString(), updatedAt: d1.toISOString(),
      remindAt: null, isFavorite: true, isPinned: true
    },
    {
      id: 'sample_prep',
      title: '朝の読書習慣を続ける理由',
      body: '【結論】\n毎朝30分の読書を続ける\n\n' +
        '【理由】\n情報収集と思考整理に読書習慣が効果的だから\n\n' +
        '【具体例】\n先週から試してみて、仕事前に頭がスッキリする感覚があった。\n\n' +
        '【まとめ】\n来月末まで継続して、効果を振り返ってみる。',
      emotion: '💡', template: 'prep',
      createdAt: d2.toISOString(), updatedAt: d2.toISOString(),
      remindAt: null, isFavorite: false, isPinned: false
    },
    {
      id: 'sample_emotion',
      title: '今日の気持ちメモ',
      body: '午後から少し疲れてきた。\n締め切りが近くてプレッシャーを感じている。\n\nでも、昨日より確実に前進はしている。\n今夜は早めに休んで、明日またがんばろう。',
      emotion: '😴', template: 'free',
      createdAt: d3.toISOString(), updatedAt: d3.toISOString(),
      remindAt: null, isFavorite: false, isPinned: false
    },
    {
      id: 'sample_future',
      title: '半年後の自分へ',
      body: '今日、新しい一歩を踏み出すと決めた。\n\n怖くても、不安でも、あの時の自分は前を向いた。\n半年後に読み返したとき、どこまで来れているかな？\n\nきっと大丈夫。今の自分を誇りに思う。',
      emotion: '😊', template: 'free',
      createdAt: now.toISOString(), updatedAt: now.toISOString(),
      remindAt: future.toISOString(), isFavorite: true, isPinned: false
    }
  ];
}

// ===========================
// イベントリスナー登録
// ===========================

/** 全イベントリスナーを初期化する */
function initEventListeners() {

  // ---- ヘッダー ----
  document.getElementById('btnLang').addEventListener('click', () => {
    settings.lang = settings.lang === 'ja' ? 'en' : 'ja';
    saveSettings();
    applyI18n();
  });

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
    if (file) { importMemos(file); e.target.value = ''; }
  });

  // ---- クイックメモ ----
  document.getElementById('btnQuickSave').addEventListener('click', saveQuickMemo);

  document.getElementById('quickMemoText').addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      saveQuickMemo();
    }
  });

  document.getElementById('quickMemoText').addEventListener('input', e => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  });

  // ---- 新規メモボタン ----
  document.getElementById('btnNewMemo').addEventListener('click', () => openEditor());

  // ---- 検索 ----
  const searchInput    = document.getElementById('searchInput');
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

  // ---- 感情フィルタ ----
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

  document.getElementById('editorModal').addEventListener('click', e => {
    if (e.target === document.getElementById('editorModal')) closeEditor();
  });

  // ---- エディタ内フォーム ----
  document.getElementById('memoTemplate').addEventListener('change', e => {
    const newTemplate = e.target.value;
    const body = document.getElementById('memoBody').value;
    const templateContent = getTemplates()[newTemplate]?.content || '';
    if (!body.trim() || !templateContent || confirm(t('confirmTemplate'))) {
      document.getElementById('memoBody').value = templateContent;
      updateWordCount();
    }
  });

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

  document.getElementById('memoBody').addEventListener('input', () => {
    updateWordCount();
    scheduleAutoSave();
  });

  document.getElementById('memoTitle').addEventListener('input', scheduleAutoSave);

  // ---- AIアシスト ----
  document.getElementById('btnSuggestTitle').addEventListener('click', suggestTitleFromBody);
  document.getElementById('btnExtractKeywords').addEventListener('click', extractKeywordsFromBody);

  // ---- キーボードショートカット ----
  document.addEventListener('keydown', e => {
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
  loadSettings();
  memos = loadMemos();

  // 初回起動時はサンプルメモを追加
  if (memos.length === 0) {
    memos = createSampleMemos();
    saveMemos();
  }

  applyDarkMode();

  // UI状態を設定値に合わせる
  document.getElementById('filterFavorite').dataset.active = String(settings.filterFavorite);
  document.getElementById('filterRemind').dataset.active   = String(settings.filterRemind);

  // 感情フィルタのピルを復元
  document.querySelectorAll('#emotionFilter .pill').forEach(p => {
    p.classList.toggle('pill-active', p.dataset.emotion === settings.filterEmotion);
  });

  initEventListeners();

  // i18n適用（テキスト・セレクトを現在の言語で初期化）
  applyI18n();

  // Service Workerを登録（PWA対応）
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(err => {
      console.warn('Service Worker の登録に失敗しました:', err);
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
