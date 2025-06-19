import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface FeatureFlag {
	id: string;
	name: string;
	description: string;
	enabled: boolean;
	rolloutPercentage: number;
	targetUsers?: string[];
	environment: 'development' | 'staging' | 'production';
	createdBy: string;
	createdAt: string;
	lastModified: string;
	category: 'ui' | 'api' | 'feature' | 'experiment';
}

// Mock admin user for authentication
const ADMIN_CREDENTIALS = {
	email: 'admin@neuronflow.ai',
	password: 'admin123!', // In production, this should be hashed
	user: {
		id: 'admin-1',
		email: 'admin@neuronflow.ai',
		firstName: 'System',
		lastName: 'Administrator',
		role: 'super_admin' as const,
		createdAt: new Date().toISOString(),
		lastLogin: new Date().toISOString(),
		isActive: true,
	},
};

// In-memory feature flags store (in production, use database)
const featureFlags: FeatureFlag[] = [
	{
		id: 'enhanced-voice-synthesis',
		name: 'Enhanced Voice Synthesis',
		description:
			'Advanced AI-powered voice generation with emotional tone',
		enabled: true,
		rolloutPercentage: 75,
		category: 'feature',
		environment: 'production',
		createdBy: 'admin-001',
		createdAt: new Date().toISOString(),
		lastModified: new Date().toISOString(),
	},
	{
		id: 'beta-document-analysis',
		name: 'Beta Document Analysis',
		description:
			'Experimental document parsing and analysis features',
		enabled: false,
		rolloutPercentage: 25,
		category: 'experiment',
		environment: 'staging',
		createdBy: 'admin-001',
		createdAt: new Date().toISOString(),
		lastModified: new Date().toISOString(),
	},
	{
		id: 'new-ui-theme',
		name: 'New UI Theme',
		description: 'Modern redesigned user interface',
		enabled: true,
		rolloutPercentage: 100,
		category: 'ui',
		environment: 'production',
		createdBy: 'admin-001',
		createdAt: new Date().toISOString(),
		lastModified: new Date().toISOString(),
	},
];

export class AdminController {
	/**
	 * Admin login
	 */
	static async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;

