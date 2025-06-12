import { API_BASE_URL } from '../config';

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
		accessToken: string;
		refreshToken: string;
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

			if (result.success && result.data) {
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

			if (result.success && result.data) {
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
						Authorization: `Bearer ${this.token}`,
						'Content-Type': 'application/json',
					},
				});
			}
		} catch {
			// Logout error
		} finally {
			this.token = null;
			this.refreshToken = null;
			localStorage.removeItem('authToken');
			localStorage.removeItem('refreshToken');
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
}

export const authService = new AuthService();
