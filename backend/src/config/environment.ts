import dotenv from 'dotenv';
import crypto from 'crypto';

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

	// Cloudinary
	cloudinary: {
		cloudName: string;
		apiKey: string;
		apiSecret: string;
	};
}

/**
 * Generate a secure random secret if none provided
 */
function generateSecureSecret(): string {
	return crypto.randomBytes(64).toString('hex');
}

/**
 * Validate JWT secret strength
 */
function validateJWTSecret(secret: string): boolean {
	return (
		secret.length >= 32 &&
		secret !== 'your-super-secret-jwt-key-here' &&
		secret !== 'your-refresh-secret-key-here'
	);
}

const config: EnvironmentConfig = {
	// Database Configuration
	DATABASE_URL:
		process.env.DATABASE_URL ||
		'mongodb://localhost:27017/chatbot',

	// JWT Configuration - Enhanced Security
	JWT_SECRET: (() => {
		const secret = process.env.JWT_SECRET;
		if (!secret || !validateJWTSecret(secret)) {
			if (process.env.NODE_ENV === 'production') {
				throw new Error(
					'JWT_SECRET must be provided and be at least 32 characters long in production'
				);
			}
			console.warn(
				'⚠️  Using auto-generated JWT_SECRET for development. Set JWT_SECRET in production!'
			);
			return generateSecureSecret();
		}
		return secret;
	})(),

	JWT_REFRESH_SECRET: (() => {
		const secret = process.env.JWT_REFRESH_SECRET;
		if (!secret || !validateJWTSecret(secret)) {
			if (process.env.NODE_ENV === 'production') {
				throw new Error(
					'JWT_REFRESH_SECRET must be provided and be at least 32 characters long in production'
				);
			}
			console.warn(
				'⚠️  Using auto-generated JWT_REFRESH_SECRET for development. Set JWT_REFRESH_SECRET in production!'
			);
			return generateSecureSecret();
		}
		return secret;
	})(),

	JWT_EXPIRE: process.env.JWT_EXPIRE || '15m',
	JWT_REFRESH_EXPIRE:
		process.env.JWT_REFRESH_EXPIRE || '7d',

	// Server Configuration
	PORT: parseInt(process.env.PORT || '3001', 10),
	NODE_ENV: process.env.NODE_ENV || 'development',

	// CORS Configuration
	FRONTEND_URL:
		process.env.FRONTEND_URL || 'http://localhost:5173',

	// Rate Limiting - More restrictive defaults
	RATE_LIMIT_WINDOW_MS: parseInt(
		process.env.RATE_LIMIT_WINDOW_MS || '900000',
		10
	), // 15 minutes
	RATE_LIMIT_MAX_REQUESTS: parseInt(
		process.env.RATE_LIMIT_MAX_REQUESTS || '100',
		10
	),

	// Security - Stronger defaults
	BCRYPT_SALT_ROUNDS: Math.max(
		10,
		parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10)
	),

	// Cloudinary Configuration
	cloudinary: {
		cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
		apiKey: process.env.CLOUDINARY_API_KEY || '',
		apiSecret: process.env.CLOUDINARY_API_SECRET || '',
	},
};

// Enhanced validation for production environment
if (config.NODE_ENV === 'production') {
	const requiredEnvVars = [
		'DATABASE_URL',
		'JWT_SECRET',
		'JWT_REFRESH_SECRET',
		'FRONTEND_URL',
	];

	const missingVars = requiredEnvVars.filter((envVar) => {
		const value = process.env[envVar];
		return !value || value.trim() === '';
	});

	if (missingVars.length > 0) {
		throw new Error(
			`Missing required environment variables in production: ${missingVars.join(', ')}`
		);
	}

	// Additional production security checks
	if (config.BCRYPT_SALT_ROUNDS < 10) {
		throw new Error(
			'BCRYPT_SALT_ROUNDS must be at least 10 in production'
		);
	}

	if (config.RATE_LIMIT_MAX_REQUESTS > 1000) {
		console.warn(
			'⚠️  Rate limit is very high for production. Consider lowering RATE_LIMIT_MAX_REQUESTS'
		);
	}
}

export default config;
