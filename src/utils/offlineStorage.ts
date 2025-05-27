import type { Chat } from '../types';

export interface OfflineData {
	chats: Chat[];
	lastSync: string;
	version: string;
}

export interface SyncData {
	timestamp: string;
	chatCount?: number;
	sourceVersion?: string;
	[key: string]: unknown;
}

export class OfflineStorageManager {
	private static readonly DB_NAME = 'ai-chatbot-db';
	private static readonly DB_VERSION = 1;
	private static readonly CHATS_STORE = 'conversations';
	private static readonly SYNC_STORE = 'sync_data';

	// Initialize IndexedDB
	static async initDB(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(
				this.DB_NAME,
				this.DB_VERSION
			);

			request.onerror = () => reject(request.error);
			request.onsuccess = () =>
				resolve(request.result);

			request.onupgradeneeded = (event) => {
				const db = (
					event.target as IDBOpenDBRequest
				).result;

				// Create conversations store
				if (
					!db.objectStoreNames.contains(
						this.CHATS_STORE
					)
				) {
					const chatStore = db.createObjectStore(
						this.CHATS_STORE,
						{
							keyPath: 'id',
						}
					);
					chatStore.createIndex(
						'createdAt',
						'createdAt'
					);
					chatStore.createIndex(
						'category',
						'category'
					);
					chatStore.createIndex(
						'lastActivity',
						'lastActivity'
					);
				}

				// Create sync data store
				if (
					!db.objectStoreNames.contains(
						this.SYNC_STORE
					)
				) {
					db.createObjectStore(this.SYNC_STORE, {
						keyPath: 'key',
					});
				}
			};
		});
	}

	// Save chat for offline access
	static async saveChat(chat: Chat): Promise<void> {
		const db = await this.initDB();
		const transaction = db.transaction(
			[this.CHATS_STORE],
			'readwrite'
		);
		const store = transaction.objectStore(
			this.CHATS_STORE
		);

		// Mark as offline ready
		const offlineChat = {
			...chat,
			isOfflineReady: true,
			lastOfflineSync: new Date().toISOString(),
		};

		await new Promise<void>((resolve, reject) => {
			const request = store.put(offlineChat);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});

		// Also cache in service worker
		if (
			'serviceWorker' in navigator &&
			navigator.serviceWorker.controller
		) {
			navigator.serviceWorker.controller.postMessage({
				type: 'CACHE_CONVERSATION',
				conversation: offlineChat,
			});
		}

		// Chat saved for offline access
	}

	// Get all offline chats
	static async getOfflineChats(): Promise<Chat[]> {
		try {
			const db = await this.initDB();
			const transaction = db.transaction(
				[this.CHATS_STORE],
				'readonly'
			);
			const store = transaction.objectStore(
				this.CHATS_STORE
			);

			return new Promise((resolve, reject) => {
				const request = store.getAll();
				request.onsuccess = () =>
					resolve(request.result || []);
				request.onerror = () =>
					reject(request.error);
			});
		} catch {
			// Failed to get offline chats - return empty array
			return [];
		}
	}

	// Get specific chat by ID
	static async getOfflineChat(
		chatId: string
	): Promise<Chat | null> {
		try {
			const db = await this.initDB();
			const transaction = db.transaction(
				[this.CHATS_STORE],
				'readonly'
			);
			const store = transaction.objectStore(
				this.CHATS_STORE
			);

			return new Promise((resolve, reject) => {
				const request = store.get(chatId);
				request.onsuccess = () =>
					resolve(request.result || null);
				request.onerror = () =>
					reject(request.error);
			});
		} catch {
			// Failed to get offline chat - return null
			return null;
		}
	}

	// Delete offline chat
	static async deleteOfflineChat(
		chatId: string
	): Promise<void> {
		const db = await this.initDB();
		const transaction = db.transaction(
			[this.CHATS_STORE],
			'readwrite'
		);
		const store = transaction.objectStore(
			this.CHATS_STORE
		);

		await new Promise<void>((resolve, reject) => {
			const request = store.delete(chatId);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});

		// Offline chat deleted
	}

	// Save sync metadata
	static async saveSyncData(
		key: string,
		data: SyncData
	): Promise<void> {
		const db = await this.initDB();
		const transaction = db.transaction(
			[this.SYNC_STORE],
			'readwrite'
		);
		const store = transaction.objectStore(
			this.SYNC_STORE
		);

		await new Promise<void>((resolve, reject) => {
			const request = store.put({
				key,
				data,
				timestamp: Date.now(),
			});
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	// Get sync metadata
	static async getSyncData(
		key: string
	): Promise<SyncData | null> {
		try {
			const db = await this.initDB();
			const transaction = db.transaction(
				[this.SYNC_STORE],
				'readonly'
			);
			const store = transaction.objectStore(
				this.SYNC_STORE
			);

			return new Promise((resolve, reject) => {
				const request = store.get(key);
				request.onsuccess = () => {
					const result = request.result;
					resolve(result ? result.data : null);
				};
				request.onerror = () =>
					reject(request.error);
			});
		} catch {
			// Failed to get sync data - return null
			return null;
		}
	}

	// Check if device is online
	static isOnline(): boolean {
		return navigator.onLine;
	}

	// Get storage usage info
	static async getStorageInfo(): Promise<{
		usage: number;
		quota: number;
		percentage: number;
	}> {
		try {
			if (
				'storage' in navigator &&
				'estimate' in navigator.storage
			) {
				const estimate =
					await navigator.storage.estimate();
				const usage = estimate.usage || 0;
				const quota = estimate.quota || 0;
				const percentage =
					quota > 0 ? (usage / quota) * 100 : 0;

				return { usage, quota, percentage };
			}
		} catch {
			// Failed to get storage info - handle silently
		}

		return { usage: 0, quota: 0, percentage: 0 };
	}

	// Clear all offline data
	static async clearOfflineData(): Promise<void> {
		const db = await this.initDB();

		// Clear chats
		const chatTransaction = db.transaction(
			[this.CHATS_STORE],
			'readwrite'
		);
		const chatStore = chatTransaction.objectStore(
			this.CHATS_STORE
		);
		await new Promise<void>((resolve, reject) => {
			const request = chatStore.clear();
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});

		// Clear sync data
		const syncTransaction = db.transaction(
			[this.SYNC_STORE],
			'readwrite'
		);
		const syncStore = syncTransaction.objectStore(
			this.SYNC_STORE
		);
		await new Promise<void>((resolve, reject) => {
			const request = syncStore.clear();
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});

		// All offline data cleared
	}

	// Export offline data for backup
	static async exportOfflineData(): Promise<OfflineData> {
		const chats = await this.getOfflineChats();
		return {
			chats,
			lastSync: new Date().toISOString(),
			version: '1.0.0',
		};
	}

	// Import offline data from backup
	static async importOfflineData(
		data: OfflineData
	): Promise<void> {
		// Clear existing data first
		await this.clearOfflineData();

		// Import chats
		for (const chat of data.chats) {
			await this.saveChat(chat);
		}

		// Save import metadata
		await this.saveSyncData('lastImport', {
			timestamp: new Date().toISOString(),
			chatCount: data.chats.length,
			sourceVersion: data.version,
		});

		// Offline data imported successfully
	}
}

// Network status utility
export class NetworkManager {
	private static listeners: Set<
		(isOnline: boolean) => void
	> = new Set();

	static initialize() {
		// Listen for network status changes
		window.addEventListener('online', () => {
			// Network: Back online
			this.notifyListeners(true);
			this.requestSync();
		});

		window.addEventListener('offline', () => {
			// Network: Gone offline
			this.notifyListeners(false);
		});
	}

	static addListener(
		callback: (isOnline: boolean) => void
	) {
		this.listeners.add(callback);
		// Immediately notify of current status
		callback(navigator.onLine);
	}

	static removeListener(
		callback: (isOnline: boolean) => void
	) {
		this.listeners.delete(callback);
	}

	private static notifyListeners(isOnline: boolean) {
		this.listeners.forEach((callback) =>
			callback(isOnline)
		);
	}

	private static requestSync() {
		// Request background sync when back online
		if (
			'serviceWorker' in navigator &&
			navigator.serviceWorker.controller
		) {
			navigator.serviceWorker.controller.postMessage({
				type: 'REQUEST_SYNC',
			});
		}
	}

	static isOnline(): boolean {
		return navigator.onLine;
	}
}