			if (
				email === ADMIN_CREDENTIALS.email &&
				password === ADMIN_CREDENTIALS.password
			) {
				// In production, implement proper JWT token generation
				const token = 'admin-jwt-token-here';

				res.json({
					success: true,
					data: {
						user: ADMIN_CREDENTIALS.user,
						token,
					},
				});
			} else {
				res.status(401).json({
					success: false,
					message: 'Invalid admin credentials',
				});
			}
		} catch (error) {
			console.error('Admin login error:', error);
			res.status(500).json({
				success: false,
				message: 'Internal server error',
			});
		}
	}

	/**
	 * Get all users with analytics
	 */
	static async getAllUsers(req: Request, res: Response) {
		try {
			const users = await prisma.user.findMany({
				select: {
					id: true,
					firstName: true,
					lastName: true,
					email: true,
					isVerified: true,
					createdAt: true,
					updatedAt: true,
					preferences: true,
				},
			});

			const usersWithAnalytics = await Promise.all(
				users.map(async (user) => {
					const chats =
						await prisma.chat.findMany({
							where: { userId: user.id },
							select: {
								id: true,
								totalMessages: true,
								createdAt: true,
							},
						});

					const conversations =
						await prisma.conversation.findMany({
							where: { userId: user.id },
							include: {
								messages: {
									select: {
										id: true,
										createdAt: true,
										model: true,
									},
								},
							},
						});

					// Calculate analytics
					const totalChats =
						chats.length + conversations.length;
					const allMessages =
						conversations.flatMap(
							(conv) => conv.messages
						);
					const totalMessages =
						allMessages.length +
						chats.reduce(
							(sum, chat) =>
								sum + chat.totalMessages,
							0
						);

					const lastActive =
						allMessages.length > 0
							? Math.max(
									...allMessages.map(
										(m) =>
											new Date(
												m.createdAt
											).getTime()
									)
								)
							: new Date(
									user.createdAt
								).getTime();

					// Calculate average session duration (mock calculation)
					const averageSessionDuration =
						Math.floor(Math.random() * 1800) +
						300; // 5-35 minutes in seconds

					// Mock favorite models based on usage patterns
					const favoriteModels = [
						{
							modelId: 'gpt-4',
							modelName: 'GPT-4',
							usageCount:
								Math.floor(
									Math.random() * 100
								) + 10,
						},
						{
							modelId: 'claude-3',
							modelName: 'Claude-3',
							usageCount:
								Math.floor(
									Math.random() * 80
								) + 5,
						},
					]
						.sort(
							(a, b) =>
								b.usageCount - a.usageCount
						)
						.slice(0, 2);

					return {
						id: user.id,
						firstName: user.firstName,
						lastName: user.lastName,
						email: user.email,
						createdAt:
							user.createdAt.toISOString(),
						lastActivity: new Date(
							lastActive
						).toISOString(),
						isVerified: user.isVerified,
						accountStatus: user.isVerified
							? 'active'
							: 'pending',
						totalChats,
						totalMessages,
						averageSessionDuration,
						favoriteModels: favoriteModels.map(
							(model) => ({
								...model,
								lastUsed:
									new Date().toISOString(),
							})
						),
						preferredCategories: [
							{
								category: 'work',
								count:
									Math.floor(
										Math.random() * 50
									) + 10,
							},
							{
								category: 'research',
								count:
									Math.floor(
										Math.random() * 30
									) + 5,
							},
						],
						settings: {
							theme:
								(user.preferences as any)
									?.theme || 'dark',
							language:
								(user.preferences as any)
									?.language || 'en',
							voiceEnabled:
								(user.preferences as any)
									?.voiceEnabled || false,
						},
					};
				})
			);

			res.json({
				success: true,
				data: usersWithAnalytics,
			});
		} catch (error) {
			console.error('Get users error:', error);
			res.status(500).json({
				success: false,
				message: 'Failed to fetch users',
			});
		}
	}

	/**
	 * Get system health metrics
	 */
	static async getSystemHealth(
		req: Request,
		res: Response
	) {
		try {
			// Get system metrics
			const cpuUsage = process.cpuUsage();
			const memoryUsage = process.memoryUsage();
			const uptime = process.uptime();

			// Mock service health checks
			const services = [
				{
					name: 'OpenRouter API',
					status: 'online' as const,
					responseTime:
						Math.floor(Math.random() * 100) +
						50,
					uptime: 99.9,
				},
				{
					name: 'MongoDB',
					status: 'online' as const,
					responseTime:
						Math.floor(Math.random() * 50) + 10,
					uptime: 99.8,
				},
				{
					name: 'Resend Email',
					status: 'online' as const,
					responseTime:
						Math.floor(Math.random() * 200) +
						100,
					uptime: 99.5,
				},
				{
					name: 'Cloudinary',
					status: 'online' as const,
					responseTime:
						Math.floor(Math.random() * 150) +
						75,
					uptime: 99.7,
				},
			];

			// Get active user count
			const activeUsers = await prisma.user.count({
				where: {
					updatedAt: {
						gte: new Date(
							Date.now() - 24 * 60 * 60 * 1000
						),
					},
				},
			});

			const metrics = {
				apiResponseTime:
					Math.floor(Math.random() * 200) + 100,
				databaseConnections:
					Math.floor(Math.random() * 50) + 10,
				activeUsers,
				errorRate: Math.random() * 2, // 0-2%
				cpuUsage: Math.random() * 80, // 0-80%
				memoryUsage:
					(memoryUsage.heapUsed /
						memoryUsage.heapTotal) *
					100,
				diskUsage: Math.random() * 60 + 20, // 20-80%
			};

			const recentErrors = [
				{
					id: 'error-1',
					message:
						'Rate limit exceeded for OpenRouter API',
					severity: 'warning' as const,
					timestamp: new Date(
						Date.now() - Math.random() * 3600000
					).toISOString(),
					count:
						Math.floor(Math.random() * 5) + 1,
				},
				{
					id: 'error-2',
					message:
						'Temporary database connection timeout',
					severity: 'error' as const,
					timestamp: new Date(
						Date.now() - Math.random() * 7200000
					).toISOString(),
					count:
						Math.floor(Math.random() * 3) + 1,
				},
			];

			res.json({
				success: true,
				data: {
					services,
					metrics,
					recentErrors,
					lastUpdated: new Date().toISOString(),
				},
			});
		} catch (error) {
			console.error(
				'Get system health error:',
				error
			);
			res.status(500).json({
				success: false,
				message: 'Failed to fetch system health',
			});
		}
	}

	/**
	 * Get feature flags
	 */
	static async getFeatureFlags(
		req: Request,
		res: Response
	) {
		try {
			res.json({
				success: true,
				data: featureFlags,
			});
		} catch (error) {
			console.error(
				'Get feature flags error:',
				error
			);
			res.status(500).json({
				success: false,
				message: 'Failed to fetch feature flags',
			});
		}
	}

	/**
	 * Toggle feature flag
	 */
	static async toggleFeatureFlag(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const { flagId } = req.params;
			const { enabled } = req.body;

			const flagIndex = featureFlags.findIndex(
				(flag) => flag.id === flagId
			);
			if (flagIndex === -1) {
				res.status(404).json({
					success: false,
					message: 'Feature flag not found',
				});
				return;
			}

			featureFlags[flagIndex].enabled = enabled;
			featureFlags[flagIndex].lastModified =
				new Date().toISOString();

			res.json({
				success: true,
				data: featureFlags[flagIndex],
			});
		} catch (error) {
			console.error(
				'Toggle feature flag error:',
				error
			);
			res.status(500).json({
				success: false,
				message: 'Failed to toggle feature flag',
			});
		}
	}

	/**
	 * Update feature flag rollout
	 */
	static async updateFeatureFlagRollout(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const { flagId } = req.params;
			const { rolloutPercentage } = req.body;

			const flagIndex = featureFlags.findIndex(
				(flag) => flag.id === flagId
			);
			if (flagIndex === -1) {
				res.status(404).json({
					success: false,
					message: 'Feature flag not found',
				});
				return;
			}

			featureFlags[flagIndex].rolloutPercentage =
				rolloutPercentage;
			featureFlags[flagIndex].lastModified =
				new Date().toISOString();

			res.json({
				success: true,
				data: featureFlags[flagIndex],
			});
		} catch (error) {
			console.error(
				'Update feature flag rollout error:',
				error
			);
			res.status(500).json({
				success: false,
				message:
					'Failed to update feature flag rollout',
			});
		}
	}

	/**
	 * Create new feature flag
	 */
	static async createFeatureFlag(
		req: Request,
		res: Response
	) {
		try {
			const {
				name,
				description,
				category,
				environment,
			} = req.body;

			const newFlag: FeatureFlag = {
				id: `flag-${Date.now()}`,
				name,
				description,
				enabled: false,
				rolloutPercentage: 0,
				category,
				environment,
				createdBy: 'admin-001',
				createdAt: new Date().toISOString(),
				lastModified: new Date().toISOString(),
			};

			featureFlags.push(newFlag);

			res.status(201).json({
				success: true,
				data: newFlag,
			});
		} catch (error) {
			console.error(
				'Create feature flag error:',
				error
			);
			res.status(500).json({
				success: false,
				message: 'Failed to create feature flag',
			});
		}
	}

	/**
	 * Get admin analytics
	 */
	static async getAdminAnalytics(
		req: Request,
		res: Response
	) {
		try {
			const totalUsers = await prisma.user.count();
			const activeUsers = await prisma.user.count({
				where: {
					updatedAt: {
						gte: new Date(
							Date.now() - 24 * 60 * 60 * 1000
						),
					},
				},
			});
			const totalChats = await prisma.chat.count();
			const totalConversations =
				await prisma.conversation.count();
			const totalMessages =
				await prisma.message.count();

			// Mock user growth data
			const userGrowth = Array.from(
				{ length: 30 },
				(_, i) => ({
					date: new Date(
						Date.now() -
							(29 - i) * 24 * 60 * 60 * 1000
					)
						.toISOString()
						.split('T')[0],
					users:
						Math.floor(Math.random() * 20) + 5,
				})
			);

			// Mock model usage data
			const modelUsage = [
				{
					modelId: 'gpt-4',
					modelName: 'GPT-4',
					totalRequests:
						Math.floor(Math.random() * 10000) +
						5000,
					uniqueUsers:
						Math.floor(Math.random() * 1000) +
						500,
					avgResponseTime:
						Math.floor(Math.random() * 2000) +
						1000,
				},
				{
					modelId: 'claude-3',
					modelName: 'Claude-3',
					totalRequests:
						Math.floor(Math.random() * 8000) +
						3000,
					uniqueUsers:
						Math.floor(Math.random() * 800) +
						400,
					avgResponseTime:
						Math.floor(Math.random() * 1800) +
						900,
				},
				{
					modelId: 'gemini-pro',
					modelName: 'Gemini Pro',
					totalRequests:
						Math.floor(Math.random() * 6000) +
						2000,
					uniqueUsers:
						Math.floor(Math.random() * 600) +
						300,
					avgResponseTime:
						Math.floor(Math.random() * 1500) +
						800,
				},
			];

			// Mock geographic data
			const geographicData = [
				{
					country: 'United States',
					users:
						Math.floor(Math.random() * 500) +
						200,
				},
				{
					country: 'United Kingdom',
					users:
						Math.floor(Math.random() * 300) +
						100,
				},
				{
					country: 'Canada',
					users:
						Math.floor(Math.random() * 200) +
						80,
				},
				{
					country: 'Germany',
					users:
						Math.floor(Math.random() * 250) +
						90,
				},
				{
					country: 'France',
					users:
						Math.floor(Math.random() * 180) +
						70,
				},
			];

			res.json({
				success: true,
				data: {
					overview: {
						totalUsers,
						activeUsers,
						totalChats,
						totalMessages,
					},
					userGrowth,
					modelUsage,
					geographicData,
				},
			});
		} catch (error) {
			console.error(
				'Get admin analytics error:',
				error
			);
			res.status(500).json({
				success: false,
				message: 'Failed to fetch admin analytics',
			});
		}
	}

	/**
	 * Perform user action (suspend, activate, delete)
	 */
	static async performUserAction(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const { userId } = req.params;
			const { action } = req.body;

			const user = await prisma.user.findUnique({
				where: { id: userId },
			});
			if (!user) {
				res.status(404).json({
					success: false,
					message: 'User not found',
				});
				return;
			}

			switch (action) {
				case 'suspend':
					await prisma.user.update({
						where: { id: userId },
						data: { isVerified: false },
					});
					break;
				case 'activate':
					await prisma.user.update({
						where: { id: userId },
						data: { isVerified: true },
					});
					break;
				case 'delete':
					// In production, you might want to soft delete or archive instead
					// Delete related data first due to foreign key constraints
					await prisma.message.deleteMany({
						where: {
							conversation: {
								userId: userId,
							},
						},
					});
					await prisma.conversation.deleteMany({
						where: { userId: userId },
					});
					await prisma.chat.deleteMany({
						where: { userId: userId },
					});
					await prisma.session.deleteMany({
						where: { userId: userId },
					});
					await prisma.user.delete({
						where: { id: userId },
					});
					break;
				default:
					res.status(400).json({
						success: false,
						message: 'Invalid action',
					});
					return;
			}

			res.json({
				success: true,
				message: `User ${action}d successfully`,
			});
		} catch (error) {
			console.error(
				'Perform user action error:',
				error
			);
			res.status(500).json({
				success: false,
				message: 'Failed to perform user action',
			});
		}
	}

	/**
	 * Edit a feature flag
	 */
	static async editFeatureFlag(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const { flagId } = req.params;
			const updates = req.body;

			const flagIndex = featureFlags.findIndex(
				(f) => f.id === flagId
			);

			if (flagIndex === -1) {
				res.status(404).json({
					success: false,
					message: 'Feature flag not found',
				});
				return;
			}

			// Update the flag with provided updates
			featureFlags[flagIndex] = {
				...featureFlags[flagIndex],
				...updates,
				lastModified: new Date().toISOString(),
			};

			res.json({
				success: true,
				message:
					'Feature flag updated successfully',
				data: featureFlags[flagIndex],
			});
		} catch (error) {
			console.error(
				'Edit feature flag error:',
				error
			);
			res.status(500).json({
				success: false,
				message: 'Failed to edit feature flag',
			});
		}
	}

	/**
	 * Delete a feature flag
	 */
	static async deleteFeatureFlag(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const { flagId } = req.params;

			const flagIndex = featureFlags.findIndex(
				(f) => f.id === flagId
			);

			if (flagIndex === -1) {
				res.status(404).json({
					success: false,
					message: 'Feature flag not found',
				});
				return;
			}

			// Remove the flag from the array
			const deletedFlag = featureFlags.splice(
				flagIndex,
				1
			)[0];

			res.json({
				success: true,
				message:
					'Feature flag deleted successfully',
				data: deletedFlag,
			});
		} catch (error) {
			console.error(
				'Delete feature flag error:',
				error
			);
			res.status(500).json({
				success: false,
				message: 'Failed to delete feature flag',
			});
		}
	}
}
