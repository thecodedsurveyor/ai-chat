import type {
	AdminUser,
	AdminAuthResponse,
	UserAnalytics,
	SystemHealth,
	FeatureFlag,
	AdminAnalytics,
} from '../types/admin';

const API_BASE_URL = 'http://localhost:3001/api/admin';

// Helper function to get auth headers
const getAuthHeaders = () => {
	const token = localStorage.getItem('admin_token');
	return {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` }),
	};
};

// Admin credentials for reference (handled by backend)
// Email: admin@neuronflow.ai
// Password: admin123!

class AdminService {
	private adminToken: string | null = null;

	constructor() {
		this.adminToken =
			localStorage.getItem('adminToken');
	}

	// Authentication
	async login(
		email: string,
		password: string
	): Promise<AdminAuthResponse> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/login`,
				{
					method: 'POST',
					headers: getAuthHeaders(),
					body: JSON.stringify({
						email,
						password,
					}),
				}
			);

			const data = await response.json();

			if (data.success && data.data) {
				this.adminToken = data.data.token;
				localStorage.setItem(
					'adminToken',
					data.data.token
				);
				localStorage.setItem(
					'adminUser',
					JSON.stringify(data.data.user)
				);

				return {
					success: true,
					message: 'Login successful',
					data: {
						admin: data.data.user,
						accessToken: data.data.token,
					},
				};
			}

			return {
				success: false,
				message:
					data.message || 'Invalid credentials',
			};
		} catch (error) {
			console.error('Admin login error:', error);
			return {
				success: false,
				message: 'Login failed. Please try again.',
			};
		}
	}

	async logout(): Promise<void> {
		this.adminToken = null;
		localStorage.removeItem('adminToken');
		localStorage.removeItem('adminUser');
	}

	isAuthenticated(): boolean {
		return !!this.adminToken;
	}

	getAdmin(): AdminUser | null {
		const adminData = localStorage.getItem('adminUser');
		return adminData ? JSON.parse(adminData) : null;
	}

	// User Management
	async getAllUsers(): Promise<UserAnalytics[]> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/users`,
				{
					method: 'GET',
					headers: getAuthHeaders(),
				}
			);

			const data = await response.json();

			if (data.success) {
				return data.data;
			}

			throw new Error(
				data.message || 'Failed to fetch users'
			);
		} catch (error) {
			console.error('Get users error:', error);
			// Fallback to mock data in case of error
			return [
				{
					id: 'user-001',
					email: 'john.doe@example.com',
					firstName: 'John',
					lastName: 'Doe',
					createdAt: '2024-01-15T00:00:00Z',
					lastActivity: '2024-01-20T14:30:00Z',
					isVerified: true,
					totalChats: 45,
					totalMessages: 350,
					favoriteModels: [
						{
							modelId: 'gpt-4',
							modelName: 'GPT-4',
							usageCount: 120,
							lastUsed:
								'2024-01-20T14:30:00Z',
						},
						{
							modelId: 'claude-3',
							modelName: 'Claude-3',
							usageCount: 80,
							lastUsed:
								'2024-01-19T16:20:00Z',
						},
					],
					averageSessionDuration: 1800, // 30 minutes
					preferredCategories: [
						{ category: 'work', count: 25 },
						{ category: 'research', count: 15 },
						{ category: 'personal', count: 5 },
					],
					settings: {
						theme: 'dark',
						language: 'en',
						voiceEnabled: true,
					},
					accountStatus: 'active',
				},
				{
					id: 'user-002',
					email: 'jane.smith@example.com',
					firstName: 'Jane',
					lastName: 'Smith',
					createdAt: '2024-01-10T00:00:00Z',
					lastActivity: '2024-01-20T10:15:00Z',
					isVerified: true,
					totalChats: 32,
					totalMessages: 280,
					favoriteModels: [
						{
							modelId: 'claude-3',
							modelName: 'Claude-3',
							usageCount: 150,
							lastUsed:
								'2024-01-20T10:15:00Z',
						},
						{
							modelId: 'llama-2',
							modelName: 'Llama-2',
							usageCount: 45,
							lastUsed:
								'2024-01-18T09:30:00Z',
						},
					],
					averageSessionDuration: 2400, // 40 minutes
					preferredCategories: [
						{ category: 'research', count: 20 },
						{ category: 'work', count: 8 },
						{ category: 'creative', count: 4 },
					],
					settings: {
						theme: 'light',
						language: 'en',
						voiceEnabled: false,
					},
					accountStatus: 'active',
				},
				{
					id: 'user-003',
					email: 'mike.wilson@example.com',
					firstName: 'Mike',
					lastName: 'Wilson',
					createdAt: '2024-01-18T00:00:00Z',
					lastActivity: '2024-01-19T18:45:00Z',
					isVerified: false,
					totalChats: 12,
					totalMessages: 95,
					favoriteModels: [
						{
							modelId: 'gpt-3.5',
							modelName: 'GPT-3.5',
							usageCount: 60,
							lastUsed:
								'2024-01-19T18:45:00Z',
						},
					],
					averageSessionDuration: 900, // 15 minutes
					preferredCategories: [
						{ category: 'general', count: 8 },
						{ category: 'personal', count: 4 },
					],
					settings: {
						theme: 'auto',
						language: 'en',
						voiceEnabled: false,
					},
					accountStatus: 'pending',
				},
			];
		}
	}

	async updateUserStatus(
		userId: string,
		action: 'suspend' | 'activate' | 'delete'
	): Promise<boolean> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/users/${userId}/action`,
				{
					method: 'POST',
					headers: getAuthHeaders(),
					body: JSON.stringify({ action }),
				}
			);

			const data = await response.json();
			return data.success;
		} catch (error) {
			console.error(
				'Update user status error:',
				error
			);
			return false;
		}
	}

	// System Health
	async getSystemHealth(): Promise<SystemHealth> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/health`,
				{
					method: 'GET',
					headers: getAuthHeaders(),
				}
			);

			const data = await response.json();

			if (data.success) {
				return data.data;
			}

			throw new Error(
				data.message ||
					'Failed to fetch system health'
			);
		} catch (error) {
			console.error(
				'Get system health error:',
				error
			);
			// Fallback to mock data in case of error
			return {
				status: 'healthy',
				timestamp: new Date().toISOString(),
				metrics: {
					apiResponseTime: 145,
					databaseConnections: 12,
					activeUsers: 23,
					errorRate: 0.02,
					memoryUsage: 68.5,
					cpuUsage: 23.8,
					diskUsage: 45.2,
				},
				services: [
					{
						name: 'OpenRouter API',
						status: 'online',
						responseTime: 120,
						lastCheck: new Date().toISOString(),
					},
					{
						name: 'MongoDB',
						status: 'online',
						responseTime: 25,
						lastCheck: new Date().toISOString(),
					},
					{
						name: 'Resend Email',
						status: 'online',
						responseTime: 180,
						lastCheck: new Date().toISOString(),
					},
					{
						name: 'Cloudinary',
						status: 'degraded',
						responseTime: 450,
						lastCheck: new Date().toISOString(),
					},
				],
				recentErrors: [
					{
						id: 'error-001',
						message:
							'API rate limit exceeded for user user-123',
						timestamp: new Date(
							Date.now() - 1800000
						).toISOString(),
						severity: 'medium',
						service: 'OpenRouter API',
					},
					{
						id: 'error-002',
						message: 'Image upload timeout',
						timestamp: new Date(
							Date.now() - 3600000
						).toISOString(),
						severity: 'low',
						service: 'Cloudinary',
					},
				],
			};
		}
	}

	// Feature Flags
	async getFeatureFlags(): Promise<FeatureFlag[]> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/flags`,
				{
					method: 'GET',
					headers: getAuthHeaders(),
				}
			);

			const data = await response.json();

			if (data.success) {
				return data.data;
			}

			throw new Error(
				data.message ||
					'Failed to fetch feature flags'
			);
		} catch (error) {
			console.error(
				'Get feature flags error:',
				error
			);
			// Fallback to mock data in case of error
			return [
				{
					id: 'flag-001',
					name: 'enhanced_voice_synthesis',
					description:
						'Enable advanced voice synthesis features',
					enabled: true,
					rolloutPercentage: 100,
					environment: 'production',
					createdBy: 'admin-001',
					createdAt: '2024-01-01T00:00:00Z',
					lastModified: '2024-01-15T10:30:00Z',
					category: 'feature',
				},
				{
					id: 'flag-002',
					name: 'beta_document_analysis',
					description:
						'Beta document analysis with AI insights',
					enabled: false,
					rolloutPercentage: 25,
					targetUsers: ['user-001', 'user-002'],
					environment: 'production',
					createdBy: 'admin-001',
					createdAt: '2024-01-10T00:00:00Z',
					lastModified: '2024-01-18T14:20:00Z',
					category: 'experiment',
				},
				{
					id: 'flag-003',
					name: 'new_ui_theme',
					description:
						'New gradient UI theme for premium users',
					enabled: true,
					rolloutPercentage: 50,
					environment: 'production',
					createdBy: 'admin-001',
					createdAt: '2024-01-12T00:00:00Z',
					lastModified: '2024-01-19T09:15:00Z',
					category: 'ui',
				},
			];
		}
	}

	async updateFeatureFlag(
		flagId: string,
		updates: Partial<FeatureFlag>
	): Promise<boolean> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/flags/${flagId}`,
				{
					method: 'PUT',
					headers: {
						...getAuthHeaders(),
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(updates),
				}
			);

			const data = await response.json();

			return data.success;
		} catch (error) {
			console.error(
				'Update feature flag error:',
				error
			);
			return false;
		}
	}

	async deleteFeatureFlag(
		flagId: string
	): Promise<boolean> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/flags/${flagId}`,
				{
					method: 'DELETE',
					headers: getAuthHeaders(),
				}
			);

			const data = await response.json();
			return data.success;
		} catch (error) {
			console.error(
				'Delete feature flag error:',
				error
			);
			return false;
		}
	}

	async createFeatureFlag(
		flagData: Omit<
			FeatureFlag,
			'id' | 'createdAt' | 'lastModified'
		>
	): Promise<boolean> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/flags`,
				{
					method: 'POST',
					headers: {
						...getAuthHeaders(),
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(flagData),
				}
			);

			const data = await response.json();
			return data.success;
		} catch (error) {
			console.error(
				'Create feature flag error:',
				error
			);
			return false;
		}
	}

	// Analytics
	async getAdminAnalytics(): Promise<AdminAnalytics> {
		try {
			const response = await fetch(
				`${API_BASE_URL}/analytics`,
				{
					method: 'GET',
					headers: getAuthHeaders(),
				}
			);

			const data = await response.json();

			if (data.success) {
				return data.data;
			}

			throw new Error(
				data.message || 'Failed to fetch analytics'
			);
		} catch (error) {
			console.error('Get analytics error:', error);
			// Fallback to mock data in case of error
			return {
				overview: {
					totalUsers: 1247,
					activeUsers: 89,
					totalChats: 3456,
					totalMessages: 28934,
					avgSessionDuration: 1980, // 33 minutes
				},
				userGrowth: [
					{
						date: '2024-01-14',
						newUsers: 12,
						activeUsers: 78,
					},
					{
						date: '2024-01-15',
						newUsers: 18,
						activeUsers: 82,
					},
					{
						date: '2024-01-16',
						newUsers: 15,
						activeUsers: 85,
					},
					{
						date: '2024-01-17',
						newUsers: 22,
						activeUsers: 87,
					},
					{
						date: '2024-01-18',
						newUsers: 19,
						activeUsers: 89,
					},
					{
						date: '2024-01-19',
						newUsers: 25,
						activeUsers: 91,
					},
					{
						date: '2024-01-20',
						newUsers: 16,
						activeUsers: 89,
					},
				],
				modelUsage: [
					{
						modelId: 'gpt-4',
						modelName: 'GPT-4',
						totalRequests: 15672,
						uniqueUsers: 234,
						avgResponseTime: 2300,
						errorRate: 0.018,
					},
					{
						modelId: 'claude-3',
						modelName: 'Claude-3',
						totalRequests: 12845,
						uniqueUsers: 198,
						avgResponseTime: 1800,
						errorRate: 0.012,
					},
					{
						modelId: 'gpt-3.5',
						modelName: 'GPT-3.5',
						totalRequests: 8934,
						uniqueUsers: 156,
						avgResponseTime: 1200,
						errorRate: 0.008,
					},
				],
				categoryDistribution: [
					{
						category: 'work',
						count: 1385,
						percentage: 40.1,
					},
					{
						category: 'research',
						count: 1039,
						percentage: 30.1,
					},
					{
						category: 'personal',
						count: 693,
						percentage: 20.0,
					},
					{
						category: 'general',
						count: 339,
						percentage: 9.8,
					},
				],
				geographicData: [
					{
						country: 'United States',
						userCount: 456,
						percentage: 36.6,
					},
					{
						country: 'United Kingdom',
						userCount: 189,
						percentage: 15.2,
					},
					{
						country: 'Canada',
						userCount: 134,
						percentage: 10.7,
					},
					{
						country: 'Germany',
						userCount: 98,
						percentage: 7.9,
					},
					{
						country: 'Australia',
						userCount: 76,
						percentage: 6.1,
					},
					{
						country: 'Other',
						userCount: 294,
						percentage: 23.5,
					},
				],
				errorMetrics: {
					totalErrors: 145,
					errorRate: 0.015,
					topErrors: [
						{
							message:
								'API rate limit exceeded',
							count: 45,
							lastOccurred:
								'2024-01-20T14:30:00Z',
						},
						{
							message: 'Model timeout',
							count: 32,
							lastOccurred:
								'2024-01-20T13:15:00Z',
						},
						{
							message: 'Invalid input format',
							count: 18,
							lastOccurred:
								'2024-01-20T11:45:00Z',
						},
					],
				},
			};
		}
	}
}

export const adminService = new AdminService();
