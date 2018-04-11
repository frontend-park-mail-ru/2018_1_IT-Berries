const CACHE_NAME = 'offline-v1';

const urlsToCache = [
  '/',
  
  /*
   '/login',
  '/signup',
  '/profile',
  '/scoreboard',
  '/game-mode',
  '/settings',
  '/about',*/


  '/public/project/common.blocks/form/form.js',
  '/public/project/common.blocks/form/form.tmpl.js',
  '/public/project/common.blocks/form/__message/form__message.js',
  '/public/project/common.blocks/form/__message/form__message.tmpl.js',
  '/public/project/common.blocks/scoreboard/__table/scoreboard__table.js',
  '/public/project/common.blocks/scoreboard/__table/scoreboard__table..tmpl.js',
  '/public/project/common.blocks/scoreboard/__paginator/scoreboard__paginator.js',
  '/public/project/common.blocks/scoreboard/__paginator/scoreboard__paginator..tmpl.js',

  '/public/project/models/users-model.js',

  '/public/project/modules/add-sw.js',
  '/public/project/modules/event-bus.js',
  '/public/project/modules/http.js',
  '/public/project/modules/router.js',

  '/public/project/utils/noop.js',

  '/public/project/views/view/view.js',
  '/public/project/views/about-view/about-view.js',
  '/public/project/views/about-view/about-view.tmpl.js',
  '/public/project/views/game-mode-view/game-mode-view.js',
  '/public/project/views/game-mode-view/game-mode-view.tmpl.js',
  '/public/project/views/login-view/login-view.js',
  '/public/project/views/login-view/login-view.tmpl.js',
  '/public/project/views/menu-view/menu-view.js',
  '/public/project/views/menu-view/menu-view.tmpl.js',
  '/public/project/views/profile-view/profile-view.js',
  '/public/project/views/profile-view/profile-view.tmpl.js',
  '/public/project/views/scoreboard-view/scoreboard-view.js',
  '/public/project/views/scoreboard-view/scoreboard-view.tmpl.js',
  '/public/project/views/settings-view/settings-view.js',
  '/public/project/views/settings-view/settings-view.tmpl.js',
  '/public/project/views/signup-view/signup-view.js',
  '/public/project/views/signup-view/signup-view.tmpl.js',

  '/public/project/application.js'
];

this.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error('can not install SW, error with caches.open: ', err);
      })
  );
});

/*

// Это версия для того, чтобы не хардкодить файлики,
// но в ней не работает response.clone() (ругается, шо так нельзя)
// почему - пока не поняла

this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, response.clone());
        });
        return response;
      });
    }).catch(function() {
      console.error('you are offline and no cache for this: ', event);
      return caches.match('/offline.html');
    })
  );
});

*/


this.addEventListener('fetch', (event) => {

  console.log('navigator online: ', navigator.onLine);

  // online first
  if (navigator.onLine) {
    console.log('in online sw fetch');
    return fetch(event.request);
  }

  // go to cache
  event.respondWith(
    caches
      .match(event.request)
      .then((cachedResponse) => {

        if (cachedResponse) {
          console.log('in offline, cache exists');
          return cachedResponse;
        }

        console.log('no cache match=(');
        return fetch(event.request);
      })
      .catch((err) => {
        console.error('error with caches.match: ', err);
      })
  );
});
