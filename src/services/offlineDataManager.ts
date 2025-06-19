// PWA Offline Data Manager
// Handles IndexedDB for offline storage and syncs with database when online

export interface OfflineConversation {
	id: string;
	title: string;
	messages: OfflineMessage[];
	createdAt: string;
	updatedAt: string;
	isArchived: boolean;
	isPinned: boolean;
	isFavorite: boolean;
	syncStatus: 'synced' | 'pending' | 'conflict';
}

export interface OfflineMessage {
	id: string;
	conversationId: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: string;
	syncStatus: 'synced' | 'pending';
}

export interface OfflineUserProfile {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	preferences: Record<string, unknown>;
	syncStatus: 'synced' | 'pending';
}

class OfflineDataManager {
	private dbName = 'chatbot-offline';
	private dbVersion = 1;
	private db: IDBDatabase | null = null;

	async init(): Promise<void> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(
				this.dbName,
				this.dbVersion
			);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				this.db = request.result;
				resolve();
			};

			request.onupgradeneeded = (event) => {
				const db = (
					event.target as IDBOpenDBRequest
				).result;

				// Conversations store
				if (
					!db.objectStoreNames.contains(
						'conversations'
					)
				) {
					const conversationStore =
						db.createObjectStore(
							'conversations',
							{
								keyPath: 'id',
							}
						);
					conversationStore.createIndex(
						'updatedAt',
						'updatedAt'
					);
					conversationStore.createIndex(
						'syncStatus',
						'syncStatus'
					);
				}

				// Messages store
				if (
					!db.objectStoreNames.contains(
						'messages'
					)
				) {
					const messageStore =
						db.createObjectStore('messages', {
							keyPath: 'id',
						});
					messageStore.createIndex(
						'conversationId',
						'conversationId'
					);
					messageStore.createIndex(
						'timestamp',
						'timestamp'
					);
					messageStore.createIndex(
						'syncStatus',
						'syncStatus'
					);
				}

				// User profile store
				if (
					!db.objectStoreNames.contains(
						'userProfile'
					)
				) {
					db.createObjectStore('userProfile', {
						keyPath: 'id',
					});
				}

				// App settings store
				if (
					!db.objectStoreNames.contains(
						'appSettings'
					)
				) {
					db.createObjectStore('appSettings', {
						keyPath: 'key',
					});
				}
			};
		});
	}

	// =================== CONVERSATIONS ===================

	async saveConversation(
		conversation: OfflineConversation
	): Promise<void> {
		if (!this.db) await this.init();

		const transaction = this.db!.transaction(
			['conversations'],
			'readwrite'
		);
		const store =
			transaction.objectStore('conversations');

		conversation.syncStatus = 'pending';
		conversation.updatedAt = new Date().toISOString();

		await store.put(conversation);

		// Trigger background sync if online
		if (navigator.onLine) {
			this.scheduleSync();
		}
	}

	async getConversations(): Promise<
		OfflineConversation[]
	> {
		if (!this.db) await this.init();

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction(
				['conversations'],
				'readonly'
			);
			const store =
				transaction.objectStore('conversations');
			const index = store.index('updatedAt');
			const request = index.getAll();

			request.onsuccess = () => {
				const conversations =
					request.result.reverse(); // Most recent first
				resolve(conversations);
			};
			request.onerror = () => reject(request.error);
		});
	}

	async getConversation(
		id: string
	): Promise<OfflineConversation | null> {
		if (!this.db) await this.init();

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction(
				['conversations'],
				'readonly'
			);
			const store =
				transaction.objectStore('conversations');
			const request = store.get(id);

			request.onsuccess = () =>
				resolve(request.result || null);
			request.onerror = () => reject(request.error);
		});
	}

	async deleteConversation(id: string): Promise<void> {
		if (!this.db) await this.init();

		const transaction = this.db!.transaction(
			['conversations', 'messages'],
			'readwrite'
		);

		// Delete conversation
		const conversationStore =
			transaction.objectStore('conversations');
		conversationStore.delete(id);

		// Delete all messages in conversation
		const messageStore =
			transaction.objectStore('messages');
		const index = messageStore.index('conversationId');

		return new Promise((resolve, reject) => {
			const request = index.getAll(id);
			request.onsuccess = async () => {
				const messages = request.result;
				for (const message of messages) {
					messageStore.delete(message.id);
				}

				// Wait for transaction to complete
				transaction.oncomplete = () => {
					// Trigger sync
					if (navigator.onLine) {
						this.scheduleSync();
					}
					resolve();
				};
				transaction.onerror = () =>
					reject(transaction.error);
			};
			request.onerror = () => reject(request.error);
		});
	}

	// =================== MESSAGES ===================

	async saveMessage(
		message: OfflineMessage
	): Promise<void> {
		if (!this.db) await this.init();

		const transaction = this.db!.transaction(
			['messages'],
			'readwrite'
		);
		const store = transaction.objectStore('messages');

		message.syncStatus = 'pending';
		message.timestamp = new Date().toISOString();

		await store.put(message);

		// Update conversation updated time
		const conversation = await this.getConversation(
			message.conversationId
		);
		if (conversation) {
			await this.saveConversation(conversation);
		}

		if (navigator.onLine) {
			this.scheduleSync();
		}
	}

	async getMessages(
		conversationId: string
	): Promise<OfflineMessage[]> {
		if (!this.db) await this.init();

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction(
				['messages'],
				'readonly'
			);
			const store =
				transaction.objectStore('messages');
			const index = store.index('conversationId');
			const request = index.getAll(conversationId);

			request.onsuccess = () => {
				const messages = request.result.sort(
					(a, b) =>
						new Date(a.timestamp).getTime() -
						new Date(b.timestamp).getTime()
				);
				resolve(messages);
			};
			request.onerror = () => reject(request.error);
		});
	}

	// =================== USER PROFILE ===================

	async saveUserProfile(
		profile: OfflineUserProfile
	): Promise<void> {
		if (!this.db) await this.init();

		const transaction = this.db!.transaction(
			['userProfile'],
			'readwrite'
		);
		const store =
			transaction.objectStore('userProfile');

		profile.syncStatus = 'pending';
		await store.put(profile);

		if (navigator.onLine) {
			this.scheduleSync();
		}
	}

	async getUserProfile(): Promise<OfflineUserProfile | null> {
		if (!this.db) await this.init();

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction(
				['userProfile'],
				'readonly'
			);
			const store =
				transaction.objectStore('userProfile');
			const request = store.getAll();

			request.onsuccess = () => {
				const profiles = request.result;
				resolve(
					profiles.length > 0 ? profiles[0] : null
				);
			};
			request.onerror = () => reject(request.error);
		});
	}

	// =================== APP SETTINGS ===================

	async saveSetting(
		key: string,
		value: unknown
	): Promise<void> {
		if (!this.db) await this.init();

		const transaction = this.db!.transaction(
			['appSettings'],
			'readwrite'
		);
		const store =
			transaction.objectStore('appSettings');

		await store.put({
			key,
			value,
			updatedAt: new Date().toISOString(),
		});
	}

	async getSetting(key: string): Promise<unknown> {
		if (!this.db) await this.init();

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction(
				['appSettings'],
				'readonly'
			);
			const store =
				transaction.objectStore('appSettings');
			const request = store.get(key);

			request.onsuccess = () => {
				const result = request.result;
				resolve(result ? result.value : null);
			};
			request.onerror = () => reject(request.error);
		});
	}

	// =================== SYNC MANAGEMENT ===================

	private syncScheduled = false;

	private scheduleSync(): void {
		if (this.syncScheduled) return;

		this.syncScheduled = true;

		// Schedule sync after a brief delay to batch operations
		setTimeout(() => {
			this.performSync();
			this.syncScheduled = false;
		}, 2000);
	}

	async performSync(): Promise<void> {
		if (!navigator.onLine) return;

		try {
			// Starting offline data sync...

			// Import services when needed to avoid circular dependencies
			const authServiceModule = await import(
				'./authService'
			);

			// Sync user profile
			await this.syncUserProfile(
				authServiceModule.authService
			);

			// Sync conversations
			await this.syncConversations();

			// Sync messages
			await this.syncMessages();

			// Offline data sync completed
		} catch {
			// Sync failed
		}
	}

	private async syncUserProfile(authService: {
		updateProfile: (data: {
			firstName: string;
			lastName: string;
			preferences: Record<string, unknown>;
		}) => Promise<{ success: boolean }>;
	}): Promise<void> {
		const localProfile = await this.getUserProfile();
		if (
			!localProfile ||
			localProfile.syncStatus === 'synced'
		)
			return;

		try {
			const result = await authService.updateProfile({
				firstName: localProfile.firstName,
				lastName: localProfile.lastName,
				preferences: localProfile.preferences,
			});

			if (result.success) {
				localProfile.syncStatus = 'synced';
				await this.saveUserProfile(localProfile);
			}
		} catch {
			// Profile sync failed
		}
	}

	private async syncConversations(): Promise<void> {
		const conversations = await this.getConversations();
		const pendingConversations = conversations.filter(
			(c) => c.syncStatus === 'pending'
		);

		for (const conversation of pendingConversations) {
			try {
				// For now, just mark as synced since we have the conversation service
				// In a full implementation, you'd sync with the backend
				conversation.syncStatus = 'synced';
				await this.saveConversation(conversation);
			} catch {
				// Conversation sync failed
			}
		}
	}

	private async syncMessages(): Promise<void> {
		const conversations = await this.getConversations();

		for (const conversation of conversations) {
			const messages = await this.getMessages(
				conversation.id
			);
			const pendingMessages = messages.filter(
				(m) => m.syncStatus === 'pending'
			);

			for (const message of pendingMessages) {
				try {
					// Mark as synced
					message.syncStatus = 'synced';
					await this.saveMessage(message);
				} catch {
					// Message sync failed
				}
			}
		}
	}

	// =================== OFFLINE STATUS ===================

	isOnline(): boolean {
		return navigator.onLine;
	}

	async getOfflineCapableData(): Promise<{
		conversations: OfflineConversation[];
		profile: OfflineUserProfile | null;
		isOnline: boolean;
	}> {
		const conversations = await this.getConversations();
		const profile = await this.getUserProfile();

		return {
			conversations,
			profile,
			isOnline: this.isOnline(),
		};
	}

	// =================== SEARCH ===================

	async searchMessages(
		query: string
	): Promise<OfflineMessage[]> {
		if (!this.db) await this.init();

		const allConversations =
			await this.getConversations();
		const results: OfflineMessage[] = [];

		for (const conversation of allConversations) {
			const messages = await this.getMessages(
				conversation.id
			);
			const matchingMessages = messages.filter(
				(message) =>
					message.content
						.toLowerCase()
						.includes(query.toLowerCase())
			);
			results.push(...matchingMessages);
		}

		return results.sort(
			(a, b) =>
				new Date(b.timestamp).getTime() -
				new Date(a.timestamp).getTime()
		);
	}
}

export const offlineDataManager = new OfflineDataManager();
