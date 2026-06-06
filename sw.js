// sw.js - Service Worker для фонового воспроизведения
const CACHE_NAME = 'radio-cache-v1';
const STREAM_URL = 'https://radio.radiodjboga.online/stream';

// Установка Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker installed');
    event.waitUntil(self.skipWaiting());
});

// Активация
self.addEventListener('activate', event => {
    console.log('Service Worker activated');
    event.waitUntil(self.clients.claim());
});

// Обработка fetch запросов для поддержки офлайн
self.addEventListener('fetch', event => {
    // Для аудио потока - особая обработка
    if (event.request.url.includes('/stream')) {
        event.respondWith(
            fetch(event.request).catch(() => {
                // Если нет интернета, возвращаем пустой ответ
                return new Response(null, { status: 200, headers: { 'Content-Type': 'audio/mpeg' } });
            })
        );
    }
});

// Сообщения от страницы
self.addEventListener('message', event => {
    if (event.data.type === 'PLAY_STATE') {
        console.log('Play state changed:', event.data.isPlaying);
    }
});
