/**
 * カウントダウンアプリ - Service Worker
 *
 * 戦略:
 *   - インストール時に主要ファイルをキャッシュ
 *   - フェッチ時は Cache First（キャッシュにあれば使う / なければネット）
 *   - Google Fonts は Network First（更新を優先）
 *   - オフライン時でもアプリが表示できる
 *
 * GitHub Pages での注意:
 *   - service-worker.js はルートに置かれるべきだが、サブディレクトリの場合は
 *     scope がそのディレクトリに限定される（自動）
 *   - start_url が "./" でも index.html を明示すると安全
 *
 * ローカル起動時:
 *   - http-server や VS Code Live Server 等で HTTPS または localhost で動かすこと
 *   - file:// プロトコルでは Service Worker は動作しない
 */

'use strict';

const CACHE_NAME = 'countdown-v1';

// キャッシュするリソース（相対パス）
const PRECACHE_URLS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
];

/* ===== インストール: 必須ファイルをプリキャッシュ ===== */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()) // 即アクティブ化
  );
});

/* ===== アクティベート: 古いキャッシュを削除 ===== */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim()) // 既存タブも即制御
  );
});

/* ===== フェッチ: Cache First 戦略 ===== */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Google Fonts は Network First（最新フォントを優先）
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(networkFirst(request));
    return;
  }

  // その他は Cache First
  event.respondWith(cacheFirst(request));
});

/** Cache First: キャッシュにあれば返す、なければネットから取得してキャッシュ */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    // GET リクエストかつ成功した場合のみキャッシュ
    if (request.method === 'GET' && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // オフライン時: index.html をフォールバックとして返す
    const fallback = await caches.match('./index.html');
    return fallback || new Response('オフラインです。再接続してください。', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

/** Network First: ネットを優先、失敗したらキャッシュ */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (request.method === 'GET' && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('', { status: 503 });
  }
}
