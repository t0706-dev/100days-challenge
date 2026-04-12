/* ==============================
   回文チェッカー script.js
============================== */

// ==============================
// 回文データ
// ==============================
const PALINDROME_DATA = {
  "3": [
    { "yomi": "みなみ", "label": "南" },
    { "yomi": "やおや", "label": "八百屋" },
    { "yomi": "いらい", "label": "依頼" },
    { "yomi": "きせき", "label": "奇跡" },
    { "yomi": "しんし", "label": "紳士" },
    { "yomi": "こねこ", "label": "子猫" },
    { "yomi": "きてき", "label": "汽笛" },
    { "yomi": "すいす", "label": "スイス" },
    { "yomi": "とまと", "label": "トマト" },
    { "yomi": "たべた", "label": "食べた" },
    { "yomi": "ねるね", "label": "寝るね" },
    { "yomi": "かじか", "label": "火事か" }
  ],
  "4": [
    { "yomi": "きつつき", "label": "キツツキ" },
    { "yomi": "すでです", "label": "素手です" },
    { "yomi": "いかかい", "label": "イカかい？" }
  ],
  "5": [
    { "yomi": "しんぶんし", "label": "新聞紙" },
    { "yomi": "いろしろい", "label": "色白い" },
    { "yomi": "うたうたう", "label": "歌うたう" },
    { "yomi": "よくいくよ", "label": "よく行くよ" },
    { "yomi": "とおいおと", "label": "遠い音" },
    { "yomi": "かきのきか", "label": "柿の木か" },
    { "yomi": "ねこのこね", "label": "猫の子ね" },
    { "yomi": "きいろいき", "label": "黄色い木" },
    { "yomi": "よるくるよ", "label": "夜来るよ" },
    { "yomi": "くつにつく", "label": "靴に付く" },
    { "yomi": "かいたいか", "label": "買いたいか？" },
    { "yomi": "たぶんぶた", "label": "多分ブタ" },
    { "yomi": "わしのしわ", "label": "ワシの皺" },
    { "yomi": "なわのわな", "label": "縄の罠" },
    { "yomi": "うまがまう", "label": "馬が舞う" },
    { "yomi": "みなはなみ", "label": "みな花見" },
    { "yomi": "いかとかい", "label": "イカと貝" },
    { "yomi": "くいにいく", "label": "食いに行く" },
    { "yomi": "たしました", "label": "足しました" },
    { "yomi": "ばかなかば", "label": "馬鹿なカバ" },
    { "yomi": "なすですな", "label": "ナスですな" },
    { "yomi": "きのこのき", "label": "キノコの木" }
  ],
  "6": [
    { "yomi": "さるににるさ", "label": "猿に似るさ" },
    { "yomi": "かるいいるか", "label": "軽いイルカ" },
    { "yomi": "いけととけい", "label": "池と時計" }
  ],
  "7": [
    { "yomi": "たけやぶやけた", "label": "竹やぶ焼けた" },
    { "yomi": "たけやがやけた", "label": "竹屋が焼けた" },
    { "yomi": "だんすがすんだ", "label": "ダンスが済んだ" },
    { "yomi": "たいやきやいた", "label": "たいやき焼いた" },
    { "yomi": "とびこむこびと", "label": "飛び込む小人" },
    { "yomi": "なつまでまつな", "label": "夏まで待つな" },
    { "yomi": "いがいやいがい", "label": "意外や意外" },
    { "yomi": "ばりうむうりば", "label": "バリウム売り場" },
    { "yomi": "たしかにかした", "label": "確かに貸した" },
    { "yomi": "にしがひがしに", "label": "西が東に" },
    { "yomi": "いかたべたかい", "label": "イカ食べたかい" },
    { "yomi": "たまにがにまた", "label": "たまにガニ股" },
    { "yomi": "みぎてばてぎみ", "label": "右手バテ気味" },
    { "yomi": "かつらがらっか", "label": "カツラが落下" },
    { "yomi": "るすになにする", "label": "留守に何する" },
    { "yomi": "まさかさかさま", "label": "まさか逆さま" },
    { "yomi": "きつねかねつき", "label": "キツネ鐘つき" }
  ],
  "8": [
    { "yomi": "ねんまつつまんね", "label": "年末つまんね" },
    { "yomi": "かっこいいこっか", "label": "かっこいい国歌" }
  ],
  "9": [
    { "yomi": "よるにんじんにるよ", "label": "夜ニンジン煮るよ" },
    { "yomi": "わたしまけましたわ", "label": "わたし負けましたわ" },
    { "yomi": "かんけいないけんか", "label": "関係ないけんか" },
    { "yomi": "むしなかずかなしむ", "label": "虫鳴かず悲しむ" },
    { "yomi": "じいさんてんさいじ", "label": "じいさん天才児" },
    { "yomi": "のうかもいもかうの", "label": "農家もいも買うの？" },
    { "yomi": "みごとなはなとごみ", "label": "見事な花とゴミ" },
    { "yomi": "ぞうかいたいかうぞ", "label": "ぞう飼いたい！買うぞ" }
  ],
  "10": [
    { "yomi": "だんだんととんだんだ", "label": "段々と飛んだんだ" },
    { "yomi": "ばれてもいいもてれば", "label": "バレてもいい、モテれば" }
  ],
  "11": [
    { "yomi": "ひるめしのたのしめるひ", "label": "昼飯の楽しめる日" },
    { "yomi": "わたしたわしわたしたわ", "label": "私タワシ渡したわ" },
    { "yomi": "かしあたえこえたあしか", "label": "菓子与え肥えたアシカ" },
    { "yomi": "にわとりとことりとわに", "label": "ニワトリと小鳥とワニ" },
    { "yomi": "いぶしぎんえんぎしぶい", "label": "いぶし銀、演技渋い" },
    { "yomi": "いかたしかにかしたかい", "label": "イカ、確かに貸したかい？" },
    { "yomi": "きんえんだんだんえんき", "label": "禁煙だんだん延期" },
    { "yomi": "よるせみをみせるのよ", "label": "夜セミを見せるのよ" }
  ],
  "12": [
    { "yomi": "きんにくぼでぃぼくにんき", "label": "筋肉ボディ！僕人気" }
  ],
  "13": [
    { "yomi": "ままがわたしにしたわがまま", "label": "ママが私にしたワガママ" },
    { "yomi": "きんにくぼでぃでぼくにんき", "label": "筋肉ボディで僕人気" },
    { "yomi": "いかのだんすはすんだのかい", "label": "イカのダンスは済んだのかい" },
    { "yomi": "わたしきつねかねつきしたわ", "label": "私キツネ、鐘つきしたわ" },
    { "yomi": "いたりあでもともでありたい", "label": "イタリアでも友でありたい" }
  ],
  "14": [
    { "yomi": "ずらとばれてももてればとらず", "label": "ズラとバレても、モテれば取らず" }
  ],
  "15": [
    { "yomi": "ままのりもこんてんこもりのまま", "label": "ママのリモコンてんこもりのまま" },
    { "yomi": "よのなかねかおかおかねかなのよ", "label": "世の中ね、顔かお金かなのよ" },
    { "yomi": "たしかにこのやおやのこにかした", "label": "確かに、この八百屋の子に貸した" },
    { "yomi": "いたりあでくらしらくでありたい", "label": "イタリアで暮らし、楽でありたい" },
    { "yomi": "きてもよいころだろこいよもてき", "label": "来てもよい頃だろ、来いよモテ期" },
    { "yomi": "わたしたちもおもちたしたわ", "label": "私たちもお餅足したわ" }
  ],
  "16": [
    { "yomi": "よるにこばやしととしやはこにるよ", "label": "夜に小林と俊也、箱煮るよ" },
    { "yomi": "わたしたわたなべへなたわたしたわ", "label": "渡した！渡辺へ鉈、渡したわ！" },
    { "yomi": "なんとろそあのろろのあぞろとんな", "label": "なんと、驢鼠！あのロロノア・ゾロ取んな！" },
    { "yomi": "あらーとなりまただまりなとあらぁ", "label": "アラート鳴り、また「黙りな！」と「あらぁ、、」" }
  ],
  "17": [
    { "yomi": "うどんぱすたれんこんれたすぱんどう", "label": "うどん、パスタ、レンコン、レタス、パンどう？" },
    { "yomi": "すできすできんほどほんきですきです", "label": "素でキスできんほど本気で好きです" },
    { "yomi": "ぺがさすさがすいまいすかさずさがへ", "label": "ペガサス探す今井、すかさず佐賀へ" },
    { "yomi": "よるしはんそらまめまらそんはしるよ", "label": "夜、師範ソラマメ、マラソン走るよ" },
    { "yomi": "だんぜんあんどうのうどんあんぜんだ", "label": "断然、安藤のうどん安全だ" },
    { "yomi": "てんたいかんそくにくそんかいたんで", "label": "天体観測、ニクソン描いたんで" }
  ],
  "18": [
    { "yomi": "いしやくこいしいおおいしいごくやしい", "label": "石焼く恋しい大石、以後悔しい" },
    { "yomi": "くいたなかやましおおしまやかなだいく", "label": "悔いた中山氏、大島やカナダ行く" },
    { "yomi": "ねだんしみずがこううごかすみしんだね", "label": "値段？清水がこう動かすミシンだね" },
    { "yomi": "らぶらぶとなかいつついかなとぶらぶら", "label": "ラブラブトナカイ、筒井加奈とぶらぶら" },
    { "yomi": "てんぐのふるいどまにまどうふのぐんて", "label": "天狗の古い土間に惑いる負の軍手" }
  ],
  "19": [
    { "yomi": "いなかなかながわにもにわがなかなかない", "label": "田舎な神奈川にも、庭がなかなかない" },
    { "yomi": "よるなくなよしばいぬいばしょなくなるよ", "label": "夜鳴くなよ柴犬、居場所無くなるよ" },
    { "yomi": "れおたーどでだんすがすんだでどあたおれ", "label": "レオタードでダンスがすんだ、で、ドア倒れ" },
    { "yomi": "かいめいかにころびんひろこにかいめいか", "label": "改名か！？ニコロビン、裕子(ひろこ)に改名か！？" },
    { "yomi": "すいぶとらそどすきなきすとそらとぶいす", "label": "吹部と「ラ、ソ、ド」好きな鱚と空飛ぶ椅子" },
    { "yomi": "にくいなかむらめかやかめらむかないくに", "label": "憎い中村、メカやカメラ向かない国" }
  ],
  "20": [
    { "yomi": "かたのせたかやましおおしまやかたせのたか", "label": "肩乗せ高山氏、大島や片瀬の鷹" },
    { "yomi": "さっきごねたしらいししいらしたねこきっさ", "label": "さっきごねた白石氏いらした猫喫茶" },
    { "yomi": "ぱんだくがだがっきおおきつかだがくだんは", "label": "パンダ区が、打楽器多き塚田楽団は" }
  ],
  "21": [
    { "yomi": "かすがはしもとかんななんかともがみはがすか", "label": "春日、橋本環奈なんかと模紙剥がすか" }
  ]
};

