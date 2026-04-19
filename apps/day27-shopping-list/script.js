'use strict';

/* ================================================================
   I18N
   ================================================================ */
function pad(n) { return String(n).padStart(2, '0'); }

const I18N = {
  ja: {
    appTitle: '🛒 買い物リスト',
    langToggle: 'EN',
    htmlLang: 'ja',
    metaTitle: '買い物リスト',
    emptyListTitle: '買い物リストがありません',
    emptyListSub: '右下のボタンから作成しましょう',
    sortUpdated: '更新日順',
    sortCreated: '作成日順',
    sortNameLabel: '名前順',
    itemsUnit: '件',
    unpurchasedLabel: '未購入',
    progressLabel: (done, total) => `${done} / ${total} 購入済み`,
    searchPlaceholder: '検索...',
    categoryAll: 'カテゴリ',
    shopAll: '店舗',
    sortDefault: '登録順',
    sortItemName: '商品名順',
    sortCategoryOpt: 'カテゴリ順',
    sortShopOpt: '店舗順',
    emptyItemTitle: '商品がありません',
    emptyItemSub: '下の入力欄から追加しましょう',
    checkedSectionLabel: '購入済み',
    deleteCheckedBtn: '一括削除',
    quickAddPlaceholder: '商品を追加...',
    addBtnLabel: '追加',
    bulkOpenBtnLabel: 'まとめて追加',
    templateOpenBtnLabel: 'テンプレート',
    menuRename: 'リスト名を変更',
    menuDuplicate: 'リストを複製',
    menuUncheck: '全チェックを外す',
    menuDeleteItems: '全項目削除',
    menuDeleteList: 'リストを削除',
    editModalTitle: '商品を編集',
    addModalTitle: '商品を追加',
    labelItemName: '商品名',
    labelQuantity: '数量',
    labelCategory: 'カテゴリ',
    labelShop: '店舗',
    labelMemo: 'メモ',
    quantityPlaceholder: '例：2個',
    memoPlaceholder: 'メモ',
    saveBtn: '保存',
    cancelBtn: 'キャンセル',
    bulkModalTitle: 'まとめて追加',
    bulkHint: '1行につき1商品を入力してください',
    bulkPlaceholder: '牛乳\n卵\nパン\nバナナ',
    bulkAddBtn: '追加',
    templateModalTitle: 'テンプレート',
    noTemplates: 'テンプレートがありません',
    templateAddSectionTitle: 'テンプレートを追加',
    templateNamePlaceholder: '商品名',
    templateQtyPlaceholder: '数量',
    templateCategoryAll: 'カテゴリ',
    templateShopAll: '店舗',
    templateAddBtnLabel: 'テンプレートに追加',
    renameModalTitle: 'リスト名を変更',
    newListModalTitle: '新しいリストを作成',
    newListLabel: 'リスト名',
    createBtn: '作成',
    confirmDeleteBtn: '削除',
    confirmCancelBtn: 'キャンセル',
    confirmDeleteListTitle: 'リストを削除',
    confirmDeleteListMsg: (name) => `「${name}」を削除しますか？`,
    confirmDeleteItemTitle: '削除',
    confirmDeleteItemMsg: (name) => `「${name}」を削除しますか？`,
    confirmDeleteCheckedTitle: '購入済みを削除',
    confirmDeleteCheckedMsg: '購入済みの商品を全て削除しますか？',
    confirmDeleteAllTitle: '全項目削除',
    confirmDeleteAllMsg: '全ての商品を削除しますか？',
    toastDuplicated: 'リストを複製しました',
    toastUncheckAll: '全チェックを外しました',
    defaultListName: () => {
      const d = new Date();
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} 買い物リスト`;
    },
    duplicateSuffix: ' のコピー',
    defaultCategories: ['食品', '飲料', '冷凍食品', '調味料', '日用品', '薬・衛生用品', 'その他'],
    defaultShops: ['スーパー', 'ドラッグストア', '100円ショップ', 'コンビニ', 'その他'],
    unset: '未設定',
    helpModalTitle: '使い方',
    helpItems: [
      { icon: '🛒', title: 'リストを作成', desc: '右下の ＋ ボタンをタップして新しいリストを作成します。' },
      { icon: '✏️', title: '商品を追加', desc: '下の入力欄に商品名を入力して「追加」ボタンで登録します。Enterキーでも追加できます。' },
      { icon: '≡', title: 'まとめて追加', desc: '「まとめて追加」ボタンから複数の商品を一度に登録できます。1行につき1商品を入力してください。' },
      { icon: '✅', title: 'チェックして購入済みに', desc: '商品の○をタップすると購入済みになり、下部の「購入済み」エリアに移動します。' },
      { icon: '📋', title: 'リストを複製', desc: '一覧画面の 📋 ボタン、または詳細画面の ⋮ メニューからリストを複製できます。過去のリストを再利用するときに便利です。' },
      { icon: '☆', title: 'テンプレート', desc: 'よく買う商品を登録しておくと、次回からワンタップで追加できます。' },
      { icon: '🔍', title: '検索・絞り込み', desc: '商品名で検索したり、カテゴリ・店舗で絞り込みができます。' },
      { icon: '🌐', title: '日英切り替え', desc: 'ヘッダーの EN ボタンで英語表示に切り替えられます。' },
    ],
  },
  en: {
    appTitle: '🛒 Shopping List',
    langToggle: 'JP',
    htmlLang: 'en',
    metaTitle: 'Shopping List',
    emptyListTitle: 'No shopping lists yet',
    emptyListSub: 'Tap + to create your first list',
    sortUpdated: 'By last updated',
    sortCreated: 'By created date',
    sortNameLabel: 'By name',
    itemsUnit: ' items',
    unpurchasedLabel: 'Left',
    progressLabel: (done, total) => `${done} / ${total} purchased`,
    searchPlaceholder: 'Search...',
    categoryAll: 'Category',
    shopAll: 'Shop',
    sortDefault: 'Added order',
    sortItemName: 'By name',
    sortCategoryOpt: 'By category',
    sortShopOpt: 'By shop',
    emptyItemTitle: 'No items yet',
    emptyItemSub: 'Add items using the input below',
    checkedSectionLabel: 'Purchased',
    deleteCheckedBtn: 'Delete all',
    quickAddPlaceholder: 'Add item...',
    addBtnLabel: 'Add',
    bulkOpenBtnLabel: 'Bulk add',
    templateOpenBtnLabel: 'Templates',
    menuRename: 'Rename list',
    menuDuplicate: 'Duplicate list',
    menuUncheck: 'Uncheck all items',
    menuDeleteItems: 'Delete all items',
    menuDeleteList: 'Delete list',
    editModalTitle: 'Edit item',
    addModalTitle: 'Add item',
    labelItemName: 'Item name',
    labelQuantity: 'Quantity',
    labelCategory: 'Category',
    labelShop: 'Shop',
    labelMemo: 'Notes',
    quantityPlaceholder: 'e.g. 2 pcs',
    memoPlaceholder: 'Notes',
    saveBtn: 'Save',
    cancelBtn: 'Cancel',
    bulkModalTitle: 'Bulk add',
    bulkHint: 'Enter one item per line',
    bulkPlaceholder: 'Milk\nEggs\nBread\nBananas',
    bulkAddBtn: 'Add',
    templateModalTitle: 'Templates',
    noTemplates: 'No templates yet',
    templateAddSectionTitle: 'Add template',
    templateNamePlaceholder: 'Item name',
    templateQtyPlaceholder: 'Quantity',
    templateCategoryAll: 'Category',
    templateShopAll: 'Shop',
    templateAddBtnLabel: 'Save template',
    renameModalTitle: 'Rename list',
    newListModalTitle: 'New shopping list',
    newListLabel: 'List name',
    createBtn: 'Create',
    confirmDeleteBtn: 'Delete',
    confirmCancelBtn: 'Cancel',
    confirmDeleteListTitle: 'Delete list',
    confirmDeleteListMsg: (name) => `Delete "${name}"?`,
    confirmDeleteItemTitle: 'Delete item',
    confirmDeleteItemMsg: (name) => `Delete "${name}"?`,
    confirmDeleteCheckedTitle: 'Delete purchased items',
    confirmDeleteCheckedMsg: 'Delete all purchased items?',
    confirmDeleteAllTitle: 'Delete all items',
    confirmDeleteAllMsg: 'Delete all items from this list?',
    toastDuplicated: 'List duplicated',
    toastUncheckAll: 'All items unchecked',
    defaultListName: () => {
      const d = new Date();
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} Shopping List`;
    },
    duplicateSuffix: ' (copy)',
    defaultCategories: ['Food', 'Drinks', 'Frozen', 'Condiments', 'Household', 'Health & Hygiene', 'Other'],
    defaultShops: ['Supermarket', 'Drug Store', '100 Yen Shop', 'Convenience Store', 'Other'],
    unset: 'Unset',
    helpModalTitle: 'How to use',
    helpItems: [
      { icon: '🛒', title: 'Create a list', desc: 'Tap the + button at the bottom right to create a new shopping list.' },
      { icon: '✏️', title: 'Add items', desc: 'Type an item name in the bottom input and tap "Add". You can also press Enter.' },
      { icon: '≡', title: 'Bulk add', desc: 'Tap "Bulk add" to add multiple items at once. Enter one item per line.' },
      { icon: '✅', title: 'Check off items', desc: 'Tap the circle to mark an item as purchased. It moves to the "Purchased" section at the bottom.' },
      { icon: '📋', title: 'Duplicate a list', desc: 'Use the 📋 button on a list card or the ⋮ menu in detail view to duplicate a list for reuse.' },
      { icon: '☆', title: 'Templates', desc: 'Save frequently bought items as templates to add them with a single tap next time.' },
      { icon: '🔍', title: 'Search & filter', desc: 'Search by item name, or filter by category and shop.' },
      { icon: '🌐', title: 'Switch language', desc: 'Tap the JP button in the header to switch back to Japanese.' },
    ],
  }
};

