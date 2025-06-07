import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';
import App from './App.tsx';
import { NetworkManager } from './utils/offlineStorage';

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			refetchOnWindowFocus: false,
			retry: 3,
		},
		mutations: {
			retry: 1,
		},
	},
});

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
	window.addEventListener('load', async () => {
		try {
			// Clear all existing caches before registering new service worker
			const cacheNames = await caches.keys();
			await Promise.all(
				cacheNames.map((cacheName) => {
					return caches.delete(cacheName);
				})
			);

			// Unregister existing service workers
			const registrations =
				await navigator.serviceWorker.getRegistrations();
			await Promise.all(
				registrations.map((registration) => {
					return registration.unregister();
				})
			);

			// Clear any stored data that might cause issues
			if ('localStorage' in window) {
				// Don't clear all localStorage, just problematic keys
				const keysToRemove = [
					'chatbot-cache',
					'sw-cache',
				];
				keysToRemove.forEach((key) => {
					localStorage.removeItem(key);
				});
			}

			// Register fresh service worker
			const registration =
				await navigator.serviceWorker.register(
					'/sw.js',
					{
						scope: '/',
					}
				);

			// Force immediate activation
			if (registration.waiting) {
				registration.waiting.postMessage({
					type: 'SKIP_WAITING',
				});
			}

			// Handle updates
			navigator.serviceWorker.addEventListener(
				'controllerchange',
				() => {
					if (
						registration.active &&
						registration.active.state ===
							'activated'
					) {
						// New version available
						// Force reload to get the new version
						window.location.reload();
					}
				}
			);
		} catch {
			// Service Worker registration failed - continue without it
		}
	});
}

// Initialize network status monitoring
NetworkManager.initialize();

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</StrictMode>
);
