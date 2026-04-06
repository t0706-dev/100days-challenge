/**
 * BMI記録アプリ - Service Worker
 * =============================
 * - アプリに必要なファイルをキャッシュする
 * - オフライン時でもアプリが開けるようにする
 * - キャッシュ戦略: Cache First（キャッシュがあればそれを返す）
 */

// ===== キャッシュ設定 =====

/** キャッシュ名（バージョンを変えると古いキャッシュを削除できる） */
const CACHE_NAME = 'bmi-app-v1';

/**
 * キャッシュするファイルの一覧
 * ※ Chart.js CDN は別扱い（NetworkFirst戦略）
 */
const CACHE_FILES = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

/** Chart.js CDN のURL（ネットワーク優先でキャッシュにもフォールバック） */
const CHART_JS_URL = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';

// ===== install イベント =====
// Service Worker インストール時にキャッシュを作成する

self.addEventListener('install', event => {
  console.log('[SW] install');

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] キャッシュを作成:', CACHE_NAME);

      // メインファイルをキャッシュ（Chart.js は別途処理）
      return cache.addAll(CACHE_FILES).catch(err => {
        // アイコンがまだない場合もあるため、個別にエラーを吸収
        console.warn('[SW] 一部ファイルのキャッシュに失敗（アイコン未生成の可能性）:', err);
      });
    })
  );

  // 新しいSWを即座にアクティブにする
  self.skipWaiting();
});

// ===== activate イベント =====
// 古いキャッシュを削除する

self.addEventListener('activate', event => {
  console.log('[SW] activate');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME) // 現在のキャッシュ以外
          .map(name => {
            console.log('[SW] 古いキャッシュを削除:', name);
            return caches.delete(name);
          })
      );
    })
  );

  // すべてのクライアントを即座にコントロール下に置く
  self.clients.claim();
});

// ===== fetch イベント =====
// リクエストをインターセプトしてキャッシュから返す

self.addEventListener('fetch', event => {
  const requestUrl = event.request.url;

  // Chart.js CDN: ネットワーク優先 → フォールバックでキャッシュ
  if (requestUrl.includes('cdn.jsdelivr.net') || requestUrl.includes('chart.js')) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }

  // Google Fonts: ネットワーク優先（オフライン時はフォントなしでも動作）
  if (requestUrl.includes('fonts.googleapis.com') || requestUrl.includes('fonts.gstatic.com')) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }

  // その他のリクエスト: キャッシュ優先 → フォールバックでネットワーク
  event.respondWith(cacheFirstStrategy(event.request));
});

// ===== キャッシュ戦略 =====

/**
 * Cache First 戦略
 * キャッシュにあればキャッシュを返し、なければネットワークから取得してキャッシュに追加する
 * @param {Request} request
 */
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse; // キャッシュヒット
  }

  try {
    // キャッシュにない場合はネットワークから取得
    const networkResponse = await fetch(request);

    // 成功したレスポンスをキャッシュに保存（GETのみ）
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (err) {
    // ネットワークもキャッシュも失敗した場合（オフライン時など）
    console.warn('[SW] リクエスト失敗:', request.url, err);

    // HTMLリクエストの場合はindex.htmlを返す（SPA的なフォールバック）
    if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
      const fallback = await caches.match('./index.html');
      if (fallback) return fallback;
    }

    return new Response('オフラインです。インターネット接続を確認してください。', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

/**
 * Network First 戦略
 * まずネットワークから取得し、失敗したらキャッシュにフォールバックする
 * @param {Request} request
 */
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);

    // 成功したらキャッシュにも保存
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (err) {
    // ネットワーク失敗時はキャッシュにフォールバック
    console.warn('[SW] ネットワーク取得失敗、キャッシュを使用:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    return new Response('', { status: 503 });
  }
}
