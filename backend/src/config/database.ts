import { PrismaClient } from '@prisma/client';
import config from './environment';

/**
 * Enhanced Prisma client with security configurations
 */
class DatabaseManager {
	private static instance: PrismaClient;
	private static isConnected = false;

	static getInstance(): PrismaClient {
		if (!DatabaseManager.instance) {
			DatabaseManager.instance = new PrismaClient({
				datasources: {
					db: {
						url: config.DATABASE_URL,
					},
				},
				log:
					config.NODE_ENV === 'development'
						? ['query', 'info', 'warn', 'error']
						: ['error'],
				errorFormat: 'pretty',
			});

			// Add connection event handlers
			DatabaseManager.instance.$on(
				'beforeExit',
				async () => {
					console.log(
						'🔌 Disconnecting from database...'
					);
					DatabaseManager.isConnected = false;
				}
			);
		}

		return DatabaseManager.instance;
	}

	static async connect(): Promise<void> {
		if (DatabaseManager.isConnected) {
			return;
		}

		try {
			const client = DatabaseManager.getInstance();
			await client.$connect();
			DatabaseManager.isConnected = true;
			console.log(
				'✅ Database connected successfully'
			);
		} catch (error) {
			console.error(
				'❌ Database connection failed:',
				error
			);
			throw new Error(
				'Failed to connect to database'
			);
		}
	}

	static async disconnect(): Promise<void> {
		if (
			DatabaseManager.instance &&
			DatabaseManager.isConnected
		) {
			await DatabaseManager.instance.$disconnect();
			DatabaseManager.isConnected = false;
			console.log('🔌 Database disconnected');
		}
	}

	static async healthCheck(): Promise<boolean> {
		try {
			const client = DatabaseManager.getInstance();
			await client.$queryRaw`SELECT 1`;
			return true;
		} catch (error) {
			console.error(
				'Database health check failed:',
				error
			);
			return false;
		}
	}

	static isHealthy(): boolean {
		return DatabaseManager.isConnected;
	}
}

// Export singleton instance
export const prisma = DatabaseManager.getInstance();
export default DatabaseManager;