/* ================================================================
   Storage Keys
   ================================================================ */
const SK = { LISTS: 'sm_lists', TEMPLATES: 'sm_templates', SETTINGS: 'sm_settings' };

/* ================================================================
   State
   ================================================================ */
const state = {
  lists: [],
  templates: [],
  categories: [],
  shops: [],
  lang: 'ja',
  settings: { listSort: 'updatedAt', itemSort: 'default' },
  currentListId: null,
  editingItemId: null,
  filterCategory: '',
  filterShop: '',
  searchQuery: '',
  confirmCallback: null,
};

/* ================================================================
   Utilities
   ================================================================ */
function genId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
function nowISO() { return new Date().toISOString(); }
function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}/${pad(d.getMonth()+1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function t(key, ...args) {
  const val = I18N[state.lang][key];
  return typeof val === 'function' ? val(...args) : (val ?? key);
}
function esc(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ================================================================
   Storage
   ================================================================ */
function save() {
  try {
    localStorage.setItem(SK.LISTS, JSON.stringify(state.lists));
    localStorage.setItem(SK.TEMPLATES, JSON.stringify(state.templates));
    localStorage.setItem(SK.SETTINGS, JSON.stringify({
      listSort: state.settings.listSort,
      itemSort: state.settings.itemSort,
      lang: state.lang,
      categories: state.categories,
      shops: state.shops,
    }));
  } catch(e) { console.warn('Save failed', e); }
}

function load() {
  try {
    const lr = localStorage.getItem(SK.LISTS);
    if (lr) state.lists = JSON.parse(lr);
    const tr = localStorage.getItem(SK.TEMPLATES);
    if (tr) state.templates = JSON.parse(tr);
    const sr = localStorage.getItem(SK.SETTINGS);
    if (sr) {
      const s = JSON.parse(sr);
      if (s.listSort)   state.settings.listSort = s.listSort;
      if (s.itemSort)   state.settings.itemSort = s.itemSort;
      if (s.lang)       state.lang = s.lang;
      if (s.categories?.length) state.categories = s.categories;
      if (s.shops?.length)      state.shops = s.shops;
    }
  } catch(e) { console.warn('Load failed', e); }
  if (!state.categories.length) state.categories = [...I18N[state.lang].defaultCategories];
  if (!state.shops.length)      state.shops = [...I18N[state.lang].defaultShops];
}

/* ================================================================
   List CRUD
   ================================================================ */
function createList(name) {
  const list = {
    id: genId('list'),
    name: (name || '').trim() || t('defaultListName'),
    createdAt: nowISO(),
    updatedAt: nowISO(),
    items: [],
  };
  state.lists.unshift(list);
  save();
  return list;
}
function renameList(id, name) {
  const l = state.lists.find(l => l.id === id);
  if (l && name.trim()) { l.name = name.trim(); l.updatedAt = nowISO(); save(); }
}
function deleteList(id) {
  state.lists = state.lists.filter(l => l.id !== id);
  save();
}
function duplicateList(id) {
  const src = state.lists.find(l => l.id === id);
  if (!src) return null;
  const copy = {
    id: genId('list'),
    name: src.name + t('duplicateSuffix'),
    createdAt: nowISO(),
    updatedAt: nowISO(),
    items: src.items.map(item => ({ ...item, id: genId('item'), checked: false, createdAt: nowISO(), updatedAt: nowISO() })),
  };
  const idx = state.lists.findIndex(l => l.id === id);
  state.lists.splice(idx + 1, 0, copy);
  save();
  return copy;
}
function getCurrentList() { return state.lists.find(l => l.id === state.currentListId) || null; }

/* ================================================================
   Item CRUD
   ================================================================ */
function addItem(listId, name, extras = {}) {
  if (!name.trim()) return null;
  const list = state.lists.find(l => l.id === listId);
  if (!list) return null;
  const item = {
    id: genId('item'),
    name: name.trim(),
    quantity: extras.quantity ?? '',
    memo: extras.memo ?? '',
    category: extras.category ?? '',
    shop: extras.shop ?? '',
    checked: false,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };
  list.items.push(item);
  list.updatedAt = nowISO();
  save();
  return item;
}
function updateItem(listId, itemId, updates) {
  const list = state.lists.find(l => l.id === listId);
  if (!list) return;
  const item = list.items.find(i => i.id === itemId);
  if (!item) return;
  Object.assign(item, updates, { updatedAt: nowISO() });
  list.updatedAt = nowISO();
  save();
}
function deleteItem(listId, itemId) {
  const list = state.lists.find(l => l.id === listId);
  if (!list) return;
  list.items = list.items.filter(i => i.id !== itemId);
  list.updatedAt = nowISO();
  save();
}
function toggleCheck(listId, itemId) {
  const list = state.lists.find(l => l.id === listId);
  if (!list) return;
  const item = list.items.find(i => i.id === itemId);
  if (!item) return;
  item.checked = !item.checked;
  item.updatedAt = nowISO();
  list.updatedAt = nowISO();
  save();
}
function deleteChecked(listId) {
  const list = state.lists.find(l => l.id === listId);
  if (!list) return;
  list.items = list.items.filter(i => !i.checked);
  list.updatedAt = nowISO();
  save();
}
function deleteAllItems(listId) {
  const list = state.lists.find(l => l.id === listId);
  if (!list) return;
  list.items = [];
  list.updatedAt = nowISO();
  save();
}
function uncheckAll(listId) {
  const list = state.lists.find(l => l.id === listId);
  if (!list) return;
  list.items.forEach(i => { i.checked = false; i.updatedAt = nowISO(); });
  list.updatedAt = nowISO();
  save();
}

/* ================================================================
   Template CRUD
   ================================================================ */
function addTemplate(name, extras = {}) {
  if (!name.trim()) return;
  state.templates.push({
    id: genId('tmpl'),
    name: name.trim(),
    quantity: extras.quantity ?? '',
    category: extras.category ?? '',
    shop: extras.shop ?? '',
    memo: '',
  });
  save();
}
function deleteTemplate(id) {
  state.templates = state.templates.filter(t => t.id !== id);
  save();
}
function addItemFromTemplate(listId, templateId) {
  const tmpl = state.templates.find(t => t.id === templateId);
  if (!tmpl) return;
  addItem(listId, tmpl.name, { quantity: tmpl.quantity, category: tmpl.category, shop: tmpl.shop });
}

/* ================================================================
   Filtering & Sorting
   ================================================================ */
function filteredItems(list) {
  if (!list) return [];
  let items = [...list.items];
  const q = state.searchQuery.trim().toLowerCase();
  if (q) items = items.filter(i =>
    i.name.toLowerCase().includes(q) || (i.memo && i.memo.toLowerCase().includes(q))
  );
  if (state.filterCategory) items = items.filter(i => i.category === state.filterCategory);
  if (state.filterShop)     items = items.filter(i => i.shop === state.filterShop);
  const sort = state.settings.itemSort;
  const locale = state.lang === 'ja' ? 'ja' : 'en';
  if (sort === 'name')     items.sort((a,b) => a.name.localeCompare(b.name, locale));
  if (sort === 'category') items.sort((a,b) => (a.category||'zzz').localeCompare(b.category||'zzz', locale));
  if (sort === 'shop')     items.sort((a,b) => (a.shop||'zzz').localeCompare(b.shop||'zzz', locale));
  return items;
}
function sortedLists() {
  const sort = state.settings.listSort;
  const lists = [...state.lists];
  if (sort === 'name')      lists.sort((a,b) => a.name.localeCompare(b.name));
  else if (sort === 'createdAt') lists.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  else                      lists.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return lists;
}

/* ================================================================
   Apply Translations
   ================================================================ */
function applyTranslations() {
  document.documentElement.lang = t('htmlLang');
  document.title = t('metaTitle');
  document.getElementById('app-title').textContent      = t('appTitle');
  document.getElementById('lang-btn').textContent       = t('langToggle');
  document.getElementById('empty-lists-title').textContent = t('emptyListTitle');
  document.getElementById('empty-lists-sub').textContent   = t('emptyListSub');
  document.getElementById('sort-updated').textContent   = t('sortUpdated');
  document.getElementById('sort-created').textContent   = t('sortCreated');
  document.getElementById('sort-name-lists').textContent= t('sortNameLabel');
  document.getElementById('empty-items-title').textContent = t('emptyItemTitle');
  document.getElementById('empty-items-sub').textContent   = t('emptyItemSub');
  document.getElementById('checked-section-label').textContent = t('checkedSectionLabel');
  document.getElementById('delete-checked-btn').textContent    = t('deleteCheckedBtn');
  document.getElementById('quick-add-input').placeholder = t('quickAddPlaceholder');
  document.getElementById('quick-add-btn').textContent   = t('addBtnLabel');
  document.getElementById('bulk-open-label').textContent     = t('bulkOpenBtnLabel');
  document.getElementById('template-open-label').textContent = t('templateOpenBtnLabel');
  document.getElementById('search-input').placeholder   = t('searchPlaceholder');

  const catSel  = document.getElementById('filter-category');
  const shopSel = document.getElementById('filter-shop');
  if (catSel.options[0])  catSel.options[0].textContent  = t('categoryAll');
  if (shopSel.options[0]) shopSel.options[0].textContent = t('shopAll');

  const sortSel = document.getElementById('sort-items');
  if (sortSel.options[0]) sortSel.options[0].textContent = t('sortDefault');
  if (sortSel.options[1]) sortSel.options[1].textContent = t('sortItemName');
  if (sortSel.options[2]) sortSel.options[2].textContent = t('sortCategoryOpt');
  if (sortSel.options[3]) sortSel.options[3].textContent = t('sortShopOpt');

  document.getElementById('menu-rename').textContent       = t('menuRename');
  document.getElementById('menu-duplicate').textContent    = t('menuDuplicate');
  document.getElementById('menu-uncheck').textContent      = t('menuUncheck');
  document.getElementById('menu-delete-items').textContent = t('menuDeleteItems');
  document.getElementById('menu-delete-list').textContent  = t('menuDeleteList');

  document.getElementById('label-item-name').innerHTML = `${t('labelItemName')} <span class="required">*</span>`;
  document.getElementById('label-quantity').textContent = t('labelQuantity');
  document.getElementById('label-category').textContent = t('labelCategory');
  document.getElementById('label-shop').textContent     = t('labelShop');
  document.getElementById('label-memo').textContent     = t('labelMemo');
  document.getElementById('edit-name').placeholder      = t('labelItemName');
  document.getElementById('edit-quantity').placeholder  = t('quantityPlaceholder');
  document.getElementById('edit-memo').placeholder      = t('memoPlaceholder');
  document.getElementById('edit-cancel').textContent    = t('cancelBtn');
  document.getElementById('edit-save-btn').textContent  = t('saveBtn');

  document.getElementById('bulk-modal-title').textContent  = t('bulkModalTitle');
  document.getElementById('bulk-hint').textContent         = t('bulkHint');
  document.getElementById('bulk-input').placeholder        = t('bulkPlaceholder');
  document.getElementById('bulk-cancel').textContent       = t('cancelBtn');
  document.getElementById('bulk-confirm-btn').textContent  = t('bulkAddBtn');

  document.getElementById('template-modal-title').textContent     = t('templateModalTitle');
  document.getElementById('template-add-section-title').textContent = t('templateAddSectionTitle');
  document.getElementById('template-name-input').placeholder      = t('templateNamePlaceholder');
  document.getElementById('template-qty-input').placeholder       = t('templateQtyPlaceholder');
  document.getElementById('template-add-btn').textContent         = t('templateAddBtnLabel');

  document.getElementById('rename-modal-title').textContent = t('renameModalTitle');
  document.getElementById('rename-cancel').textContent      = t('cancelBtn');
  document.getElementById('rename-save-btn').textContent    = t('saveBtn');

  document.getElementById('new-list-modal-title').textContent = t('newListModalTitle');
  document.getElementById('new-list-label').textContent       = t('newListLabel');
  document.getElementById('new-list-cancel').textContent      = t('cancelBtn');
  document.getElementById('new-list-confirm-btn').textContent = t('createBtn');

  document.getElementById('confirm-cancel-btn').textContent = t('confirmCancelBtn');
  document.getElementById('confirm-ok-btn').textContent     = t('confirmDeleteBtn');
  document.getElementById('help-modal-title').textContent   = t('helpModalTitle');
  renderHelpList();
}

/* ================================================================
   Rendering
   ================================================================ */
function renderListView() {
  const container = document.getElementById('lists-container');
  const empty     = document.getElementById('empty-lists');
  const lists     = sortedLists();

  Array.from(container.children).forEach(c => { if (c !== empty) c.remove(); });

  if (!lists.length) { empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');

  lists.forEach(list => {
    const total     = list.items.length;
    const checked   = list.items.filter(i => i.checked).length;
    const unchecked = total - checked;

    const card = document.createElement('div');
    card.className = 'list-card';
    card.innerHTML = `
      <div class="list-card-top">
        <div class="list-card-name">${esc(list.name)}</div>
        <div class="list-card-actions">
          <button class="icon-btn" data-action="rename"    data-id="${list.id}" title="${t('menuRename')}">✏️</button>
          <button class="icon-btn" data-action="duplicate" data-id="${list.id}" title="${t('menuDuplicate')}">📋</button>
          <button class="icon-btn" data-action="delete"    data-id="${list.id}" title="${t('menuDeleteList')}">🗑️</button>
        </div>
      </div>
      <div class="list-card-bottom">
        <span class="meta-badge">${total}${t('itemsUnit')}</span>
        ${unchecked > 0 ? `<span class="meta-badge unchecked">${t('unpurchasedLabel')} ${unchecked}</span>` : ''}
        <span class="meta-date">${formatDate(list.updatedAt)}</span>
      </div>`;

    card.addEventListener('click', e => {
      if (!e.target.closest('.list-card-actions')) goToDetail(list.id);
    });
    card.querySelector('[data-action="rename"]').addEventListener('click', e => {
      e.stopPropagation(); openRenameModal(list.id);
    });
    card.querySelector('[data-action="duplicate"]').addEventListener('click', e => {
      e.stopPropagation();
      duplicateList(list.id);
      showToast(t('toastDuplicated'));
      renderListView();
    });
    card.querySelector('[data-action="delete"]').addEventListener('click', e => {
      e.stopPropagation();
      showConfirm(t('confirmDeleteListTitle'), t('confirmDeleteListMsg', list.name), () => {
        deleteList(list.id); renderListView();
      });
    });
    container.appendChild(card);
  });
}

function renderDetailView() {
  const list = getCurrentList();
  if (!list) return;

  document.getElementById('detail-title').textContent = list.name;

  const allItems    = list.items;
  const checkedCnt  = allItems.filter(i => i.checked).length;
  const total       = allItems.length;
  const pct         = total > 0 ? Math.round(checkedCnt / total * 100) : 0;

  document.getElementById('progress-info').textContent   = t('progressLabel', checkedCnt, total);
  document.getElementById('progress-fill').style.width   = pct + '%';

  const items          = filteredItems(list);
  const uncheckedItems = items.filter(i => !i.checked);
  const checkedItems   = items.filter(i => i.checked);

  const uncheckedList  = document.getElementById('unchecked-list');
  const checkedList    = document.getElementById('checked-list');
  const checkedSection = document.getElementById('checked-section');
  const emptyItems     = document.getElementById('empty-items');

  uncheckedList.innerHTML = '';
  checkedList.innerHTML   = '';

  const isFiltering = state.searchQuery || state.filterCategory || state.filterShop;
  if (total === 0 && !isFiltering) {
    emptyItems.classList.remove('hidden');
  } else {
    emptyItems.classList.add('hidden');
  }

  uncheckedItems.forEach(item => uncheckedList.appendChild(makeItemEl(item, list.id)));

  if (checkedItems.length) {
    checkedSection.classList.remove('hidden');
    checkedItems.forEach(item => checkedList.appendChild(makeItemEl(item, list.id)));
  } else {
    checkedSection.classList.add('hidden');
  }

  refreshFilterOptions(list);
}

function makeItemEl(item, listId) {
  const div = document.createElement('div');
  div.className = `item-card${item.checked ? ' checked' : ''}`;

  const tags = [];
  if (item.quantity) tags.push(`<span class="item-tag qty">${esc(item.quantity)}</span>`);
  if (item.category) tags.push(`<span class="item-tag cat">${esc(item.category)}</span>`);
  if (item.shop)     tags.push(`<span class="item-tag shop">${esc(item.shop)}</span>`);

  div.innerHTML = `
    <div class="item-check${item.checked ? ' checked' : ''}"></div>
    <div class="item-body">
      <div class="item-name">${esc(item.name)}</div>
      ${tags.length ? `<div class="item-tags">${tags.join('')}</div>` : ''}
      ${item.memo ? `<div class="item-memo">${esc(item.memo)}</div>` : ''}
    </div>
    <div class="item-actions">
      <button class="icon-btn edit-btn" title="edit">✏️</button>
      <button class="icon-btn del-btn"  title="delete">🗑️</button>
    </div>`;

  div.querySelector('.item-check').addEventListener('click', () => {
    toggleCheck(listId, item.id); renderDetailView();
  });
  div.querySelector('.edit-btn').addEventListener('click', () => openEditModal(item));
  div.querySelector('.del-btn').addEventListener('click', () => {
    showConfirm(t('confirmDeleteItemTitle'), t('confirmDeleteItemMsg', item.name), () => {
      deleteItem(listId, item.id); renderDetailView();
    });
  });
  return div;
}

function refreshFilterOptions(list) {
  const cats  = new Set(list.items.map(i => i.category).filter(Boolean));
  const shops = new Set(list.items.map(i => i.shop).filter(Boolean));
  const catSel  = document.getElementById('filter-category');
  const shopSel = document.getElementById('filter-shop');
  const prevCat  = catSel.value;
  const prevShop = shopSel.value;
  catSel.innerHTML  = `<option value="">${t('categoryAll')}</option>`;
  shopSel.innerHTML = `<option value="">${t('shopAll')}</option>`;
  cats.forEach(c  => catSel.innerHTML  += `<option value="${esc(c)}">${esc(c)}</option>`);
  shops.forEach(s => shopSel.innerHTML += `<option value="${esc(s)}">${esc(s)}</option>`);
  catSel.value  = prevCat;
  shopSel.value = prevShop;
}

function populateEditSelects(item) {
  const catSel  = document.getElementById('edit-category');
  const shopSel = document.getElementById('edit-shop');
  catSel.innerHTML  = `<option value="">${t('unset')}</option>`;
  shopSel.innerHTML = `<option value="">${t('unset')}</option>`;
  state.categories.forEach(c => catSel.innerHTML  += `<option value="${esc(c)}">${esc(c)}</option>`);
  state.shops.forEach(s     => shopSel.innerHTML += `<option value="${esc(s)}">${esc(s)}</option>`);
  if (item) { catSel.value = item.category; shopSel.value = item.shop; }
}

function populateTemplateSelects() {
  const catSel  = document.getElementById('template-category-select');
  const shopSel = document.getElementById('template-shop-select');
  catSel.innerHTML  = `<option value="">${t('templateCategoryAll')}</option>`;
  shopSel.innerHTML = `<option value="">${t('templateShopAll')}</option>`;
  state.categories.forEach(c => catSel.innerHTML  += `<option value="${esc(c)}">${esc(c)}</option>`);
  state.shops.forEach(s     => shopSel.innerHTML += `<option value="${esc(s)}">${esc(s)}</option>`);
}

function renderTemplateList() {
  const container = document.getElementById('template-list');
  container.innerHTML = '';
  if (!state.templates.length) {
    container.innerHTML = `<p class="template-empty">${t('noTemplates')}</p>`;
    return;
  }
  state.templates.forEach(tmpl => {
    const sub = [tmpl.quantity, tmpl.category, tmpl.shop].filter(Boolean).join(' · ');
    const div = document.createElement('div');
    div.className = 'template-item';
    div.innerHTML = `
      <div class="template-info">
        <div class="template-name">${esc(tmpl.name)}</div>
        ${sub ? `<div class="template-sub">${esc(sub)}</div>` : ''}
      </div>
      ${state.currentListId ? `<button class="icon-btn use-tmpl" data-id="${tmpl.id}" title="use">＋</button>` : ''}
      <button class="icon-btn del-tmpl" data-id="${tmpl.id}" title="delete">🗑️</button>`;
    div.querySelector('.del-tmpl').addEventListener('click', () => { deleteTemplate(tmpl.id); renderTemplateList(); });
    if (state.currentListId) {
      div.querySelector('.use-tmpl')?.addEventListener('click', () => {
        addItemFromTemplate(state.currentListId, tmpl.id);
        renderDetailView();
        closeModal('template-modal');
      });
    }
    container.appendChild(div);
  });
}

function renderHelpList() {
  const container = document.getElementById('help-list');
  if (!container) return;
  container.innerHTML = '';
  I18N[state.lang].helpItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'help-item';
    div.innerHTML = `
      <div class="help-icon">${item.icon}</div>
      <div class="help-text">
        <div class="help-title">${esc(item.title)}</div>
        <div class="help-desc">${esc(item.desc)}</div>
      </div>`;
    container.appendChild(div);
  });
}

/* ================================================================
   Navigation
   ================================================================ */
function goToDetail(listId) {
  state.currentListId = listId;
  state.filterCategory = '';
  state.filterShop     = '';
  state.searchQuery    = '';
  document.getElementById('search-input').value = '';
  document.getElementById('filter-category').value = '';
  document.getElementById('filter-shop').value = '';
  document.getElementById('sort-items').value = state.settings.itemSort;
  document.getElementById('list-view').classList.remove('active');
  document.getElementById('detail-view').classList.add('active');
  renderDetailView();
  window.scrollTo(0, 0);
}

function goToList() {
  state.currentListId = null;
  document.getElementById('detail-view').classList.remove('active');
  document.getElementById('list-view').classList.add('active');
  renderListView();
  window.scrollTo(0, 0);
}

/* ================================================================
   Modals
   ================================================================ */
function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
  document.getElementById('overlay').classList.remove('hidden');
}
function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
  const anyOpen = document.querySelectorAll('.modal:not(.hidden)').length > 0;
  if (!anyOpen) document.getElementById('overlay').classList.add('hidden');
}

