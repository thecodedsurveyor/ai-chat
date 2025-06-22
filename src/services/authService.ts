import { API_BASE_URL } from '../config';
import {
	compressImage,
	validateImageFile,
} from '../utils/imageOptimization';
import {
	uploadWithProgress,
	uploadWithRetry,
} from '../utils/uploadProgress';
import type { ProgressCallback } from '../utils/uploadProgress';

export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	createdAt: string;
	isVerified?: boolean;
	avatar?: string;
	preferences?: Record<string, unknown>;
}

export interface AuthResponse {
	success: boolean;
	message: string;
	error?: string;
	data?: {
		user: User;
		accessToken?: string;
		refreshToken?: string;
		requiresVerification?: boolean;
		email?: string;
	};
}

export interface RegisterData {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

export interface LoginData {
	email: string;
	password: string;
}

export interface ChangePasswordData {
	currentPassword: string;
	newPassword: string;
}

export interface UpdateProfileData {
	firstName?: string;
	lastName?: string;
	avatar?: string;
	preferences?: Record<string, unknown>;
}

export interface ProfileResponse {
	success: boolean;
	message?: string;
	data?: {
		user: User;
	};
}

class AuthService {
	private token: string | null = null;
	private refreshToken: string | null = null;

	constructor() {
		// Load tokens from localStorage on initialization
		this.token = localStorage.getItem('authToken');
		this.refreshToken =
			localStorage.getItem('refreshToken');
	}

