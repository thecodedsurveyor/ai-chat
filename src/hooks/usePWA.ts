import { useState, useEffect, useCallback } from 'react';
import { offlineDataManager } from '../services/offlineDataManager';

// Define the event interface for PWA install prompt
interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	readonly userChoice: Promise<{
		outcome: 'accepted' | 'dismissed';
		platform: string;
	}>;
	prompt(): Promise<void>;
}

export interface PWAState {
	isOnline: boolean;
	isInstallable: boolean;
	isInstalled: boolean;
	isSync: boolean;
	hasUpdate: boolean;
}

export interface PWAActions {
	install: () => Promise<void>;
	sync: () => Promise<void>;
	checkForUpdates: () => Promise<void>;
	showOfflineNotification: () => void;
}

export function usePWA(): PWAState & PWAActions {
	const [state, setState] = useState<PWAState>({
		isOnline: navigator.onLine,
		isInstallable: false,
		isInstalled: false,
		isSync: false,
		hasUpdate: false,
	});

	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);

	// Define the sync function first
	const sync = useCallback(async (): Promise<void> => {
		if (!navigator.onLine) {
			return;
		}

		setState((prev) => ({ ...prev, isSync: true }));

		try {
			await offlineDataManager.performSync();
		} catch {
			// Failed to sync offline data
		} finally {
			setState((prev) => ({
				...prev,
				isSync: false,
			}));
		}
	}, []);

	// Define showOfflineNotification function
	const showOfflineNotification = useCallback(() => {
		// App is now offline - some features may be limited
		// You could show a toast notification here
	}, []);

	// Event handlers with proper dependencies
	const handleOnline = useCallback(() => {
		setState((prev) => ({ ...prev, isOnline: true }));
		// Trigger background sync when coming back online
		sync();
	}, [sync]);

	const handleOffline = useCallback(() => {
		setState((prev) => ({ ...prev, isOnline: false }));
		showOfflineNotification();
	}, [showOfflineNotification]);

	const handleInstallPrompt = useCallback(
		(event: Event) => {
			event.preventDefault();
			setDeferredPrompt(
				event as BeforeInstallPromptEvent
			);
			setState((prev) => ({
				...prev,
				isInstallable: true,
			}));
		},
		[]
	);

	const handleServiceWorkerMessage = useCallback(
		(event: MessageEvent) => {
			const { data } = event;

			switch (data.type) {
				case 'SYNC_OFFLINE_DATA':
					// Trigger offline data sync
					syncOfflineData();
					break;
				case 'UPDATE_AVAILABLE':
					setState((prev) => ({
						...prev,
						hasUpdate: true,
					}));
					break;
				default:
					break;
			}
		},
		[]
	);

	// Define setup and cleanup functions
	const setupEventListeners = useCallback(() => {
		// Online/offline events
		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		// Install prompt event
		window.addEventListener(
			'beforeinstallprompt',
			handleInstallPrompt
		);

		// Service worker messages
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.addEventListener(
				'message',
				handleServiceWorkerMessage
			);
		}
	}, [
		handleOnline,
		handleOffline,
		handleInstallPrompt,
		handleServiceWorkerMessage,
	]);

	const cleanupEventListeners = useCallback(() => {
		window.removeEventListener('online', handleOnline);
		window.removeEventListener(
			'offline',
			handleOffline
		);
		window.removeEventListener(
			'beforeinstallprompt',
			handleInstallPrompt
		);

		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.removeEventListener(
				'message',
				handleServiceWorkerMessage
			);
		}
	}, [
		handleOnline,
		handleOffline,
		handleInstallPrompt,
		handleServiceWorkerMessage,
	]);

	// Initialize PWA features
	useEffect(() => {
		initializePWA();
		setupEventListeners();
		initializeOfflineData();

		return () => {
			cleanupEventListeners();
		};
	}, [setupEventListeners, cleanupEventListeners]);

	const initializePWA = async () => {
		// Check if app is already installed
		const isInstalled =
			window.matchMedia('(display-mode: standalone)')
				.matches ||
			(window.navigator as { standalone?: boolean })
				.standalone ||
			document.referrer.includes('android-app://');

		// Register service worker
		if ('serviceWorker' in navigator) {
			try {
				const registration =
					await navigator.serviceWorker.register(
						'/sw.js'
					);

				// Check for updates
				registration.addEventListener(
					'updatefound',
					() => {
						const newWorker =
							registration.installing;
						if (newWorker) {
							newWorker.addEventListener(
								'statechange',
								() => {
									if (
										newWorker.state ===
											'installed' &&
										navigator
											.serviceWorker
											.controller
									) {
										setState(
											(prev) => ({
												...prev,
												hasUpdate:
													true,
											})
										);
									}
								}
							);
						}
					}
				);
			} catch {
				// Service Worker registration failed
			}
		}

		setState((prev) => ({ ...prev, isInstalled }));
	};

	const initializeOfflineData = async () => {
		try {
			await offlineDataManager.init();
		} catch {
			// Failed to initialize offline data manager
		}
	};

	// PWA Actions

	const install = useCallback(async (): Promise<void> => {
		if (!deferredPrompt) {
			throw new Error('Install prompt not available');
		}

		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;

		if (outcome === 'accepted') {
			setState((prev) => ({
				...prev,
				isInstalled: true,
				isInstallable: false,
			}));
		}

		setDeferredPrompt(null);
	}, [deferredPrompt]);

	const syncOfflineData = async () => {
		try {
			await offlineDataManager.performSync();
		} catch {
			// Background sync failed
		}
	};

	const checkForUpdates =
		useCallback(async (): Promise<void> => {
			if ('serviceWorker' in navigator) {
				try {
					const registration =
						await navigator.serviceWorker.getRegistration();
					if (registration) {
						await registration.update();
					}
				} catch {
					// Failed to check for updates
				}
			}
		}, []);

	return {
		...state,
		install,
		sync,
		checkForUpdates,
		showOfflineNotification,
	};
}
