/**
 * 高機能文字数カウントツール - Service Worker
 * =============================================
 * - アプリに必要なファイルをキャッシュする
 * - オフライン時でもアプリが開けるようにする
 * - キャッシュ戦略: Cache First（キャッシュがあればそれを返す）
 */

// ===== キャッシュ設定 =====

/** キャッシュ名（バージョンを変えると古いキャッシュを削除できる） */
const CACHE_NAME = 'charcount-app-v1';

/** キャッシュするファイルの一覧 */
const CACHE_FILES = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// ===== install イベント =====
// Service Worker インストール時にキャッシュを作成する

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_FILES).catch(err => {
        console.warn('[SW] 一部ファイルのキャッシュに失敗:', err);
      });
    })
  );
  // 新しい SW を即座にアクティブにする
  self.skipWaiting();
});

// ===== activate イベント =====
// 古いキャッシュを削除する

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  // すべてのクライアントを即座にコントロール下に置く
  self.clients.claim();
});

// ===== fetch イベント =====
// リクエストをインターセプトしてキャッシュから返す

self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Google Fonts: ネットワーク優先（オフライン時はシステムフォントで表示）
  if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }

  // その他: キャッシュ優先
  event.respondWith(cacheFirstStrategy(event.request));
});

// ===== キャッシュ戦略 =====

/**
 * Cache First 戦略
 * キャッシュにあればキャッシュを返し、なければネットワークから取得してキャッシュに追加する
 */
async function cacheFirstStrategy(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok && request.method === 'GET') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // HTML リクエストのフォールバック
    if (request.headers.get('accept')?.includes('text/html')) {
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
 */
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    if (response.ok && request.method === 'GET') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response('', { status: 503 });
  }
}
