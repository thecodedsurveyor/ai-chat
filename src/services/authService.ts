const API_BASE_URL = 'http://localhost:3001/api';

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
	data?: {
		user: User;
		token: string;
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

	constructor() {
		// Load token from localStorage on initialization
		this.token = localStorage.getItem('authToken');
	}

	async register(
		data: RegisterData
	): Promise<AuthResponse> {
		try {
			console.log(
				'🚀 Registration attempt with data:',
				data
			);

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

			console.log(
				'📡 Response status:',
				response.status
			);
			console.log(
				'📡 Response headers:',
				Object.fromEntries(
					response.headers.entries()
				)
			);

			const result: AuthResponse =
				await response.json();

			console.log('📦 Response data:', result);

			if (result.success && result.data) {
				this.token = result.data.token;
				localStorage.setItem(
					'authToken',
					this.token
				);
				localStorage.setItem(
					'user',
					JSON.stringify(result.data.user)
				);
			}

			return result;
		} catch (error) {
			console.error('Registration error:', error);
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	async login(data: LoginData): Promise<AuthResponse> {
		try {
			console.log('🔐 Login attempt with data:', {
				email: data.email,
				password: '[REDACTED]',
			});

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

			console.log(
				'📡 Response status:',
				response.status
			);
			console.log(
				'📡 Response headers:',
				Object.fromEntries(
					response.headers.entries()
				)
			);

			const result: AuthResponse =
				await response.json();

			console.log('📦 Response data:', result);

			if (result.success && result.data) {
				this.token = result.data.token;
				localStorage.setItem(
					'authToken',
					this.token
				);
				localStorage.setItem(
					'user',
					JSON.stringify(result.data.user)
				);
			}

			return result;
		} catch (error) {
			console.error('Login error:', error);
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
			console.log('🔑 Password change attempt');

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

			console.log(
				'📡 Response status:',
				response.status
			);

			const result: AuthResponse =
				await response.json();

			console.log('📦 Response data:', result);

			// If password change is successful, the backend invalidates all sessions
			// So we need to logout the user and redirect to login
			if (result.success) {
				await this.logout();
			}

			return result;
		} catch (error) {
			console.error('Change password error:', error);
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	}

	async deleteAccount(): Promise<AuthResponse> {
		try {
			console.log('🗑️ Account deletion attempt');

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

			console.log(
				'📡 Response status:',
				response.status
			);

			const result: AuthResponse =
				await response.json();

			console.log('📦 Response data:', result);

			// If account deletion is successful, logout and clear all data
			if (result.success) {
				await this.logout();
			}

			return result;
		} catch (error) {
			console.error('Delete account error:', error);
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
						Authorization: `Bearer ${this.token}`,
						'Content-Type': 'application/json',
					},
				});
			}
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			this.token = null;
			localStorage.removeItem('authToken');
			localStorage.removeItem('user');
		}
	}

	isAuthenticated(): boolean {
		return !!this.token;
	}

	getToken(): string | null {
		return this.token;
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
	 * Get user profile from database (fresh data)
	 */
	async getProfile(): Promise<ProfileResponse> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/auth/profile`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${this.token}`,
					},
				}
			);

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
		} catch (error) {
			console.error('Get profile error:', error);
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
			const response = await fetch(
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
		} catch (error) {
			console.error('Update profile error:', error);
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
}

export const authService = new AuthService();
