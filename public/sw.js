const CACHE_NAME = 'offline-v1';

this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        return caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch(function() {
      console.error('you are offline and no cache for this: ', event);
      return caches.match('/');
    })
  );
});

