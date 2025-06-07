// AI Chatbot PWA Service Worker
// Handles offline caching and background sync

const CACHE_NAME = 'chatbot-v1';
const STATIC_CACHE_NAME = 'chatbot-static-v1';

// Static assets to cache for offline use
const STATIC_ASSETS = [
	'/',
	'/index.html',
	'/src/main.tsx',
	'/src/App.tsx',
	// Add other critical assets
];

// API endpoints that should be cached
const CACHE_API_PATTERNS = [
	'/api/auth/profile',
	'/api/conversations',
	'/api/messages',
];

// API endpoints that require online connection (AI features)
const ONLINE_ONLY_PATTERNS = [
	'/api/ai/',
	'/api/chat/',
	'openrouter.ai',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
	console.log('🔧 Service Worker: Installing...');

	event.waitUntil(
		caches
			.open(STATIC_CACHE_NAME)
			.then((cache) => {
				console.log(
					'📦 Service Worker: Caching static assets'
				);
				return cache.addAll(STATIC_ASSETS);
			})
			.then(() => {
				console.log(
					'✅ Service Worker: Installation complete'
				);
				return self.skipWaiting();
			})
	);
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
	console.log('🚀 Service Worker: Activating...');

	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						if (
							cacheName !== CACHE_NAME &&
							cacheName !== STATIC_CACHE_NAME
						) {
							console.log(
								'🗑️ Service Worker: Deleting old cache:',
								cacheName
							);
							return caches.delete(cacheName);
						}
					})
				);
			})
			.then(() => {
				console.log(
					'✅ Service Worker: Activation complete'
				);
				return self.clients.claim();
			})
	);
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests
	if (request.method !== 'GET') {
		return;
	}

	// Handle different types of requests
	if (isStaticAsset(url)) {
		event.respondWith(handleStaticAsset(request));
	} else if (isAPIRequest(url)) {
		event.respondWith(handleAPIRequest(request));
	} else if (isOnlineOnlyRequest(url)) {
		event.respondWith(handleOnlineOnlyRequest(request));
	} else {
		event.respondWith(handleDefaultRequest(request));
	}
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
	console.log(
		'🔄 Service Worker: Background sync triggered:',
		event.tag
	);

	if (event.tag === 'offline-data-sync') {
		event.waitUntil(syncOfflineData());
	}
});

// Message event for communication with main app
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}

	if (event.data && event.data.type === 'SYNC_DATA') {
		// Trigger manual sync
		syncOfflineData();
	}
});

// Helper functions

function isStaticAsset(url) {
	return (
		url.origin === self.location.origin &&
		(url.pathname.startsWith('/assets/') ||
			url.pathname.endsWith('.js') ||
			url.pathname.endsWith('.css') ||
			url.pathname.endsWith('.png') ||
			url.pathname.endsWith('.jpg') ||
			url.pathname.endsWith('.svg'))
	);
}

function isAPIRequest(url) {
	return (
		url.pathname.startsWith('/api/') &&
		CACHE_API_PATTERNS.some((pattern) =>
			url.pathname.startsWith(pattern)
		)
	);
}

function isOnlineOnlyRequest(url) {
	return ONLINE_ONLY_PATTERNS.some(
		(pattern) =>
			url.pathname.includes(pattern) ||
			url.hostname.includes(pattern)
	);
}

// Cache-first strategy for static assets
async function handleStaticAsset(request) {
	try {
		const cache = await caches.open(STATIC_CACHE_NAME);
		const cachedResponse = await cache.match(request);

		if (cachedResponse) {
			return cachedResponse;
		}

		const networkResponse = await fetch(request);
		if (networkResponse.status === 200) {
			cache.put(request, networkResponse.clone());
		}

		return networkResponse;
	} catch (error) {
		console.log('❌ Static asset fetch failed:', error);
		return new Response(
			'Offline - Asset not available',
			{ status: 503 }
		);
	}
}

// Network-first with cache fallback for API requests
async function handleAPIRequest(request) {
	try {
		const networkResponse = await fetch(request);

		if (networkResponse.status === 200) {
			const cache = await caches.open(CACHE_NAME);
			cache.put(request, networkResponse.clone());
		}

		return networkResponse;
	} catch (error) {
		console.log(
			'🔄 API request failed, trying cache:',
			request.url
		);

		const cache = await caches.open(CACHE_NAME);
		const cachedResponse = await cache.match(request);

		if (cachedResponse) {
			return cachedResponse;
		}

		return new Response(
			JSON.stringify({
				success: false,
				message:
					'Offline - Please check your connection',
				offline: true,
			}),
			{
				status: 503,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}
}

// Online-only requests (AI features)
async function handleOnlineOnlyRequest(request) {
	if (!navigator.onLine) {
		return new Response(
			JSON.stringify({
				success: false,
				message:
					'AI features require an internet connection',
				requiresOnline: true,
			}),
			{
				status: 503,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}

	try {
		return await fetch(request);
	} catch (error) {
		return new Response(
			JSON.stringify({
				success: false,
				message:
					'AI service temporarily unavailable',
				serviceError: true,
			}),
			{
				status: 503,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}
}

// Default cache-first strategy
async function handleDefaultRequest(request) {
	try {
		// Skip caching chrome-extension URLs
		const url = new URL(request.url);
		if (url.protocol === 'chrome-extension:') {
			return fetch(request);
		}

		const cache = await caches.open(CACHE_NAME);
		const cachedResponse = await cache.match(request);

		if (cachedResponse) {
			return cachedResponse;
		}

		const networkResponse = await fetch(request);
		if (networkResponse.status === 200) {
			cache.put(request, networkResponse.clone());
		}

		return networkResponse;
	} catch (error) {
		// Return offline page for navigation requests
		if (request.mode === 'navigate') {
			const cache = await caches.open(
				STATIC_CACHE_NAME
			);
			return cache.match('/index.html');
		}

		return new Response('Offline', { status: 503 });
	}
}

// Sync offline data when connection is restored
async function syncOfflineData() {
	try {
		console.log('🔄 Syncing offline data...');

		// Send message to main app to trigger sync
		const clients = await self.clients.matchAll();
		clients.forEach((client) => {
			client.postMessage({
				type: 'SYNC_OFFLINE_DATA',
			});
		});

		console.log('✅ Offline data sync initiated');
	} catch (error) {
		console.error(
			'❌ Offline data sync failed:',
			error
		);
	}
}

console.log('Service Worker: Loaded and ready');
