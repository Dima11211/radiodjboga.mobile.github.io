// sw.js - Service Worker для кэширования аудио-потока

const CACHE_NAME = 'radio-cache-v1';
const STREAM_URL = 'https://radio.radiodjboga.online/stream';

self.addEventListener('install', event => {
    console.log('📦 SW установлен');
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
    console.log('✅ SW активирован');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    if (event.request.url.includes('/stream')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clonedResponse);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
    }
});