function openEditModal(item) {
  state.editingItemId = item?.id ?? null;
  document.getElementById('edit-modal-title').textContent = item ? t('editModalTitle') : t('addModalTitle');
  populateEditSelects(item);
  document.getElementById('edit-name').value     = item?.name ?? '';
  document.getElementById('edit-quantity').value = item?.quantity ?? '';
  document.getElementById('edit-memo').value     = item?.memo ?? '';
  openModal('edit-modal');
  setTimeout(() => document.getElementById('edit-name').focus(), 100);
}

function openRenameModal(listId) {
  const list = state.lists.find(l => l.id === listId);
  if (!list) return;
  document.getElementById('rename-input').value = list.name;
  document.getElementById('rename-save-btn').dataset.listId = listId;
  openModal('rename-modal');
  setTimeout(() => { const el = document.getElementById('rename-input'); el.focus(); el.select(); }, 100);
}

function showConfirm(title, msg, onOk) {
  document.getElementById('confirm-title').textContent   = title;
  document.getElementById('confirm-message').textContent = msg;
  document.getElementById('confirm-ok-btn').textContent  = t('confirmDeleteBtn');
  state.confirmCallback = onOk;
  openModal('confirm-modal');
}

/* ================================================================
   Dropdowns
   ================================================================ */
