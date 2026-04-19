'use strict';

// =====================================================================
// DATA DEFINITIONS (使用データ - 変更・省略・補完禁止)
// =====================================================================

const zodiacData = {
  aries:{symbol:"♈",element:"fire",
    ja:{name:"牡羊座",range:"3/21〜4/19",desc:"情熱的で行動力がある",love:"一直線",work:"リーダー"},
    en:{name:"Aries",range:"Mar 21 - Apr 19",desc:"Energetic",love:"Direct",work:"Leader"}},
  taurus:{symbol:"♉",element:"earth",
    ja:{name:"牡牛座",range:"4/20〜5/20",desc:"安定志向",love:"一途",work:"堅実"},
    en:{name:"Taurus",range:"Apr 20 - May 20",desc:"Stable",love:"Loyal",work:"Reliable"}},
  gemini:{symbol:"♊",element:"air",
    ja:{name:"双子座",range:"5/21〜6/21",desc:"好奇心旺盛",love:"軽やか",work:"柔軟"},
    en:{name:"Gemini",range:"May 21 - Jun 21",desc:"Curious",love:"Light",work:"Flexible"}},
  cancer:{symbol:"♋",element:"water",
    ja:{name:"蟹座",range:"6/22〜7/22",desc:"感情豊か",love:"献身的",work:"支える"},
    en:{name:"Cancer",range:"Jun 22 - Jul 22",desc:"Emotional",love:"Caring",work:"Support"}},
  leo:{symbol:"♌",element:"fire",
    ja:{name:"獅子座",range:"7/23〜8/22",desc:"自信家",love:"ドラマチック",work:"主導"},
    en:{name:"Leo",range:"Jul 23 - Aug 22",desc:"Confident",love:"Dramatic",work:"Leader"}},
  virgo:{symbol:"♍",element:"earth",
    ja:{name:"乙女座",range:"8/23〜9/22",desc:"分析力",love:"慎重",work:"正確"},
    en:{name:"Virgo",range:"Aug 23 - Sep 22",desc:"Analytical",love:"Careful",work:"Precise"}},
  libra:{symbol:"♎",element:"air",
    ja:{name:"天秤座",range:"9/23〜10/23",desc:"調和重視",love:"バランス",work:"調整"},
    en:{name:"Libra",range:"Sep 23 - Oct 23",desc:"Balanced",love:"Harmony",work:"Mediator"}},
  scorpio:{symbol:"♏",element:"water",
    ja:{name:"蠍座",range:"10/24〜11/22",desc:"情熱的",love:"深い",work:"集中"},
    en:{name:"Scorpio",range:"Oct 24 - Nov 22",desc:"Intense",love:"Deep",work:"Focused"}},
  sagittarius:{symbol:"♐",element:"fire",
    ja:{name:"射手座",range:"11/23〜12/21",desc:"自由",love:"冒険的",work:"挑戦"},
    en:{name:"Sagittarius",range:"Nov 23 - Dec 21",desc:"Free",love:"Adventurous",work:"Challenger"}},
  capricorn:{symbol:"♑",element:"earth",
    ja:{name:"山羊座",range:"12/22〜1/19",desc:"努力家",love:"現実的",work:"責任"},
    en:{name:"Capricorn",range:"Dec 22 - Jan 19",desc:"Hardworking",love:"Practical",work:"Responsible"}},
  aquarius:{symbol:"♒",element:"air",
    ja:{name:"水瓶座",range:"1/20〜2/18",desc:"独創的",love:"自由",work:"革新"},
    en:{name:"Aquarius",range:"Jan 20 - Feb 18",desc:"Innovative",love:"Independent",work:"Creative"}},
  pisces:{symbol:"♓",element:"water",
    ja:{name:"魚座",range:"2/19〜3/20",desc:"優しい",love:"ロマン",work:"感性"},
    en:{name:"Pisces",range:"Feb 19 - Mar 20",desc:"Gentle",love:"Romantic",work:"Sensitive"}}
};

