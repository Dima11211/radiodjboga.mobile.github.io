// sw.js - Service Worker для кэширования аудио-потока

const CACHE_NAME = 'radio-cache-v1';
const STREAM_URL = 'https://radio.radiodjboga.online/stream';

// Установка Service Worker
self.addEventListener('install', event => {
    console.log('📦 Service Worker установлен');
    event.waitUntil(self.skipWaiting());
});

// Активация
self.addEventListener('activate', event => {
    console.log('✅ Service Worker активирован');
    event.waitUntil(self.clients.claim());
});

// Перехват запросов
self.addEventListener('fetch', event => {
    // Проверяем, запрос к аудио-потоку
    if (event.request.url.includes('/stream')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Кэшируем каждый успешный ответ
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clonedResponse);
                    });
                    return response;
                })
                .catch(() => {
                    // Если интернета нет — отдаём из кэша
                    return caches.match(event.request)
                        .then(cachedResponse => {
                            if (cachedResponse) {
                                console.log('📡 Аудио из кэша');
                                return cachedResponse;
                            }
                            // Если кэша нет — возвращаем пустой ответ
                            return new Response(null, {
                                status: 200,
                                headers: { 'Content-Type': 'audio/mpeg' }
                            });
                        });
                })
        );
    }
});
