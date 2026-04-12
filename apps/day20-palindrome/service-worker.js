/* ==============================
   Service Worker - 回文チェッカー
============================== */

const CACHE_NAME = 'palindrome-checker-v2';

// キャッシュ対象ファイル
const CACHE_FILES = [
  './index.html',
  './style.css',
  './script.js',
  './manifest.json'
];

// インストール時：キャッシュに保存
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] キャッシュ保存中...');
      return cache.addAll(CACHE_FILES);
    })
  );
  self.skipWaiting();
});

// アクティベート時：古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] 古いキャッシュ削除:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// フェッチ時：キャッシュ優先（Cache First）
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        return cached;
      }
      // キャッシュになければネットワークから取得
      return fetch(event.request).catch(() => {
        // オフライン時のフォールバック（HTMLリクエストの場合）
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
