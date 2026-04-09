'use strict';

// キャッシュ名にバージョンを持たせる（更新時はここを変える）
const CACHE_NAME = 'tax-calc-v1.0.0';

// キャッシュ対象ファイル
const CACHE_URLS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json'
];

// Google Fonts のホスト名
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

// ============================================================
// インストール：必須ファイルをキャッシュ
// ============================================================
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_URLS))
      .then(() => self.skipWaiting()) // 即座にアクティベート
  );
});

// ============================================================
// アクティベート：古いキャッシュを削除
// ============================================================
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key  => caches.delete(key))
      ))
      .then(() => self.clients.claim()) // 既存タブにも即適用
  );
});

// ============================================================
// フェッチ戦略
//   Google Fonts → ネットワーク優先（オフライン時はキャッシュ）
//   同一オリジン  → キャッシュ優先（ミスならネットワーク取得 & キャッシュ保存）
// ============================================================
self.addEventListener('fetch', event => {
  const { request } = event;

  // GET 以外は素通し
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Google Fonts：ネットワーク優先 + キャッシュフォールバック
  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(networkFirstWithCache(request));
    return;
  }

  // 同一オリジン：キャッシュ優先 + ネットワークフォールバック
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirstWithNetwork(request));
    return;
  }
});

// ネットワーク優先
async function networkFirstWithCache(request) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || Response.error();
  }
}

// キャッシュ優先
async function cacheFirstWithNetwork(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.ok && response.type === 'basic') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // 完全オフライン時は index.html にフォールバック
    const fallback = await caches.match('./index.html');
    return fallback || Response.error();
  }
}