// ==============================
// 正規化関数
// カタカナ→ひらがな変換、記号・空白除去
// ==============================
function normalize(str) {
  // カタカナをひらがなに変換
  let result = str.replace(/[\u30A1-\u30F6]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
  // 英字を小文字に
  result = result.toLowerCase();
  // 空白除去
  result = result.replace(/\s+/g, '');
  // 記号除去（句読点・括弧・中黒・長音符など）
  result = result.replace(/[、。！？!?・「」『』()（）【】〔〕…‥ー～〜\-_]/g, '');
  // 全角数字・記号の除去
  result = result.replace(/[^\u3041-\u3096\u3099-\u309Fa-z0-9]/g, '');
  return result;
}

// ==============================
// 回文判定関数
// ==============================
function isPalindrome(str) {
  if (str.length === 0) return false;
  const reversed = str.split('').reverse().join('');
  return str === reversed;
}

// ==============================
// 回文案生成関数
// 入力文字列を使い、末尾に反転を結合して回文化する
// 例: "たかし" → "たかし" + "かかした" = "たかしかかした"（先頭1文字は重複させない）
// ==============================
function generateSuggestion(normalized) {
  if (normalized.length === 0) return '';
  // 文字を反転し、先頭1文字を除いた後ろ部分を結合
  const reversed = normalized.split('').reverse().join('');
  return normalized + reversed.slice(1);
}

// ==============================
// 指定文字数のランダム回文取得
// ==============================
function getRandomPalindrome(length) {
  const list = PALINDROME_DATA[String(length)];
  if (!list || list.length === 0) return null;
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

// ==============================
// タブ切替処理
// ==============================
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById('tab-' + target).classList.add('active');
    });
  });
}

