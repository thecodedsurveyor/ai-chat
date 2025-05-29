import bcrypt from 'bcryptjs';
import config from '../config/environment';

export class PasswordUtils {
	/**
	 * Hash a password
	 */
	static async hashPassword(
		password: string
	): Promise<string> {
		try {
			const salt = await bcrypt.genSalt(
				config.BCRYPT_SALT_ROUNDS
			);
			return await bcrypt.hash(password, salt);
		} catch (error) {
			throw new Error('Failed to hash password');
		}
	}

	/**
	 * Compare password with hash
	 */
	static async comparePassword(
		password: string,
		hash: string
	): Promise<boolean> {
		try {
			return await bcrypt.compare(password, hash);
		} catch (error) {
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
			!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
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
}
