const CACHE_VERSION = 'byebyesmoke-v4';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const CDN_CACHE = `${CACHE_VERSION}-cdn`;

// Essential files to cache immediately
const STATIC_ASSETS = [
  './index.html',
  './login.html',
  './register.html',
  './manifest.json',
  './styles.css'
];

// Install event - cache essential files
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[Service Worker] Caching essential files');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.error('[Service Worker] Cache failed:', err))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheName.startsWith(CACHE_VERSION)) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip caching for Firebase/Firestore API calls
  if (url.hostname.includes('firebase') ||
      url.hostname.includes('firestore') ||
      url.hostname.includes('googleapis')) {
    return; // Let Firebase handle its own requests
  }

  // Different strategies based on request type
  if (request.method !== 'GET') {
    return; // Only cache GET requests
  }

  event.respondWith(handleFetch(request, url));
});

async function handleFetch(request, url) {
  // Strategy 1: Cache-First for static assets (JS, CSS, Images, Fonts)
  if (isStaticAsset(url)) {
    return cacheFirst(request, STATIC_CACHE);
  }

  // Strategy 2: Cache-First for CDN resources (Chart.js, etc.)
  if (isCDNResource(url)) {
    return cacheFirst(request, CDN_CACHE);
  }

  // Strategy 3: Network-First for HTML pages
  if (isHTMLRequest(request)) {
    return networkFirst(request, DYNAMIC_CACHE);
  }

  // Default: Network-First
  return networkFirst(request, DYNAMIC_CACHE);
}

// Cache-First Strategy: Try cache, fallback to network
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      // Update cache in background if it's more than 1 day old
      updateCacheInBackground(request, cacheName);
      return cachedResponse;
    }

    // Not in cache - fetch from network
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Cache-First failed:', error);

    // Try cache as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page or error
    return new Response('Offline - Ressource nicht verfügbar', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Network-First Strategy: Try network, fallback to cache
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', request.url);

    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // For HTML requests, try to return cached index.html
    if (isHTMLRequest(request)) {
      const indexCache = await caches.match('./index.html');
      if (indexCache) return indexCache;
    }

    return new Response('Offline - Keine Verbindung', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Update cache in background (Stale-While-Revalidate)
async function updateCacheInBackground(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    // Silently fail - we already served from cache
  }
}

// Helper functions to identify request types
function isStaticAsset(url) {
  const pathname = url.pathname;
  return pathname.endsWith('.js') ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.jpeg') ||
         pathname.endsWith('.svg') ||
         pathname.endsWith('.gif') ||
         pathname.endsWith('.webp') ||
         pathname.endsWith('.woff') ||
         pathname.endsWith('.woff2') ||
         pathname.endsWith('.ttf') ||
         pathname.endsWith('.eot');
}

function isCDNResource(url) {
  return url.hostname.includes('cdn.jsdelivr.net') ||
         url.hostname.includes('cdnjs.cloudflare.com') ||
         url.hostname.includes('unpkg.com');
}

function isHTMLRequest(request) {
  return request.headers.get('accept')?.includes('text/html');
}

// Notification click event - open app when notification is clicked
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification clicked:', event.notification.tag);

  event.notification.close();

  // Open or focus the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes('/index.html') && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow('./index.html');
        }
      })
  );
});

// Notification close event - track if user dismissed notification
self.addEventListener('notificationclose', event => {
  console.log('[Service Worker] Notification closed:', event.notification.tag);
});