// ==============================
// チェッカー：表示
// ==============================
function renderCheckerResult(input) {
  const resultEl = document.getElementById('checker-result');

  if (!input.trim()) {
    resultEl.innerHTML = '';
    return;
  }

  const norm = normalize(input);

  if (norm.length === 0) {
    resultEl.innerHTML = `
      <div class="no-data">判定できる文字が含まれていません。<br>ひらがな・カタカナ・英数字を入力してください。</div>
    `;
    return;
  }

  if (isPalindrome(norm)) {
    resultEl.innerHTML = `
      <div class="result-card result-ok">
        <div class="result-badge">✅ 回文です！</div>
        <div class="result-main">「${escapeHtml(input.trim())}」は回文です！</div>
        <div class="normalized-label">正規化後：</div>
        <div class="normalized-text">${escapeHtml(norm)}</div>
      </div>
    `;
  } else {
    const suggestion = generateSuggestion(norm);
    resultEl.innerHTML = `
      <div class="result-card result-ng">
        <div class="result-badge">❌ 回文ではありません</div>
        <div class="result-main">「${escapeHtml(input.trim())}」は回文ではありません</div>
        <div class="normalized-label">正規化後：</div>
        <div class="normalized-text">${escapeHtml(norm)}</div>
        <div class="suggest-box">
          <span class="suggest-label">💡 回文案</span>
          <div class="suggest-text">${escapeHtml(suggestion)}</div>
        </div>
      </div>
    `;
  }
}

