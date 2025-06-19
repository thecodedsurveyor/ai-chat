// Admin Dashboard Types

export interface AdminUser {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: 'admin' | 'super_admin';
	createdAt: string;
	lastLogin?: string;
	isActive: boolean;
}

export interface AdminAuthResponse {
	success: boolean;
	message: string;
	data?: {
		admin: AdminUser;
		accessToken: string;
	};
}

export interface UserAnalytics {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	createdAt: string;
	lastActivity?: string;
	isVerified: boolean;
	totalChats: number;
	totalMessages: number;
	favoriteModels: Array<{
		modelId: string;
		modelName: string;
		usageCount: number;
		lastUsed: string;
	}>;
	averageSessionDuration: number;
	preferredCategories: Array<{
		category: string;
		count: number;
	}>;
	settings: {
		theme: string;
		language: string;
		voiceEnabled: boolean;
	};
	accountStatus: 'active' | 'suspended' | 'pending';
}

export interface SystemHealth {
	status: 'healthy' | 'warning' | 'error';
	timestamp: string;
	metrics: {
		apiResponseTime: number;
		databaseConnections: number;
		activeUsers: number;
		errorRate: number;
		memoryUsage: number;
		cpuUsage: number;
		diskUsage: number;
	};
	services: Array<{
		name: string;
		status: 'online' | 'offline' | 'degraded';
		responseTime: number;
		lastCheck: string;
	}>;
	recentErrors: Array<{
		id: string;
		message: string;
		timestamp: string;
		severity: 'low' | 'medium' | 'high' | 'critical';
		service: string;
	}>;
}

export interface FeatureFlag {
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

export interface AdminAnalytics {
	overview: {
		totalUsers: number;
		activeUsers: number;
		totalChats: number;
		totalMessages: number;
		avgSessionDuration: number;
	};
	userGrowth: Array<{
		date: string;
		newUsers: number;
		activeUsers: number;
	}>;
	modelUsage: Array<{
		modelId: string;
		modelName: string;
		totalRequests: number;
		uniqueUsers: number;
		avgResponseTime: number;
		errorRate: number;
	}>;
	categoryDistribution: Array<{
		category: string;
		count: number;
		percentage: number;
	}>;
	geographicData: Array<{
		country: string;
		userCount: number;
		percentage: number;
	}>;
	errorMetrics: {
		totalErrors: number;
		errorRate: number;
		topErrors: Array<{
			message: string;
			count: number;
			lastOccurred: string;
		}>;
	};
}

export interface AdminDashboardProps {
	isVisible: boolean;
	onClose: () => void;
}

export interface AdminAuthProps {
	onLoginSuccess: (admin: AdminUser) => void;
}

export interface UserManagementProps {
	users: UserAnalytics[];
	onUserAction: (
		userId: string,
		action: 'suspend' | 'activate' | 'delete'
	) => void;
}

export interface SystemHealthProps {
	healthData: SystemHealth;
	onRefresh: () => void;
}

export interface FeatureFlagProps {
	flags: FeatureFlag[];
	onToggleFlag: (
		flagId: string,
		enabled: boolean
	) => void;
	onUpdateRollout: (
		flagId: string,
		percentage: number
	) => void;
	onCreateFlag: (
		flag: Omit<
			FeatureFlag,
			'id' | 'createdAt' | 'lastModified'
		>
	) => void;
	onEditFlag: (
		flagId: string,
		updates: Partial<FeatureFlag>
	) => void;
	onDeleteFlag: (flagId: string) => void;
}
