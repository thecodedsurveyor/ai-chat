import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface EnvironmentConfig {
	// Database
	DATABASE_URL: string;

	// JWT
	JWT_SECRET: string;
	JWT_REFRESH_SECRET: string;
	JWT_EXPIRE: string;
	JWT_REFRESH_EXPIRE: string;

	// Server
	PORT: number;
	NODE_ENV: string;

	// CORS
	FRONTEND_URL: string;

	// Rate Limiting
	RATE_LIMIT_WINDOW_MS: number;
	RATE_LIMIT_MAX_REQUESTS: number;

	// Security
	BCRYPT_SALT_ROUNDS: number;
}

const config: EnvironmentConfig = {
	// Database Configuration
	DATABASE_URL:
		process.env.DATABASE_URL ||
		'mongodb://localhost:27017/ai-chatbot',

	// JWT Configuration
	JWT_SECRET:
		process.env.JWT_SECRET ||
		'your-super-secret-jwt-key-here',
	JWT_REFRESH_SECRET:
		process.env.JWT_REFRESH_SECRET ||
		'your-refresh-secret-key-here',
	JWT_EXPIRE: process.env.JWT_EXPIRE || '15m',
	JWT_REFRESH_EXPIRE:
		process.env.JWT_REFRESH_EXPIRE || '7d',

	// Server Configuration
	PORT: parseInt(process.env.PORT || '3001', 10),
	NODE_ENV: process.env.NODE_ENV || 'development',

	// CORS Configuration
	FRONTEND_URL:
		process.env.FRONTEND_URL || 'http://localhost:5177',

	// Rate Limiting
	RATE_LIMIT_WINDOW_MS: parseInt(
		process.env.RATE_LIMIT_WINDOW_MS || '900000',
		10
	), // 15 minutes
	RATE_LIMIT_MAX_REQUESTS: parseInt(
		process.env.RATE_LIMIT_MAX_REQUESTS || '100',
		10
	),

	// Security
	BCRYPT_SALT_ROUNDS: parseInt(
		process.env.BCRYPT_SALT_ROUNDS || '12',
		10
	),
};

// Validate required environment variables
const requiredEnvVars = [
	'JWT_SECRET',
	'JWT_REFRESH_SECRET',
];

for (const envVar of requiredEnvVars) {
	if (
		!process.env[envVar] &&
		config.NODE_ENV === 'production'
	) {
		throw new Error(
			`Missing required environment variable: ${envVar}`
		);
	}
}

export default config;