const dateRanges = [
  ["03-21","04-19","aries"],
  ["04-20","05-20","taurus"],
  ["05-21","06-21","gemini"],
  ["06-22","07-22","cancer"],
  ["07-23","08-22","leo"],
  ["08-23","09-22","virgo"],
  ["09-23","10-23","libra"],
  ["10-24","11-22","scorpio"],
  ["11-23","12-21","sagittarius"],
  ["12-22","01-19","capricorn"],
  ["01-20","02-18","aquarius"],
  ["02-19","03-20","pisces"]
];

const elementScore = {
  fire:{fire:80,earth:65,air:90,water:60},
  earth:{fire:65,earth:85,air:60,water:90},
  air:{fire:90,earth:60,air:80,water:65},
  water:{fire:60,earth:90,air:65,water:85}
};

const typeModifiers = {love:5,friend:8,work:-2};

const compatibilityComments = [
  "最高の相性","とても良い関係","安心できる関係","刺激し合える","バランスが良い",
  "自然体でいられる","信頼しやすい","長続きしやすい","心地よい距離感","お互いを高める",
  "価値観が近い","理解しやすい","助け合える","前向きな関係","穏やかな関係",
  "楽しい時間を共有","安心感がある","成長できる","刺激的","良いパートナー",
  "魅力を引き出す","信頼関係が築ける","自然に惹かれる","会話が弾む","協力しやすい",
  "居心地が良い","相乗効果あり","理解し合える","関係が安定","楽しく過ごせる",
  "やや良い関係","工夫で良くなる","努力次第で良好","時間で深まる","少し注意",
  "考え方が違う","距離感が必要","理解に時間","刺激が強い","慎重に",
  "ぶつかりやすい","ズレがある","歩み寄りが必要","努力が必要","難しい関係",
  "不安定","誤解が多い","すれ違いやすい","課題が多い","忍耐が必要",
  "相性は普通","波がある","気分で変わる","状況次第","安定しにくい",
  "柔軟さが鍵","理解が鍵","対話が重要","信頼が必要","歩み寄り重要",
  "努力で改善","時間が必要","変化する関係","成長次第","可能性あり",
  "良くも悪くも刺激","発展性あり","工夫で好転","関係は変化する","慎重に進める",
  "共通点少なめ","違いが魅力","補い合える","理解しにくい","独特な関係",
  "意外と合う","徐々に良くなる","慣れが必要","相性に波","努力型相性",
  "理解すれば良い","距離感重要","冷静さが鍵","感情が影響","環境次第",
  "新鮮な関係","発見が多い","刺激的な相性","学びがある","変化しやすい"
];

const fortuneComments = [
  "最高の日","とても良い日","良い流れ","安定した日","チャンスあり",
  "挑戦向き","落ち着く日","慎重に","休息日","注意日",
  "新しい出会い","成長できる","変化の兆し","集中力アップ","運気上昇",
  "穏やか","刺激的","忙しい日","リラックス","判断重要",
  "バランス良い","感情安定","前向き","整理が必要","決断の時",
  "可能性あり","努力が実る","継続が鍵","休むべき","焦らない",
  "慎重行動","良い発見","柔軟に","変化あり","冷静に",
  "対話が重要","積極的に","守り重視","攻める日","運気微増",
  "運気低下注意","波がある","安定志向","挑戦OK","見直し必要",
  "自分磨き","人間関係良好","注意深く","成長の時","チャンス接近",
  "運気上向き","やや不調","好調維持","改善の余地","転機",
  "変化チャンス","発想が鍵","努力必要","無理しない","余裕持つ",
  "整理整頓","計画重要","感情優先","理性優先","直感活用",
  "周囲協力","自立重視","集中力勝負","タイミング重要","判断慎重",
  "大胆さ必要","小さな成功","流れに乗る","足元固める","挑戦成功",
  "リスク注意","無理禁物","視野広げる","調整必要","静かに進む"
];

const luckyColors  = ["赤","青","緑","黄","紫","白","黒","金","銀","ピンク"];
const luckyItems   = ["本","時計","スマホ","ノート","靴","バッグ","アクセ","ペン","水筒","財布"];
const luckyNumbers = [1,2,3,4,5,6,7,8,9];

