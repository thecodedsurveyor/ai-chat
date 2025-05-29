const API_BASE_URL = 'http://localhost:3001/api';

export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	createdAt: string;
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
}

export const authService = new AuthService();
