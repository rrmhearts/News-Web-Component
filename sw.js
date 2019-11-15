const cacheName = 'news-v1';
const staticAssets = [
  './',
  './index.html',
  './styles.css',
  './index.js',
  './newsApi.js',
  './news-article.js'
];

/* cache static assets for local use offline
  An install event is the most basic example of a service worker.
  Please see https://developers.google.com/web/fundamentals/primers/service-workers
  for more information!
*/
self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets); // this is the standard way of doing this.
  return self.skipWaiting(); // move to "activate phase" when new service worker takes over...
});

self.addEventListener('activate', e => {
  self.clients.claim(); // service running app immediately.
});

/* intercept fetch requests. Handle with local resource first before going to network. 
  This occurs on refresh or navigation actions. Standard action in a sw. See bottom of file.
*/
self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req); // does something in cache match the request.
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone()); // put fetched news in cache
    return fresh; // return new news.
  } catch (e) {
    const cached = await cache.match(req); // fallback on cache if possible.
    return cached;
  }
}

/*
  // Google's version of a sw fetch command for same purpose as above.

  self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});


// What we are doing is this:

// 1. Add a callback to .then() on the fetch request.
// 2. Once we get a response, we perform the following checks:
//    a. Ensure the response is valid.
//    b. Check the status is 200 on the response.
//    c. Make sure the response type is basic, which indicates that it's a request from our origin.
         This means that requests to third party assets aren't cached as well.
// 3. If we pass the checks, we clone the response. The reason for this is that because the response
      is a Stream, the body can only be consumed once. Since we want to return the response for the
      browser to use, as well as pass it to the cache to use, we need to clone it so we can send one
      to the browser and one to the cache.

Again see, https://developers.google.com/web/fundamentals/primers/service-workers for more info
*/