function openDropdown(id, anchor) {
  closeDropdowns();
  const dd   = document.getElementById(id);
  const rect = anchor.getBoundingClientRect();
  dd.style.top   = (rect.bottom + 4) + 'px';
  dd.style.right = (window.innerWidth - rect.right) + 'px';
  dd.style.left  = 'auto';
  dd.classList.remove('hidden');
  const overlay = document.getElementById('overlay');
  overlay.classList.remove('hidden');
  overlay.style.background = 'transparent';
}
function closeDropdowns() {
  document.querySelectorAll('.dropdown').forEach(d => d.classList.add('hidden'));
  const anyModal = document.querySelectorAll('.modal:not(.hidden)').length > 0;
  const overlay  = document.getElementById('overlay');
  if (!anyModal) { overlay.classList.add('hidden'); }
  overlay.style.background = '';
}

/* ================================================================
   Toast
   ================================================================ */
let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2200);
}

/* ================================================================
   Event Listeners
   ================================================================ */
function setupEvents() {
  // Language toggle
  document.getElementById('lang-btn').addEventListener('click', () => {
    state.lang = state.lang === 'ja' ? 'en' : 'ja';
    save();
    applyTranslations();
    renderListView();
    if (state.currentListId) renderDetailView();
  });

  // Help
  document.getElementById('help-btn').addEventListener('click', () => {
    renderHelpList();
    openModal('help-modal');
  });

  // New list
  document.getElementById('new-list-btn').addEventListener('click', () => {
    const input = document.getElementById('new-list-name-input');
    input.value = t('defaultListName');
    openModal('new-list-modal');
    setTimeout(() => { input.focus(); input.select(); }, 100);
  });
  document.getElementById('new-list-confirm-btn').addEventListener('click', () => {
    const name = document.getElementById('new-list-name-input').value;
    const list = createList(name);
    closeModal('new-list-modal');
    goToDetail(list.id);
  });
  document.getElementById('new-list-name-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('new-list-confirm-btn').click();
  });

  // Back
  document.getElementById('back-btn').addEventListener('click', goToList);

  // Detail title tap → rename
  document.getElementById('detail-title').addEventListener('click', () => {
    if (state.currentListId) openRenameModal(state.currentListId);
  });

  // Quick add
  const qInput = document.getElementById('quick-add-input');
  document.getElementById('quick-add-btn').addEventListener('click', () => {
    const name = qInput.value.trim();
    if (name && state.currentListId) { addItem(state.currentListId, name); qInput.value = ''; renderDetailView(); }
  });
  qInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('quick-add-btn').click();
  });

  // Bulk add
  document.getElementById('bulk-add-open-btn').addEventListener('click', () => {
    document.getElementById('bulk-input').value = '';
    openModal('bulk-modal');
    setTimeout(() => document.getElementById('bulk-input').focus(), 100);
  });
  document.getElementById('bulk-confirm-btn').addEventListener('click', () => {
    const lines = document.getElementById('bulk-input').value.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length && state.currentListId) { lines.forEach(name => addItem(state.currentListId, name)); renderDetailView(); }
    closeModal('bulk-modal');
  });

  // Template (from list view)
  document.getElementById('template-from-list-btn').addEventListener('click', () => {
    populateTemplateSelects(); renderTemplateList(); openModal('template-modal');
  });
  // Template (from detail view)
  document.getElementById('template-use-btn').addEventListener('click', () => {
    populateTemplateSelects(); renderTemplateList(); openModal('template-modal');
  });
  // Template add
  document.getElementById('template-add-btn').addEventListener('click', () => {
    const name = document.getElementById('template-name-input').value.trim();
    if (!name) return;
    addTemplate(name, {
      quantity: document.getElementById('template-qty-input').value.trim(),
      category: document.getElementById('template-category-select').value,
      shop:     document.getElementById('template-shop-select').value,
    });
    document.getElementById('template-name-input').value = '';
    document.getElementById('template-qty-input').value  = '';
    document.getElementById('template-category-select').value = '';
    document.getElementById('template-shop-select').value     = '';
    renderTemplateList();
  });

  // Edit save
  document.getElementById('edit-save-btn').addEventListener('click', () => {
    const name = document.getElementById('edit-name').value.trim();
    if (!name) return;
    const updates = {
      name,
      quantity: document.getElementById('edit-quantity').value.trim(),
      category: document.getElementById('edit-category').value,
      shop:     document.getElementById('edit-shop').value,
      memo:     document.getElementById('edit-memo').value.trim(),
    };
    if (state.editingItemId && state.currentListId) {
      updateItem(state.currentListId, state.editingItemId, updates);
      renderDetailView();
    }
    closeModal('edit-modal');
  });
  document.getElementById('edit-name').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('edit-save-btn').click();
  });

  // Rename save
  document.getElementById('rename-save-btn').addEventListener('click', () => {
    const listId = document.getElementById('rename-save-btn').dataset.listId;
    const name   = document.getElementById('rename-input').value.trim();
    if (name) {
      renameList(listId, name);
      if (state.currentListId === listId) document.getElementById('detail-title').textContent = name;
      renderListView();
    }
    closeModal('rename-modal');
  });
  document.getElementById('rename-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('rename-save-btn').click();
  });

  // Confirm
  document.getElementById('confirm-ok-btn').addEventListener('click', () => {
    state.confirmCallback?.(); state.confirmCallback = null; closeModal('confirm-modal');
  });
  document.getElementById('confirm-cancel-btn').addEventListener('click', () => {
    state.confirmCallback = null; closeModal('confirm-modal');
  });

  // Modal close buttons
  document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => {
    btn.addEventListener('click', e => { const id = e.currentTarget.dataset.modal; if (id) closeModal(id); });
  });

  // Overlay click
  document.getElementById('overlay').addEventListener('click', () => {
    document.querySelectorAll('.modal:not(.hidden)').forEach(m => closeModal(m.id));
    closeDropdowns();
  });

  // Delete checked
  document.getElementById('delete-checked-btn').addEventListener('click', () => {
    showConfirm(t('confirmDeleteCheckedTitle'), t('confirmDeleteCheckedMsg'), () => {
      deleteChecked(state.currentListId); renderDetailView();
    });
  });

  // Detail menu
  document.getElementById('detail-menu-btn').addEventListener('click', e => {
    e.stopPropagation(); openDropdown('detail-menu', e.currentTarget);
  });
  document.getElementById('detail-menu').addEventListener('click', e => {
    const action = e.target.dataset.action;
    if (!action) return;
    closeDropdowns();
    if (action === 'rename') {
      openRenameModal(state.currentListId);
    } else if (action === 'duplicate') {
      duplicateList(state.currentListId); showToast(t('toastDuplicated')); renderListView();
    } else if (action === 'uncheck-all') {
      uncheckAll(state.currentListId); showToast(t('toastUncheckAll')); renderDetailView();
    } else if (action === 'delete-all-items') {
      showConfirm(t('confirmDeleteAllTitle'), t('confirmDeleteAllMsg'), () => { deleteAllItems(state.currentListId); renderDetailView(); });
    } else if (action === 'delete-list') {
      const list = getCurrentList();
      if (!list) return;
      showConfirm(t('confirmDeleteListTitle'), t('confirmDeleteListMsg', list.name), () => { deleteList(state.currentListId); goToList(); });
    }
  });

  // Sort lists menu
  document.getElementById('sort-lists-btn').addEventListener('click', e => {
    e.stopPropagation(); openDropdown('sort-lists-menu', e.currentTarget);
  });
  document.getElementById('sort-lists-menu').addEventListener('click', e => {
    const sort = e.target.dataset.sort;
    if (sort) { state.settings.listSort = sort; save(); renderListView(); }
    closeDropdowns();
  });

  // Search / filter / sort
  document.getElementById('search-input').addEventListener('input', e => {
    state.searchQuery = e.target.value; renderDetailView();
  });
  document.getElementById('filter-category').addEventListener('change', e => {
    state.filterCategory = e.target.value; renderDetailView();
  });
  document.getElementById('filter-shop').addEventListener('change', e => {
    state.filterShop = e.target.value; renderDetailView();
  });
  document.getElementById('sort-items').addEventListener('change', e => {
    state.settings.itemSort = e.target.value; save(); renderDetailView();
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const open = document.querySelector('.modal:not(.hidden)');
      if (open) { closeModal(open.id); return; }
      closeDropdowns();
    }
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => closeDropdowns());
}

/* ================================================================
   PWA / Service Worker
   ================================================================ */
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }
}

/* ================================================================
   Init
   ================================================================ */
function init() {
  load();
  applyTranslations();
  setupEvents();
  renderListView();
  registerSW();
}

document.addEventListener('DOMContentLoaded', init);
