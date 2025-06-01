import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { JWTUtils } from '../utils/jwt';
import { PasswordUtils } from '../utils/password';
import emailService from '../services/emailService';
import {
	generatePasswordResetToken,
	generatePasswordResetExpiration,
	hashPasswordResetToken,
	verifyPasswordResetToken,
	isPasswordResetTokenExpired,
} from '../utils/passwordReset';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

export const register = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { email, password, firstName, lastName } =
			req.body;

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			res.status(400).json({
				success: false,
				message:
					'User already exists with this email',
			});
			return;
		}

		// Hash password
		const hashedPassword =
			await PasswordUtils.hashPassword(password);

		// Create user
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				firstName,
				lastName,
			},
		});

		// Generate JWT token
		const token = JWTUtils.generateAccessToken({
			userId: user.id,
			email: user.email,
		});

		// Create session
		await prisma.session.create({
			data: {
				userId: user.id,
				token,
				expiresAt: new Date(
					Date.now() + 7 * 24 * 60 * 60 * 1000
				), // 7 days
			},
		});

		// Send welcome email (async, don't wait for it)
		emailService
			.sendWelcomeEmail(email, firstName, lastName)
			.catch((error) =>
				console.error(
					'Welcome email failed:',
					error
				)
			);

		// Remove password from response
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: _, ...userWithoutPassword } =
			user;

		res.status(201).json({
			success: true,
			message: 'User registered successfully',
			data: {
				user: userWithoutPassword,
				token,
			},
		});
	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

