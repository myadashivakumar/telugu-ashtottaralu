const CACHE_NAME = "ashtottara-pwa-new-app-v13";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data.js",
  "./data/ganesha.js",
  "./data/vishnu.js",
  "./data/venkateswara.js",
  "./data/shiva.js",
  "./data/kedareshwara-vratham.js",
  "./data/lakshmi.js",
  "./data/varalakshmi-vratham.js",
  "./data/durga.js",
  "./data/saraswati.js",
  "./data/hanuman.js",
  "./data/subrahmanya.js",
  "./data/sai-baba.js",
  "./data/rama.js",
  "./data/krishna.js",
  "./data/ayyappa.js",
  "./data/narasimha.js",
  "./data/satyanarayana.js",
  "./data/navagraha.js",
  "./data/aditya-hrudayam.js",
  "./suncalc.js",
  "./panchangam.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-180.png"
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
