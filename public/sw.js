const CACHE_NAME = 'ai-chatbot-v3';
const OFFLINE_CACHE = 'ai-chatbot-offline-v3';
const CONVERSATIONS_CACHE = 'ai-chatbot-conversations-v3';

// Core files to cache for offline functionality
const STATIC_CACHE_URLS = [
	'/',
	'/index.html',
	'/manifest.json',
	'/icon-192x192.png',
	'/icon-512x512.png',
	// Add Boxicons for offline icons
	'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
	console.log('Service Worker: Installing...');

	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => {
				console.log(
					'Service Worker: Caching static files'
				);
				return cache.addAll(
					STATIC_CACHE_URLS.map((url) => {
						// Handle external URLs gracefully
						try {
							return new Request(url, {
								mode: 'no-cors',
							});
						} catch (error) {
							console.warn(
								`Failed to cache ${url}:`,
								error
							);
							return url;
						}
					})
				);
			})
			.catch((error) => {
				console.error(
					'Service Worker: Cache installation failed:',
					error
				);
			})
	);

	// Immediately activate the new service worker
	self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
	console.log('Service Worker: Activating...');

	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						if (
							cacheName !== CACHE_NAME &&
							cacheName !== OFFLINE_CACHE &&
							cacheName !==
								CONVERSATIONS_CACHE
						) {
							console.log(
								'Service Worker: Deleting old cache:',
								cacheName
							);
							return caches.delete(cacheName);
						}
					})
				);
			})
			.then(() => {
				console.log(
					'Service Worker: Activated and ready'
				);
				return self.clients.claim();
			})
	);
});

// Message handler for SKIP_WAITING
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
	// Only handle GET requests
	if (event.request.method !== 'GET') {
		return;
	}

	// Skip chrome-extension and non-http requests
	if (!event.request.url.startsWith('http')) {
		return;
	}

	// List of deleted files that should not be served from cache
	const deletedFiles = [
		'/src/utils/documentProcessor.ts',
		'/src/components/chat/DocumentUpload.tsx',
		'/src/components/VoiceControls.tsx',
		'/src/types/global.d.ts',
		'/src/components/AudioMessageRecorder.tsx',
	];

	// Check if the request is for a deleted file
	const isDeletedFile = deletedFiles.some((file) =>
		event.request.url.includes(file)
	);

	if (isDeletedFile) {
		// Return a 404 response for deleted files
		event.respondWith(
			new Response('File not found', {
				status: 404,
				statusText: 'Not Found',
			})
		);
		return;
	}

	event.respondWith(
		caches
			.match(event.request)
			.then((cachedResponse) => {
				// Try to fetch from network first for development
				return fetch(event.request)
					.then((response) => {
						// Check if response is valid
						if (
							!response ||
							response.status !== 200 ||
							response.type !== 'basic'
						) {
							// If network fails and we have cache, use it
							if (cachedResponse) {
								console.log(
									'Service Worker: Network failed, serving from cache:',
									event.request.url
								);
								return cachedResponse;
							}
							return response;
						}

						// Clone response for caching
						const responseToCache =
							response.clone();

						// Cache the response for future use
						caches
							.open(CACHE_NAME)
							.then((cache) => {
								cache.put(
									event.request,
									responseToCache
								);
							});

						return response;
					})
					.catch((error) => {
						// Return cached version if available
						if (cachedResponse) {
							console.log(
								'Service Worker: Serving from cache:',
								event.request.url
							);
							return cachedResponse;
						}

						console.log(
							'Service Worker: Network failed, serving offline page'
						);

						// For navigation requests, serve a basic offline page
						if (
							event.request.destination ===
							'document'
						) {
							return caches.match(
								'/index.html'
							);
						}

						// For other requests, return a basic error response
						return new Response(
							JSON.stringify({
								error: 'Offline',
								message:
									'This feature requires an internet connection',
							}),
							{
								status: 503,
								statusText:
									'Service Unavailable',
								headers: new Headers({
									'Content-Type':
										'application/json',
								}),
							}
						);
					});
			})
	);
});

// Background sync for conversation data
self.addEventListener('sync', (event) => {
	console.log(
		'Service Worker: Background sync triggered:',
		event.tag
	);

	if (event.tag === 'conversations-sync') {
		event.waitUntil(syncConversations());
	}
});

// Background sync handler
async function syncConversations() {
	try {
		console.log(
			'Service Worker: Syncing conversations...'
		);

		// Get conversations from IndexedDB (we'll implement this)
		const conversations =
			await getStoredConversations();

		// Send to all clients for processing
		const clients = await self.clients.matchAll();
		clients.forEach((client) => {
			client.postMessage({
				type: 'CONVERSATIONS_SYNC',
				conversations: conversations,
			});
		});

		console.log(
			'Service Worker: Conversations synced successfully'
		);
	} catch (error) {
		console.error(
			'Service Worker: Conversation sync failed:',
			error
		);
	}
}

// IndexedDB helpers for conversation storage
async function getStoredConversations() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open('ai-chatbot-db', 1);

		request.onerror = () => reject(request.error);

		request.onsuccess = () => {
			const db = request.result;
			const transaction = db.transaction(
				['conversations'],
				'readonly'
			);
			const store =
				transaction.objectStore('conversations');
			const getAllRequest = store.getAll();

			getAllRequest.onsuccess = () => {
				resolve(getAllRequest.result || []);
			};

			getAllRequest.onerror = () =>
				reject(getAllRequest.error);
		};

		request.onupgradeneeded = (event) => {
			const db = event.target.result;
			if (
				!db.objectStoreNames.contains(
					'conversations'
				)
			) {
				const store = db.createObjectStore(
					'conversations',
					{ keyPath: 'id' }
				);
				store.createIndex('timestamp', 'timestamp');
				store.createIndex('category', 'category');
			}
		};
	});
}

// Cache conversation data for offline access
self.addEventListener('message', (event) => {
	if (
		event.data &&
		event.data.type === 'CACHE_CONVERSATION'
	) {
		cacheConversation(event.data.conversation);
	} else if (
		event.data &&
		event.data.type === 'REQUEST_SYNC'
	) {
		// Request background sync when back online
		self.registration.sync.register(
			'conversations-sync'
		);
	}
});

async function cacheConversation(conversation) {
	try {
		const cache = await caches.open(
			CONVERSATIONS_CACHE
		);
		const response = new Response(
			JSON.stringify(conversation),
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		await cache.put(
			`/conversation/${conversation.id}`,
			response
		);
		console.log(
			'Service Worker: Conversation cached:',
			conversation.id
		);
	} catch (error) {
		console.error(
			'Service Worker: Failed to cache conversation:',
			error
		);
	}
}

// Push notification support (for future features)
self.addEventListener('push', (event) => {
	console.log(
		'Service Worker: Push notification received'
	);

	const options = {
		body: event.data
			? event.data.text()
			: 'New message available',
		icon: '/icon-192x192.png',
		badge: '/icon-192x192.png',
		tag: 'ai-chatbot-notification',
		requireInteraction: false,
	};

	event.waitUntil(
		self.registration.showNotification(
			'AI Chatbot',
			options
		)
	);
});

// Installation prompt handling
self.addEventListener('beforeinstallprompt', (event) => {
	console.log('Service Worker: Install prompt available');
	// Prevent the default install prompt
	event.preventDefault();

	// Send to main app for custom install UI
	self.clients.matchAll().then((clients) => {
		clients.forEach((client) => {
			client.postMessage({
				type: 'INSTALL_PROMPT_AVAILABLE',
				event: event,
			});
		});
	});
});

console.log('Service Worker: Loaded and ready');
