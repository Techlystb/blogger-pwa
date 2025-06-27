// Versioned cache name
const CACHE_NAME = 'blog-cache-v1';

// ফাইল যেগুলো প্রথমবার ইন্সটল করার সময় ক্যাশে রাখতে চান
const URLS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install ইভেন্টে ক্যাশ তৈরি
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate ইভেন্টে পুরনো ক্যাশ মুছে ফেলে নতুন ভার্সন চালু
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch ইভেন্টে: ক্যাশে থাকে সে ফাইল সার্ভ, না থাকলে নেটওয়ার্ক থেকে নিয়ে আসে
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedRes => {
      return cachedRes || fetch(event.request);
    })
  );
});
