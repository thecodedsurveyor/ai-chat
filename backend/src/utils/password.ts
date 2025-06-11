import bcrypt from 'bcryptjs';
import config from '../config/environment';

// Simple in-memory cache for recent password validations
const passwordCache = new Map<
	string,
	{ hash: string; isValid: boolean; timestamp: number }
>();
const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export class PasswordUtils {
	/**
	 * Hash a password with optimized salt generation
	 */
	static async hashPassword(
		password: string
	): Promise<string> {
		try {
			// Use faster salt generation with optimized rounds
			const salt = await bcrypt.genSalt(
				config.BCRYPT_SALT_ROUNDS
			);
			return await bcrypt.hash(password, salt);
		} catch (error) {
			console.error(
				'Password hashing failed:',
				error
			);
			throw new Error('Failed to hash password');
		}
	}

	/**
	 * Compare password with hash using cache optimization
	 */
	static async comparePassword(
		password: string,
		hash: string
	): Promise<boolean> {
		try {
			// Create cache key
			const cacheKey = `${password.substring(0, 20)}:${hash.substring(0, 20)}`;

			// Check cache first
			const cached = passwordCache.get(cacheKey);
			if (
				cached &&
				Date.now() - cached.timestamp <
					CACHE_TIMEOUT
			) {
				return cached.isValid;
			}

			// Perform comparison
			const isValid = await bcrypt.compare(
				password,
				hash
			);

			// Cache result for future requests (only cache valid results for security)
			if (isValid) {
				passwordCache.set(cacheKey, {
					hash,
					isValid,
					timestamp: Date.now(),
				});
			}

			// Clean old cache entries periodically
			if (passwordCache.size > 100) {
				this.cleanPasswordCache();
			}

			return isValid;
		} catch (error) {
			console.error(
				'Password comparison failed:',
				error
			);
			throw new Error('Failed to compare password');
		}
	}

	/**
	 * Clean expired cache entries
	 */
	private static cleanPasswordCache(): void {
		const now = Date.now();
		for (const [
			key,
			value,
		] of passwordCache.entries()) {
			if (now - value.timestamp > CACHE_TIMEOUT) {
				passwordCache.delete(key);
			}
		}
	}

	/**
	 * Validate password strength
	 */
	static validatePasswordStrength(password: string): {
		isValid: boolean;
		errors: string[];
	} {
		const errors: string[] = [];

		if (password.length < 8) {
			errors.push(
				'Password must be at least 8 characters long'
			);
		}

		if (!/[a-z]/.test(password)) {
			errors.push(
				'Password must contain at least one lowercase letter'
			);
		}

		if (!/[A-Z]/.test(password)) {
			errors.push(
				'Password must contain at least one uppercase letter'
			);
		}

		if (!/\d/.test(password)) {
			errors.push(
				'Password must contain at least one number'
			);
		}

		if (
			!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
				password
			)
		) {
			errors.push(
				'Password must contain at least one special character'
			);
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}

	/**
	 * Generate a random password
	 */
	static generateRandomPassword(
		length: number = 12
	): string {
		const charset =
			'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
		let password = '';

		for (let i = 0; i < length; i++) {
			password += charset.charAt(
				Math.floor(Math.random() * charset.length)
			);
		}

		return password;
	}

	/**
	 * Clear password cache (for security)
	 */
	static clearPasswordCache(): void {
		passwordCache.clear();
	}
}