export const login = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { email, password } = req.body;

		// Find user by email
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			res.status(401).json({
				success: false,
				message: 'Invalid email or password',
			});
			return;
		}

		// Validate password
		const isValidPassword =
			await PasswordUtils.comparePassword(
				password,
				user.password
			);
		if (!isValidPassword) {
			res.status(401).json({
				success: false,
				message: 'Invalid email or password',
			});
			return;
		}

		// Generate JWT token
		const token = JWTUtils.generateAccessToken({
			userId: user.id,
			email: user.email,
		});

		// Create session
		await prisma.session.create({
			data: {
				userId: user.id,
				token,
				expiresAt: new Date(
					Date.now() + 7 * 24 * 60 * 60 * 1000
				), // 7 days
			},
		});

		// Remove password from response
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: _, ...userWithoutPassword } =
			user;

		res.json({
			success: true,
			message: 'Login successful',
			data: {
				user: userWithoutPassword,
				token,
			},
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

export const logout = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<void> => {
	try {
		const token = req.headers.authorization?.replace(
			'Bearer ',
			''
		);

		if (token) {
			// Delete session
			await prisma.session.deleteMany({
				where: { token },
			});
		}

		res.json({
			success: true,
			message: 'Logout successful',
		});
	} catch (error) {
		console.error('Logout error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

export const getProfile = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<void> => {
	try {
		const userId = req.user?.userId;

		if (!userId) {
			res.status(401).json({
				success: false,
				message: 'User not authenticated',
			});
			return;
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				isVerified: true,
				avatar: true,
				preferences: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!user) {
			res.status(404).json({
				success: false,
				message: 'User not found',
			});
			return;
		}

		res.json({
			success: true,
			data: { user },
		});
	} catch (error) {
		console.error('Get profile error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

export const updateProfile = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		const { firstName, lastName, avatar, preferences } =
			req.body;

		if (!userId) {
			res.status(401).json({
				success: false,
				message: 'User not authenticated',
			});
			return;
		}

		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				firstName,
				lastName,
				avatar,
				preferences,
				updatedAt: new Date(),
			},
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				isVerified: true,
				avatar: true,
				preferences: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		res.json({
			success: true,
			message: 'Profile updated successfully',
			data: { user: updatedUser },
		});
	} catch (error) {
		console.error('Update profile error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

export const changePassword = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		const { currentPassword, newPassword } = req.body;

		if (!userId) {
			res.status(401).json({
				success: false,
				message: 'User not authenticated',
			});
			return;
		}

		// Get user with password
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

		// Validate current password
		const isValidPassword =
			await PasswordUtils.comparePassword(
				currentPassword,
				user.password
			);
		if (!isValidPassword) {
			res.status(400).json({
				success: false,
				message: 'Current password is incorrect',
			});
			return;
		}

		// Hash new password
		const hashedNewPassword =
			await PasswordUtils.hashPassword(newPassword);

		// Update password
		await prisma.user.update({
			where: { id: userId },
			data: {
				password: hashedNewPassword,
				updatedAt: new Date(),
			},
		});

		// Send password change confirmation email (async)
		emailService
			.sendPasswordChangeConfirmation(
				user.email,
				user.firstName
			)
			.catch((error) =>
				console.error(
					'Password change confirmation email failed:',
					error
				)
			);

		// Invalidate all sessions for security
		await prisma.session.deleteMany({
			where: { userId },
		});

		res.json({
			success: true,
			message:
				'Password changed successfully. Please login again.',
		});
	} catch (error) {
		console.error('Change password error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

/**
 * Delete user account - permanently removes user and all associated data
 */
export const deleteAccount = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<void> => {
	try {
		const userId = req.user?.userId;

		if (!userId) {
			res.status(401).json({
				success: false,
				message: 'User not authenticated',
			});
			return;
		}

		// Get user info before deletion for email
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

		// Delete all user sessions first
		await prisma.session.deleteMany({
			where: { userId },
		});

		// Delete the user account
		await prisma.user.delete({
			where: { id: userId },
		});

		res.json({
			success: true,
			message: 'Account deleted successfully',
		});
	} catch (error) {
		console.error('Delete account error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

/**
 * Request password reset - send email with reset link
 */
export const requestPasswordReset = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { email } = req.body;

		// Find user by email
		const user = await prisma.user.findUnique({
			where: { email },
		});

		// Always return success to prevent email enumeration
		if (!user) {
			// Still return success for security, but include a subtle indicator
			// that the frontend can interpret without exposing to attackers
			res.json({
				success: true,
				message:
					'If an account with that email exists, we sent a password reset link.',
				status: 'check_complete', // Special key frontend can check
			});
			return;
		}

		// Generate reset token
		const resetToken = generatePasswordResetToken();
		const hashedToken =
			await hashPasswordResetToken(resetToken);
		const expiresAt = generatePasswordResetExpiration();

		// Save reset token to database
		await prisma.user.update({
			where: { id: user.id },
			data: {
				passwordResetToken: hashedToken,
				passwordResetExpires: expiresAt,
				updatedAt: new Date(),
			},
		});

		// Send password reset email
		const emailSent =
			await emailService.sendPasswordResetEmail(
				user.email,
				user.firstName,
				resetToken
			);

		if (!emailSent) {
			console.error(
				'Failed to send password reset email'
			);
			// Return success but with a subtle indicator that email failed
			res.json({
				success: true,
				message:
					'If an account with that email exists, we sent a password reset link.',
				status: 'email_attempt_complete',
			});
			return;
		}

		// Return success for actual email sent
		res.json({
			success: true,
			message:
				'If an account with that email exists, we sent a password reset link.',
			status: 'email_sent',
		});
	} catch (error) {
		console.error(
			'Request password reset error:',
			error
		);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

/**
 * Reset password using token
 */
export const resetPassword = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { token, email, newPassword } = req.body;

		// Find user by email
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (
			!user ||
			!user.passwordResetToken ||
			!user.passwordResetExpires
		) {
			res.status(400).json({
				success: false,
				message: 'Invalid or expired reset token',
			});
			return;
		}

		// Check if token is expired
		if (
			isPasswordResetTokenExpired(
				user.passwordResetExpires
			)
		) {
			res.status(400).json({
				success: false,
				message: 'Reset token has expired',
			});
			return;
		}

		// Verify reset token
		const isValidToken = await verifyPasswordResetToken(
			token,
			user.passwordResetToken
		);

		if (!isValidToken) {
			res.status(400).json({
				success: false,
				message: 'Invalid reset token',
			});
			return;
		}

		// Hash new password
		const hashedNewPassword =
			await PasswordUtils.hashPassword(newPassword);

		// Update password and clear reset token
		await prisma.user.update({
			where: { id: user.id },
			data: {
				password: hashedNewPassword,
				passwordResetToken: null,
				passwordResetExpires: null,
				updatedAt: new Date(),
			},
		});

		// Invalidate all sessions for security
		await prisma.session.deleteMany({
			where: { userId: user.id },
		});

		// Send password change confirmation email
		emailService
			.sendPasswordChangeConfirmation(
				user.email,
				user.firstName
			)
			.catch((error) =>
				console.error(
					'Password change confirmation email failed:',
					error
				)
			);

		res.json({
			success: true,
			message:
				'Password reset successfully. Please login with your new password.',
		});
	} catch (error) {
		console.error('Reset password error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};
