/* =====================================================
   Service Worker - Day15 年齢計算機
   オフライン時でもアプリシェルが開けるようにキャッシュする
===================================================== */

const CACHE_NAME = 'day15-age-v1';

// キャッシュするリソース（アプリシェル）
const APP_SHELL = [
  './index.html',
  './manifest.webmanifest',
  'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700&display=swap',
];

/* インストール: アプリシェルをキャッシュ */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // フォントは opaque レスポンスになりうるので個別にエラーを無視
      return Promise.allSettled(
        APP_SHELL.map(url => cache.add(url).catch(() => {}))
      );
    })
  );
  self.skipWaiting();
});

/* アクティベート: 古いキャッシュを削除 */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* フェッチ: Cache First（アプリシェル）/ Network First（API） */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Open-Meteo API はネットワーク優先（オフライン時はエラー）
  if (url.hostname.includes('open-meteo.com')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({ error: 'offline' }), {
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
    return;
  }

  // Google Fonts / アプリシェルはキャッシュ優先
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // 正常レスポンスのみキャッシュに追加
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // オフライン時: index.html へフォールバック
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
