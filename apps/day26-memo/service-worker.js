// Service Worker for MemoPad PWA
// オフラインでも基本機能が使えるよう、必要なファイルをキャッシュします

const CACHE_NAME = 'memopad-cache-v1';

// キャッシュするファイル一覧
const CACHE_FILES = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icons/icon.svg'
];

// インストール時：必要なファイルをキャッシュに保存
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_FILES))
      .then(() => self.skipWaiting()) // 即座にアクティブ化
  );
});

// アクティベーション時：古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim()) // 全クライアントを即座に制御下に
  );
});

// フェッチ時：キャッシュ優先（オフライン対応）、なければネットワークから取得
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
      .catch(() => {
        // ネットワークもキャッシュもない場合はindex.htmlにフォールバック
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
});
