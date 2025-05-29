import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { JWTUtils } from '../utils/jwt';
import { PasswordUtils } from '../utils/password';
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