// ==============================
// 生成：表示
// ==============================
function renderGeneratorResult(length) {
  const resultEl = document.getElementById('generator-result');

  if (!length) {
    resultEl.innerHTML = '';
    return;
  }

  const item = getRandomPalindrome(Number(length));

  if (!item) {
    resultEl.innerHTML = `
      <div class="no-data">この文字数の回文は準備中です 🙏</div>
    `;
    return;
  }

  resultEl.innerHTML = `
    <div class="gen-card">
      <div class="gen-yomi">${escapeHtml(item.yomi)}</div>
      <div class="gen-label-row">
        <span class="gen-label-tag">意味</span>
        <span class="gen-label-text">${escapeHtml(item.label)}</span>
      </div>
      <div class="gen-chars">${escapeHtml(length)}文字の回文</div>
    </div>
  `;
}

// ==============================
// XSS対策：HTML エスケープ
// ==============================
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==============================
// イベントリスナー初期化
// ==============================
function initEvents() {
  // チェッカー：判定ボタン
  document.getElementById('checker-btn').addEventListener('click', () => {
    const input = document.getElementById('checker-input').value;
    renderCheckerResult(input);
  });

  // チェッカー：Enterキーでも判定（Shift+Enterは改行）
  document.getElementById('checker-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const input = e.target.value;
      renderCheckerResult(input);
    }
  });

  // 生成：生成ボタン
  document.getElementById('generate-btn').addEventListener('click', () => {
    const length = document.getElementById('length-select').value;
    renderGeneratorResult(length);
  });
}

// ==============================
// Service Worker 登録
// ==============================
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => {
        console.log('[SW] 登録成功:', reg.scope);
      })
      .catch(err => {
        console.warn('[SW] 登録失敗:', err);
      });
  }
}

// ==============================
// 初期化
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initEvents();
  registerServiceWorker();
});