const i18n = {
  ja:{app:"星座アプリ",judge:"判定",fortune:"運勢",compat:"相性",zukan:"図鑑"},
  en:{app:"Zodiac App",judge:"Check",fortune:"Fortune",compat:"Match",zukan:"Guide"}
};

// =====================================================================
// 多言語 UI テキスト（i18n 拡張）
// =====================================================================

const luckyColorsEn  = ["Red","Blue","Green","Yellow","Purple","White","Black","Gold","Silver","Pink"];
const luckyItemsEn   = ["Book","Watch","Phone","Notebook","Shoes","Bag","Accessory","Pen","Bottle","Wallet"];

const uiText = {
  ja: {
    ...i18n.ja,
    judgeTitle: "生年月日を入力",
    labelBirthday: "生年月日",
    btnJudge: "判定する",
    btnToFortune: "今日の運勢を見る",
    fortuneTitle: "今日の運勢",
    labelSelectZodiac: "星座を選択",
    labelTotal: "総合運",
    labelLoveFortune: "恋愛運",
    labelWorkFortune: "仕事運",
    labelMoney: "金運",
    labelColor: "🎨 ラッキーカラー",
    labelItem: "✨ ラッキーアイテム",
    labelNumber: "🔢 ラッキーナンバー",
    compatTitle: "相性診断",
    labelMyBirthday: "自分の生年月日",
    labelTheirBirthday: "相手の生年月日",
    btnCompat: "相性を診断する",
    labelCompatLove: "💕 恋愛相性",
    labelCompatFriend: "👫 友達相性",
    labelCompatWork: "💼 仕事相性",
    zukanTitle: "星座図鑑",
    cuspMsg: "この日は星座の切り替わり時期に近い日です",
    errNoDate: "日付を入力してください",
    errNoDates: "2人分の日付を入力してください",
    personality: "性格",
    loveTendency: "恋愛",
    workTendency: "仕事",
    element: "元素",
    keywords: "キーワード",
    elemNames: { fire:"🔥 火", earth:"🌿 地", air:"💨 風", water:"💧 水" }
  },
  en: {
    ...i18n.en,
    judgeTitle: "Enter Your Birthday",
    labelBirthday: "Date of Birth",
    btnJudge: "Check Sign",
    btnToFortune: "See Today's Fortune",
    fortuneTitle: "Today's Fortune",
    labelSelectZodiac: "Select Sign",
    labelTotal: "Overall",
    labelLoveFortune: "Love",
    labelWorkFortune: "Work",
    labelMoney: "Money",
    labelColor: "🎨 Lucky Color",
    labelItem: "✨ Lucky Item",
    labelNumber: "🔢 Lucky Number",
    compatTitle: "Compatibility",
    labelMyBirthday: "Your Birthday",
    labelTheirBirthday: "Partner's Birthday",
    btnCompat: "Check Compatibility",
    labelCompatLove: "💕 Romance",
    labelCompatFriend: "👫 Friendship",
    labelCompatWork: "💼 Work",
    zukanTitle: "Zodiac Guide",
    cuspMsg: "This date is close to a zodiac cusp.",
    errNoDate: "Please enter a date.",
    errNoDates: "Please enter both birthdays.",
    personality: "Personality",
    loveTendency: "Love",
    workTendency: "Work",
    element: "Element",
    keywords: "Keywords",
    elemNames: { fire:"🔥 Fire", earth:"🌿 Earth", air:"💨 Air", water:"💧 Water" }
  }
};

// =====================================================================
// 星座キー順序
// =====================================================================

const ZODIAC_KEYS = [
  'aries','taurus','gemini','cancer','leo','virgo',
  'libra','scorpio','sagittarius','capricorn','aquarius','pisces'
];

// 境界日 (切り替わり時期に近い日)
const CUSP_DATES = new Set([
  "03-21","04-19","04-20","05-20","05-21","06-21",
  "06-22","07-22","07-23","08-22","08-23","09-22",
  "09-23","10-23","10-24","11-22","11-23","12-21",
  "12-22","01-19","01-20","02-18","02-19","03-20"
]);

