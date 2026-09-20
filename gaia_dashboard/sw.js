const CACHE_NAME = 'terranova-v1';
const ASSETS_TO_CACHE = [
    './',
    'index.html',
    'fournisseurs.html',
    'analyse_financiere.html',
    'plan_parfait_arganier.html',
    'styles/moroccan-theme.css',
    'scripts/crop_manager.js',
    'data/crop_config.js',
    'data/zoning_simulation.js',
    'data/plan_arganier_data.js',
    'data/today_planning_data.js',
    '../lang-data.js',
    '../lang-system.js',
    '../images/imagefav.png',
    '../images/moroccan_zellige.png'
];


// Install event - Cache core assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch(err => console.error('Cache addAll failed:', err))
    );
});

// Fetch event - Serve from cache first, then network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Return cached response if found
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // Otherwise fetch from network
                return fetch(event.request).then(
                    response => {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
    const cacheWhiteList = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhiteList.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
