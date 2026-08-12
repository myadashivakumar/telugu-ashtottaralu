const CACHE_NAME = "ashtottara-vintage-v3";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-180.png",
  "./images/deities/ganesha.jpg",
  "./images/deities/vishnu.jpg",
  "./images/deities/shiva.jpg",
  "./images/deities/lakshmi.jpg",
  "./images/deities/durga.jpg",
  "./images/deities/saraswati.jpg",
  "./images/deities/hanuman.jpg",
  "./images/deities/subrahmanya.jpg",
  "./images/deities/saibaba.jpg",
  "./images/deities/rama.jpg",
  "./images/deities/krishna.jpg",
  "./images/deities/narasimha.jpg",
  "./images/deities/ayyappa.jpg",
  "./images/deities/satyanarayana.jpg",
  "./images/deities/navagraha.jpg",
  "./images/deities/adityahrudayam.jpg"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// Cache-first for app shell assets; network-first fallback to cache for everything else
// (e.g. Google Fonts) so the first online visit caches fonts for later offline use.
self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  var isSameOrigin = url.origin === self.location.origin;

  if (isSameOrigin) {
    event.respondWith(
      caches.match(req).then(function (cached) {
        return cached || fetch(req).then(function (res) {
          var resClone = res.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(req, resClone); });
          return res;
        });
      }).catch(function () { return caches.match("./index.html"); })
    );
  } else {
    // font files etc: try network, fall back to cache
    event.respondWith(
      fetch(req).then(function (res) {
        var resClone = res.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(req, resClone); });
        return res;
      }).catch(function () { return caches.match(req); })
    );
  }
});
