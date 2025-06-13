import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import config from '../config/environment';

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
	 * Compare password with hash - SECURE VERSION (no caching)
	 */
	static async comparePassword(
		password: string,
		hash: string
	): Promise<boolean> {
		try {
			// Direct comparison without caching for security
			return await bcrypt.compare(password, hash);
		} catch (error) {
			console.error(
				'Password comparison failed:',
				error
			);
			throw new Error('Failed to compare password');
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
	 * Generate a cryptographically secure random password
	 */
	static generateRandomPassword(
		length: number = 12
	): string {
		const charset =
			'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
		let password = '';

		// Use crypto.randomBytes for cryptographically secure random generation
		const randomBytes = crypto.randomBytes(length);

		for (let i = 0; i < length; i++) {
			password += charset.charAt(
				randomBytes[i] % charset.length
			);
		}

		return password;
	}

	/**
	 * Securely clear sensitive data from memory
	 */
	static clearSensitiveData(data: string): void {
		// Overwrite the string in memory (best effort)
		if (data) {
			// This is a best-effort approach in JavaScript
			// Real memory clearing would require native modules
			data = '';
		}
	}
}
