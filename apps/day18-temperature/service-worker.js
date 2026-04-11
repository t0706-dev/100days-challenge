const CACHE_NAME = 'temp-converter-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon.svg',
  'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&display=swap',
];

// インストール時：キャッシュに保存
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS.map(url => {
        // Googleフォントはno-corsで取得
        if (url.startsWith('https://fonts.')) {
          return new Request(url, { mode: 'no-cors' });
        }
        return url;
      }));
    }).catch(() => {
      // フォントのキャッシュ失敗は無視（オフライン時にfallback）
      return caches.open(CACHE_NAME).then(cache =>
        cache.addAll(['./', './index.html', './style.css', './script.js', './manifest.json'])
      );
    })
  );
  self.skipWaiting();
});

// アクティベート時：古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// フェッチ時：Cache First 戦略
self.addEventListener('fetch', event => {
  // chrome-extension や非 http(s) リクエストはスキップ
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // レスポンスが有効な場合のみキャッシュ
        if (response && response.status === 200 && response.type !== 'opaque') {
          const toCache = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
        }
        return response;
      }).catch(() => {
        // オフライン時のフォールバック（HTML リクエストの場合）
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