	async register(
		data: RegisterData
	): Promise<AuthResponse> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/auth/register`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data),
				}
			);

			const result: AuthResponse =
				await response.json();

			// Only set tokens if they exist (user is immediately verified)
			// With email verification, registration won't return tokens
			if (
				result.success &&
				result.data &&
				result.data.accessToken &&
				result.data.refreshToken
			) {
				this.token = result.data.accessToken;
				this.refreshToken =
					result.data.refreshToken;
				localStorage.setItem(
					'authToken',
					this.token
				);
				localStorage.setItem(
					'refreshToken',
					this.refreshToken
				);
				localStorage.setItem(
					'user',
					JSON.stringify(result.data.user)
				);

				// Migrate guest data to authenticated user
				this.migrateGuestDataToUser();
			}

			return result;
		} catch {
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	async login(data: LoginData): Promise<AuthResponse> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/auth/login`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data),
				}
			);

			const result: AuthResponse =
				await response.json();

			if (
				result.success &&
				result.data &&
				result.data.accessToken &&
				result.data.refreshToken
			) {
				this.token = result.data.accessToken;
				this.refreshToken =
					result.data.refreshToken;
				localStorage.setItem(
					'authToken',
					this.token
				);
				localStorage.setItem(
					'refreshToken',
					this.refreshToken
				);
				localStorage.setItem(
					'user',
					JSON.stringify(result.data.user)
				);

				// Migrate guest data to authenticated user
				this.migrateGuestDataToUser();
			}

			return result;
		} catch {
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	async changePassword(
		data: ChangePasswordData
	): Promise<AuthResponse> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/auth/change-password`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${this.token}`,
					},
					body: JSON.stringify(data),
				}
			);

			const result: AuthResponse =
				await response.json();

			// If password change is successful, the backend invalidates all sessions
			// So we need to logout the user and redirect to login
			if (result.success) {
				await this.logout();
			}

			return result;
		} catch {
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	async deleteAccount(): Promise<AuthResponse> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/auth/delete-account`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${this.token}`,
					},
				}
			);

			const result: AuthResponse =
				await response.json();

			// If account deletion is successful, logout and clear all data
			if (result.success) {
				await this.logout();
			}

			return result;
		} catch {
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	async logout(): Promise<void> {
		try {
			if (this.token) {
				await fetch(`${API_BASE_URL}/auth/logout`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${this.token}`,
					},
				});
			}
		} catch (error) {
			console.error('Logout API call failed:', error);
			// Continue with local cleanup even if API call fails
		} finally {
			// Clear all authentication data
			this.token = null;
			this.refreshToken = null;

			// Get current user before clearing to clean up their data
			const currentUser = this.getUser();

			// Clear authentication tokens and user data
			localStorage.removeItem('authToken');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('user');

			// Clear user-specific chat data
			if (currentUser) {
				this.clearUserSpecificData(currentUser.id);
			}

			// Clear any other user-specific data
			this.clearAllUserData();

			// Call global chat data cleanup if available
			const globalWindow = window as unknown as {
				clearChatData?: () => void;
			};
			if (
				typeof globalWindow.clearChatData ===
				'function'
			) {
				globalWindow.clearChatData();
			}

			// Trigger storage event to notify other components
			window.dispatchEvent(new Event('storage'));
		}
	}

	/**
	 * Clear user-specific data from localStorage
	 */
	private clearUserSpecificData(userId: string): void {
		const userPrefix = `_user_${userId}`;
		const keysToRemove: string[] = [];

		// Find all keys belonging to this user
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.includes(userPrefix)) {
				keysToRemove.push(key);
			}
		}

		// Remove user-specific keys
		keysToRemove.forEach((key) =>
			localStorage.removeItem(key)
		);
	}

	/**
	 * Migrate guest data to authenticated user
	 */
	private migrateGuestDataToUser(): void {
		try {
			// Import chat store dynamically to avoid circular dependency
			import('../stores/chatStore')
				.then(({ useChatStore }) => {
					const chatStore =
						useChatStore.getState();
					chatStore.migrateGuestDataToUser();
				})
				.catch((error) => {
					console.error(
						'Failed to migrate guest data:',
						error
					);
				});
		} catch (error) {
			console.error(
				'Error migrating guest data:',
				error
			);
		}
	}

	/**
	 * Clear all user data (emergency cleanup)
	 */
	private clearAllUserData(): void {
		const keysToRemove: string[] = [];

		// Find keys that might contain user data
		const userDataPatterns = [
			'chats_user_',
			'chat-',
			'conversations_user_',
			'messages_user_',
			'user_',
			'offline-',
		];

		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key) {
				const shouldRemove = userDataPatterns.some(
					(pattern) => key.includes(pattern)
				);
				if (shouldRemove) {
					keysToRemove.push(key);
				}
			}
		}

		// Remove identified keys
		keysToRemove.forEach((key) =>
			localStorage.removeItem(key)
		);

		// Clear IndexedDB data
		this.clearIndexedDBData();
	}

	/**
	 * Clear IndexedDB data
	 */
	private async clearIndexedDBData(): Promise<void> {
		try {
			// Clear chatbot-related IndexedDB databases
			const dbNames = [
				'chatbot-db',
				'chatbot-offline',
			];

			for (const dbName of dbNames) {
				try {
					const deleteRequest =
						indexedDB.deleteDatabase(dbName);
					await new Promise((resolve, reject) => {
						deleteRequest.onsuccess = () =>
							resolve(void 0);
						deleteRequest.onerror = () =>
							reject(deleteRequest.error);
						deleteRequest.onblocked = () => {
							console.warn(
								`Database ${dbName} deletion blocked`
							);
							resolve(void 0); // Continue anyway
						};
					});
				} catch (error) {
					console.warn(
						`Failed to clear IndexedDB ${dbName}:`,
						error
					);
				}
			}
		} catch (error) {
			console.warn(
				'Failed to clear IndexedDB data:',
				error
			);
		}
	}

	isAuthenticated(): boolean {
		// Check instance token first, then fallback to localStorage
		if (this.token) {
			return true;
		}

		// Fallback: check localStorage directly in case instance isn't updated
		const storedToken =
			localStorage.getItem('authToken');
		if (storedToken) {
			this.token = storedToken; // Update instance
			return true;
		}

		return false;
	}

	getToken(): string | null {
		// Check instance token first, then fallback to localStorage
		if (this.token) {
			return this.token;
		}

		// Fallback: check localStorage directly
		const storedToken =
			localStorage.getItem('authToken');
		if (storedToken) {
			this.token = storedToken; // Update instance
			return storedToken;
		}

		return null;
	}

	getUser(): User | null {
		const userStr = localStorage.getItem('user');
		if (userStr) {
			try {
				return JSON.parse(userStr);
			} catch {
				return null;
			}
		}
		return null;
	}

	/**
	 * Refresh access token using refresh token
	 */
	async refreshAccessToken(): Promise<boolean> {
		try {
			if (!this.refreshToken) {
				return false;
			}

			const response = await fetch(
				`${API_BASE_URL}/auth/refresh-token`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						refreshToken: this.refreshToken,
					}),
				}
			);

			const result = await response.json();

			if (result.success && result.data) {
				this.token = result.data.accessToken;
				this.refreshToken =
					result.data.refreshToken;
				if (this.token) {
					localStorage.setItem(
						'authToken',
						this.token
					);
				}
				if (this.refreshToken) {
					localStorage.setItem(
						'refreshToken',
						this.refreshToken
					);
				}
				return true;
			}

			return false;
		} catch {
			return false;
		}
	}

	/**
	 * Get user profile from database (fresh data)
	 */
	async getProfile(): Promise<ProfileResponse> {
		try {
			let response = await fetch(
				`${API_BASE_URL}/auth/profile`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${this.token}`,
					},
				}
			);

			// If 401 (user not found/deleted), logout immediately
			if (response.status === 401) {
				const errorData = await response.json();
				if (errorData.error === 'User not found') {
					await this.logout();
					window.location.reload(); // Force reload to clear any cached state
					return {
						success: false,
						message:
							'Your account has been deleted. Please register again.',
					};
				}
			}

			// If 403, try to refresh token and retry
			if (response.status === 403) {
				const refreshed =
					await this.refreshAccessToken();
				if (refreshed) {
					response = await fetch(
						`${API_BASE_URL}/auth/profile`,
						{
							method: 'GET',
							headers: {
								'Content-Type':
									'application/json',
								Authorization: `Bearer ${this.token}`,
							},
						}
					);
				}
			}

			const result: ProfileResponse =
				await response.json();

			// Update localStorage with fresh data
			if (result.success && result.data) {
				localStorage.setItem(
					'user',
					JSON.stringify(result.data.user)
				);
			}

			return result;
		} catch {
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	/**
	 * Update user profile in database
	 */
	async updateProfile(
		data: UpdateProfileData
	): Promise<ProfileResponse> {
		try {
			let response = await fetch(
				`${API_BASE_URL}/auth/profile`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${this.token}`,
					},
					body: JSON.stringify(data),
				}
			);

			// If 403, try to refresh token and retry
			if (response.status === 403) {
				const refreshed =
					await this.refreshAccessToken();
				if (refreshed) {
					response = await fetch(
						`${API_BASE_URL}/auth/profile`,
						{
							method: 'PUT',
							headers: {
								'Content-Type':
									'application/json',
								Authorization: `Bearer ${this.token}`,
							},
							body: JSON.stringify(data),
						}
					);
				}
			}

			const result: ProfileResponse =
				await response.json();

			// Update localStorage with new data
			if (result.success && result.data) {
				localStorage.setItem(
					'user',
					JSON.stringify(result.data.user)
				);
			}

			return result;
		} catch {
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	/**
	 * Upload profile picture with optimization
	 */
	async uploadProfilePicture(
		file: File,
		onProgress?: ProgressCallback
	): Promise<ProfileResponse> {
		try {
			// Validate file first
			const validation = validateImageFile(file);
			if (!validation.valid) {
				return {
					success: false,
					message:
						validation.error || 'Invalid file',
				};
			}

			// Compress image for faster upload
			const optimizedFile = await compressImage(file);

			const formData = new FormData();
			formData.append(
				'profilePicture',
				optimizedFile
			);

			// Upload with progress tracking and retry logic
			let response = await uploadWithRetry(
				async () => {
					return uploadWithProgress(
						`${API_BASE_URL}/auth/upload-profile-picture`,
						formData,
						{
							Authorization: `Bearer ${this.token}`,
						},
						onProgress
					);
				}
			);

			// If 403, try to refresh token and retry
			if (response.status === 403) {
				const refreshed =
					await this.refreshAccessToken();
				if (refreshed) {
					response = await uploadWithRetry(
						async () => {
							return uploadWithProgress(
								`${API_BASE_URL}/auth/upload-profile-picture`,
								formData,
								{
									Authorization: `Bearer ${this.token}`,
								},
								onProgress
							);
						}
					);
				}
			}

			const result: ProfileResponse =
				await response.json();

			// Update localStorage with new data
			if (result.success && result.data) {
				localStorage.setItem(
					'user',
					JSON.stringify(result.data.user)
				);
			}

			return result;
		} catch {
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	/**
	 * Get user data with fresh fetch from database
	 */
	async getUserFresh(): Promise<User | null> {
		if (!this.token) return null;

		const result = await this.getProfile();
		return result.success
			? result.data?.user || null
			: null;
	}

	/**
	 * Reset password using token
	 */
	async resetPasswordWithToken(
		token: string,
		email: string,
		newPassword: string
	): Promise<AuthResponse> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/auth/reset-password`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						token,
						email,
						newPassword,
					}),
				}
			);
			return await response.json();
		} catch {
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	/**
	 * Request password reset (send reset email)
	 */
	async requestPasswordReset(
		email: string
	): Promise<AuthResponse> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/auth/request-password-reset`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ email }),
				}
			);
			return await response.json();
		} catch {
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	async verifyEmail(
		token: string,
		email: string
	): Promise<AuthResponse> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/auth/verify-email`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ token, email }),
				}
			);

			const result: AuthResponse =
				await response.json();

			// If verification is successful, store tokens and user data
			if (
				result.success &&
				result.data &&
				result.data.accessToken &&
				result.data.refreshToken
			) {
				this.token = result.data.accessToken;
				this.refreshToken =
					result.data.refreshToken;
				localStorage.setItem(
					'authToken',
					this.token
				);
				localStorage.setItem(
					'refreshToken',
					this.refreshToken
				);
				localStorage.setItem(
					'user',
					JSON.stringify(result.data.user)
				);

				// Migrate guest data to authenticated user
				this.migrateGuestDataToUser();
			}

			return result;
		} catch {
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	async resendVerificationEmail(
		email: string
	): Promise<AuthResponse> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/auth/resend-verification`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ email }),
				}
			);

			return await response.json();
		} catch {
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	/**
	 * Global method to check if a response indicates the user was deleted
	 * and handle it appropriately. Can be used by other services.
	 */
	async handleAuthResponse(
		response: Response
	): Promise<Response> {
		if (response.status === 401) {
			try {
				const clone = response.clone();
				const errorData = await clone.json();
				if (
					errorData.error === 'User not found' ||
					errorData.message ===
						'User account no longer exists'
				) {
					await this.logout();
					window.location.reload();
				}
			} catch {
				// If we can't parse the response, just proceed
			}
		}
		return response;
	}

	/**
	 * Enhanced fetch wrapper that automatically handles deleted user scenarios
	 */
	async authenticatedFetch(
		url: string,
		options: RequestInit = {}
	): Promise<Response> {
		const headers = {
			'Content-Type': 'application/json',
			...options.headers,
			Authorization: `Bearer ${this.token}`,
		};

		let response = await fetch(url, {
			...options,
			headers,
		});

		// Handle user deleted scenario
		response = await this.handleAuthResponse(response);

		// Handle token refresh for 403 responses
		if (response.status === 403) {
			const refreshed =
				await this.refreshAccessToken();
			if (refreshed) {
				response = await fetch(url, {
					...options,
					headers: {
						...headers,
						Authorization: `Bearer ${this.token}`,
					},
				});
				response = await this.handleAuthResponse(
					response
				);
			}
		}

		return response;
	}
}

export const authService = new AuthService();
