const CACHE_NAME = 'offline-v2';

// regexp to cache only static files
let cacheRegExp = new RegExp('(' + [
  '.(css|js|woff2?|ttf|png|jpe?g)'
].join('(/?)|\\') + ')$');


function getFetchedOrCached(event) {
  return caches.match(event.request).then(function(resp) {
    return resp || fetch(event.request).then(function(response) {
      return caches.open(CACHE_NAME).then(function(cache) {
        cache.put(event.request, response.clone());
        return response;
      });
    });
  }).catch(function() {
    return caches.match('/');
  });
}

self.addEventListener('fetch', function (event) {
  if (!cacheRegExp.test(event.request.url)) {

    // request will be networked
    return;
  }
  event.respondWith(getFetchedOrCached(event));
});

