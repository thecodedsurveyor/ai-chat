import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Generate a secure password reset token
 */
export const generatePasswordResetToken = (): string => {
	return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate password reset token expiration time (1 hour from now)
 */
export const generatePasswordResetExpiration = (): Date => {
	return new Date(Date.now() + 60 * 60 * 1000); // 1 hour
};

/**
 * Hash password reset token for database storage
 */
export const hashPasswordResetToken = async (
	token: string
): Promise<string> => {
	return bcrypt.hash(token, 10);
};

/**
 * Verify password reset token
 */
export const verifyPasswordResetToken = async (
	token: string,
	hashedToken: string
): Promise<boolean> => {
	return bcrypt.compare(token, hashedToken);
};

/**
 * Check if password reset token is expired
 */
export const isPasswordResetTokenExpired = (
	expiresAt: Date
): boolean => {
	return new Date() > expiresAt;
};
