// Cache clearing utility for development
(function () {
	'use strict';

	async function clearAllCaches() {
		try {
			// Clear all caches
			const cacheNames = await caches.keys();
			await Promise.all(
				cacheNames.map((cacheName) => {
					console.log(
						'Deleting cache:',
						cacheName
					);
					return caches.delete(cacheName);
				})
			);

			// Unregister all service workers
			if ('serviceWorker' in navigator) {
				const registrations =
					await navigator.serviceWorker.getRegistrations();
				await Promise.all(
					registrations.map((registration) => {
						console.log(
							'Unregistering service worker'
						);
						return registration.unregister();
					})
				);
			}

			// Clear localStorage items that might cause issues
			const problematicKeys = [
				'ai-chatbot-cache',
				'sw-cache',
				'workbox-precache',
				'workbox-runtime',
			];

			problematicKeys.forEach((key) => {
				localStorage.removeItem(key);
				sessionStorage.removeItem(key);
			});

			console.log(
				'All caches and service workers cleared successfully'
			);

			// Force reload
			window.location.reload(true);
		} catch (error) {
			console.error('Error clearing caches:', error);
		}
	}

	// Auto-run if this script is loaded
	if (document.readyState === 'loading') {
		document.addEventListener(
			'DOMContentLoaded',
			clearAllCaches
		);
	} else {
		clearAllCaches();
	}
})();
