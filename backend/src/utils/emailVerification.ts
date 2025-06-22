import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Generate a secure email verification token
 */
export const generateEmailVerificationToken =
	(): string => {
		return crypto.randomBytes(32).toString('hex');
	};

/**
 * Generate email verification token expiration (24 hours from now)
 */
export const generateEmailVerificationExpiration =
	(): Date => {
		const expiration = new Date();
		expiration.setHours(expiration.getHours() + 24); // 24 hours
		return expiration;
	};

/**
 * Hash the email verification token before storing in database
 */
export const hashEmailVerificationToken = async (
	token: string
): Promise<string> => {
	const saltRounds = 10;
	return bcrypt.hash(token, saltRounds);
};

/**
 * Verify if the provided token matches the hashed token in database
 */
export const verifyEmailVerificationToken = async (
	token: string,
	hashedToken: string
): Promise<boolean> => {
	return bcrypt.compare(token, hashedToken);
};

/**
 * Check if the email verification token has expired
 */
export const isEmailVerificationTokenExpired = (
	expiresAt: Date
): boolean => {
	return new Date() > expiresAt;
};