// =====================================================================
// 状態
// =====================================================================

let currentLang = localStorage.getItem('zodiac_lang')
  || (navigator.language.startsWith('ja') ? 'ja' : 'en');
let lastZodiac = localStorage.getItem('zodiac_last') || 'aries';
let lastTab    = localStorage.getItem('zodiac_tab')  || 'judge';

// =====================================================================
// 疑似乱数 (seed ベース LCG)
// =====================================================================

function makeRng(seed) {
  let s = (seed ^ 0x5a5a5a5a) >>> 0;
  return function () {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function dateNum(d) {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

// =====================================================================
// 星座判定ロジック
// =====================================================================

function getZodiac(month, day) {
  const md = pad2(month) + '-' + pad2(day);
  for (const [start, end, sign] of dateRanges) {
    if (sign === 'capricorn') {
      if (md >= '12-22' || md <= '01-19') return sign;
    } else {
      if (md >= start && md <= end) return sign;
    }
  }
  return 'pisces';
}

function isNearCusp(month, day) {
  return CUSP_DATES.has(pad2(month) + '-' + pad2(day));
}

function pad2(n) { return String(n).padStart(2, '0'); }

// =====================================================================
// 運勢ロジック
// =====================================================================

// 星座ごとの運勢ベーススコア（星座の傾向を反映した固定値）
const zodiacBaseScores = {
  aries:      {total:75,love:70,work:80,money:65},
  taurus:     {total:80,love:75,work:75,money:85},
  gemini:     {total:70,love:75,work:70,money:65},
  cancer:     {total:75,love:85,work:65,money:70},
  leo:        {total:85,love:80,work:85,money:75},
  virgo:      {total:75,love:65,work:85,money:70},
  libra:      {total:80,love:85,work:75,money:75},
  scorpio:    {total:70,love:75,work:80,money:70},
  sagittarius:{total:80,love:70,work:75,money:70},
  capricorn:  {total:75,love:65,work:90,money:80},
  aquarius:   {total:70,love:70,work:75,money:65},
  pisces:     {total:75,love:80,work:65,money:65}
};

function getFortune(zodiacKey, date) {
  const zIdx = ZODIAC_KEYS.indexOf(zodiacKey);
  const dn   = dateNum(date);
  const base = zodiacBaseScores[zodiacKey];

  function catFortune(catKey, catIdx) {
    const rng   = makeRng(dn * 100 + zIdx * 10 + catIdx);
    const sway  = Math.floor(rng() * 21) - 10;          // -10〜+10
    const score = Math.min(99, Math.max(1, base[catKey] + sway));
    const ci    = Math.floor(rng() * fortuneComments.length);
    return { score, comment: fortuneComments[ci] };
  }

  const total = catFortune('total', 0);
  const love  = catFortune('love',  1);
  const work  = catFortune('work',  2);
  const money = catFortune('money', 3);

  const rngLucky = makeRng(dn * 1000 + zIdx);
  const colorIdx  = Math.floor(rngLucky() * luckyColors.length);
  const itemIdx   = Math.floor(rngLucky() * luckyItems.length);
  const numIdx    = Math.floor(rngLucky() * luckyNumbers.length);

  return { total, love, work, money, colorIdx, itemIdx, numIdx };
}

function scoreToStars(score) {
  const n = Math.max(1, Math.min(5, Math.round(score / 20)));
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

// =====================================================================
// 相性診断ロジック
// =====================================================================

function getCompat(zodiacA, zodiacB, date) {
  const elemA  = zodiacData[zodiacA].element;
  const elemB  = zodiacData[zodiacB].element;
  const base   = elementScore[elemA][elemB];
  const idxA   = ZODIAC_KEYS.indexOf(zodiacA);
  const idxB   = ZODIAC_KEYS.indexOf(zodiacB);
  const dn     = dateNum(date);

  function typeScore(type, typeIdx) {
    const mod  = typeModifiers[type];
    const seed = dn + idxA * 1000 + idxB * 100000 + typeIdx * 10000000;
    const rng  = makeRng(seed);
    const sway = Math.floor(rng() * 11) - 5;            // -5〜+5
    const score = Math.min(99, Math.max(1, base + mod + sway));
    const ci    = Math.floor(rng() * compatibilityComments.length);
    return { score, comment: compatibilityComments[ci] };
  }

  return {
    love:   typeScore('love',   0),
    friend: typeScore('friend', 1),
    work:   typeScore('work',   2),
  };
}

// =====================================================================
// UI ヘルパー
// =====================================================================

function t(key) { return uiText[currentLang][key] || key; }

function el(id) { return document.getElementById(id); }

function showError(parentId, msg) {
  const errId = parentId + '-error';
  let err = el(errId);
  if (!err) {
    err = document.createElement('div');
    err.id = errId;
    err.className = 'error-msg';
    el(parentId).after(err);
  }
  err.textContent = msg;
  clearTimeout(err._t);
  err._t = setTimeout(() => err.remove(), 3000);
}

// =====================================================================
// 言語適用
// =====================================================================

function applyLang() {
  document.documentElement.lang = currentLang;
  el('lang-toggle').textContent  = currentLang === 'ja' ? 'EN' : 'JA';
  el('app-title').textContent    = t('app');

  el('tab-judge-btn').textContent   = t('judge');
  el('tab-fortune-btn').textContent = t('fortune');
  el('tab-compat-btn').textContent  = t('compat');
  el('tab-zukan-btn').textContent   = t('zukan');

  el('judge-title').textContent      = t('judgeTitle');
  el('label-birthday').textContent   = t('labelBirthday');
  el('btn-judge').textContent        = t('btnJudge');
  if (!el('judge-result').classList.contains('hidden')) {
    el('btn-to-fortune').textContent = t('btnToFortune');
  }

  el('fortune-title').textContent       = t('fortuneTitle');
  el('label-select-zodiac').textContent = t('labelSelectZodiac');
  el('label-total').textContent         = t('labelTotal');
  el('label-love-fortune').textContent  = t('labelLoveFortune');
  el('label-work-fortune').textContent  = t('labelWorkFortune');
  el('label-money').textContent         = t('labelMoney');
  el('label-color').textContent         = t('labelColor');
  el('label-item').textContent          = t('labelItem');
  el('label-number').textContent        = t('labelNumber');

  el('compat-title').textContent          = t('compatTitle');
  el('label-my-birthday').textContent     = t('labelMyBirthday');
  el('label-their-birthday').textContent  = t('labelTheirBirthday');
  el('btn-compat').textContent            = t('btnCompat');
  el('label-compat-love').textContent     = t('labelCompatLove');
  el('label-compat-friend').textContent   = t('labelCompatFriend');
  el('label-compat-work').textContent     = t('labelCompatWork');

  el('zukan-title').textContent = t('zukanTitle');

  buildFortuneSelect();
  buildZukanGrid();
}

// =====================================================================
// タブ切り替え
// =====================================================================

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === tab)
  );
  document.querySelectorAll('.tab-section').forEach(s =>
    s.classList.toggle('active', s.id === 'sec-' + tab)
  );
  localStorage.setItem('zodiac_tab', tab);
  lastTab = tab;
}

// =====================================================================
// 星座判定 UI
// =====================================================================

function doJudge() {
  const val = el('input-birthday').value;
  if (!val) { showError('btn-judge', t('errNoDate')); return; }

  const d     = new Date(val);
  const month = d.getMonth() + 1;
  const day   = d.getDate();
  const key   = getZodiac(month, day);
  const z     = zodiacData[key];
  const zd    = z[currentLang];
  const eName = t('elemNames')[z.element];

  el('result-symbol').textContent = z.symbol;
  el('result-name').textContent   = zd.name;
  el('result-range').textContent  = zd.range;
  el('result-element').textContent = eName;
  el('result-element').className  = 'zodiac-element element-' + z.element;
  el('result-desc').textContent   = zd.desc;
  el('result-love').textContent   = '💕 ' + zd.love;
  el('result-work').textContent   = '💼 ' + zd.work;
  el('btn-to-fortune').textContent = t('btnToFortune');

  const cusp = el('cusp-msg');
  if (isNearCusp(month, day)) {
    cusp.textContent = t('cuspMsg');
    cusp.classList.remove('hidden');
  } else {
    cusp.classList.add('hidden');
  }

  el('judge-result').classList.remove('hidden');
  showSparkles();

  lastZodiac = key;
  localStorage.setItem('zodiac_last', key);
  localStorage.setItem('zodiac_bday', val);

  el('fortune-zodiac-select').value = key;
  renderFortune();
}

// =====================================================================
// 運勢 UI
// =====================================================================

function buildFortuneSelect() {
  const sel  = el('fortune-zodiac-select');
  const prev = sel.value;
  sel.innerHTML = '';
  for (const key of ZODIAC_KEYS) {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = zodiacData[key].symbol + ' ' + zodiacData[key][currentLang].name;
    sel.appendChild(opt);
  }
  sel.value = (prev && ZODIAC_KEYS.includes(prev)) ? prev
    : (ZODIAC_KEYS.includes(lastZodiac) ? lastZodiac : 'aries');
  renderFortune();
}

function renderFortune() {
  const key = el('fortune-zodiac-select').value;
  if (!key) return;
  const f   = getFortune(key, new Date());
  const z   = zodiacData[key];
  const colors = currentLang === 'ja' ? luckyColors  : luckyColorsEn;
  const items  = currentLang === 'ja' ? luckyItems   : luckyItemsEn;

  el('fortune-symbol').textContent      = z.symbol;
  el('fortune-name').textContent        = z[currentLang].name;
  el('fortune-total-stars').textContent = scoreToStars(f.total.score);
  el('fortune-total-comment').textContent = f.total.comment;
  el('fortune-love-stars').textContent  = scoreToStars(f.love.score);
  el('fortune-love-comment').textContent = f.love.comment;
  el('fortune-work-stars').textContent  = scoreToStars(f.work.score);
  el('fortune-work-comment').textContent = f.work.comment;
  el('fortune-money-stars').textContent = scoreToStars(f.money.score);
  el('fortune-money-comment').textContent = f.money.comment;
  el('lucky-color').textContent  = colors[f.colorIdx];
  el('lucky-item-val').textContent = items[f.itemIdx];
  el('lucky-number').textContent = luckyNumbers[f.numIdx];
}

// =====================================================================
// 相性 UI
// =====================================================================

function doCompat() {
  const myVal    = el('input-my-bday').value;
  const theirVal = el('input-their-bday').value;
  if (!myVal || !theirVal) { showError('btn-compat', t('errNoDates')); return; }

  const myD    = new Date(myVal);
  const theirD = new Date(theirVal);
  const myKey    = getZodiac(myD.getMonth() + 1, myD.getDate());
  const theirKey = getZodiac(theirD.getMonth() + 1, theirD.getDate());
  const result   = getCompat(myKey, theirKey, new Date());

  el('compat-my-symbol').textContent    = zodiacData[myKey].symbol;
  el('compat-my-name').textContent      = zodiacData[myKey][currentLang].name;
  el('compat-their-symbol').textContent = zodiacData[theirKey].symbol;
  el('compat-their-name').textContent   = zodiacData[theirKey][currentLang].name;

  ['love','friend','work'].forEach(type => {
    const r = result[type];
    el(`compat-${type}-score`).textContent   = r.score + '%';
    el(`compat-${type}-comment`).textContent = r.comment;
    el(`compat-${type}-fill`).style.width    = '0%';
    setTimeout(() => {
      el(`compat-${type}-fill`).style.width  = r.score + '%';
    }, 80);
  });

  el('compat-result').classList.remove('hidden');
}

// =====================================================================
// 星座図鑑 UI
// =====================================================================

function buildZukanGrid() {
  const grid = el('zodiac-grid');
  grid.innerHTML = '';
  for (const key of ZODIAC_KEYS) {
    const z    = zodiacData[key];
    const card = document.createElement('div');
    card.className = 'zodiac-card';
    card.innerHTML = `
      <div class="zodiac-card-symbol">${z.symbol}</div>
      <div class="zodiac-card-name">${z[currentLang].name}</div>
    `;
    card.addEventListener('click', () => openModal(key));
    grid.appendChild(card);
  }
}

function openModal(key) {
  const z   = zodiacData[key];
  const zd  = z[currentLang];
  const en  = t('elemNames')[z.element];

  el('modal-content').innerHTML = `
    <div class="modal-symbol">${z.symbol}</div>
    <div class="modal-name">${zd.name}</div>
    <div class="modal-range">${zd.range}</div>
    <div class="modal-section">
      <div class="modal-section-title">${t('personality')}</div>
      <div class="modal-section-content">${zd.desc}</div>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">${t('element')}</div>
      <div class="modal-section-content">
        <span class="zodiac-element element-${z.element}">${en}</span>
      </div>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">${t('keywords')}</div>
      <div class="modal-tags">
        <span class="modal-tag">${t('loveTendency')}: ${zd.love}</span>
        <span class="modal-tag">${t('workTendency')}: ${zd.work}</span>
      </div>
    </div>
  `;
  el('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  el('modal-overlay').classList.add('hidden');
}

// =====================================================================
// 星キラキラ演出
// =====================================================================

function showSparkles() {
  const container = el('star-anim');
  container.innerHTML = '';
  for (let i = 0; i < 14; i++) {
    const s   = document.createElement('div');
    s.className = 'sparkle';
    const angle = (i / 14) * 360;
    const dist  = 50 + Math.random() * 70;
    const tx = (Math.cos(angle * Math.PI / 180) * dist).toFixed(0) + 'px';
    const ty = (Math.sin(angle * Math.PI / 180) * dist).toFixed(0) + 'px';
    s.style.cssText = `left:50%;top:30%;--tx:${tx};--ty:${ty};animation-delay:${i * 40}ms`;
    container.appendChild(s);
  }
  setTimeout(() => { container.innerHTML = ''; }, 1800);
}

// =====================================================================
// 背景星
// =====================================================================

function buildBgStars() {
  const container = el('bg-stars');
  for (let i = 0; i < 90; i++) {
    const s    = document.createElement('div');
    s.className = 'bg-star';
    const size = (Math.random() * 2 + 0.8).toFixed(1);
    const op   = (Math.random() * 0.5 + 0.1).toFixed(2);
    const dur  = (Math.random() * 3 + 2).toFixed(1) + 's';
    const del  = (Math.random() * 4).toFixed(1) + 's';
    s.style.cssText = `
      left:${(Math.random()*100).toFixed(1)}%;
      top:${(Math.random()*100).toFixed(1)}%;
      width:${size}px;height:${size}px;
      --op:${op};--dur:${dur};
      animation-delay:${del};
    `;
    container.appendChild(s);
  }
}

// =====================================================================
// 初期化
// =====================================================================

function init() {
  buildBgStars();
  applyLang();

  const savedBday = localStorage.getItem('zodiac_bday');
  if (savedBday) el('input-birthday').value = savedBday;

  switchTab(lastTab);

  // イベント
  el('btn-judge').addEventListener('click', doJudge);
  el('btn-to-fortune').addEventListener('click', () => switchTab('fortune'));
  el('btn-compat').addEventListener('click', doCompat);
  el('fortune-zodiac-select').addEventListener('change', () => {
    localStorage.setItem('zodiac_last', el('fortune-zodiac-select').value);
    renderFortune();
  });
  document.querySelectorAll('.tab-btn').forEach(btn =>
    btn.addEventListener('click', () => switchTab(btn.dataset.tab))
  );
  el('lang-toggle').addEventListener('click', () => {
    currentLang = currentLang === 'ja' ? 'en' : 'ja';
    localStorage.setItem('zodiac_lang', currentLang);
    applyLang();
  });
  el('modal-close').addEventListener('click', closeModal);
  el('modal-overlay').addEventListener('click', e => {
    if (e.target === el('modal-overlay')) closeModal();
  });

  // PWA Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', init);
