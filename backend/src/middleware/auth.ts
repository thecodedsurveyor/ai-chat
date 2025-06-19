import { Response, NextFunction } from 'express';
import { JWTUtils } from '../utils/jwt';
import { PrismaClient } from '@prisma/client';
import {
	AuthenticatedRequest,
	ApiResponse,
	HttpStatusCode,
} from '../types';

const prisma = new PrismaClient();

/**
 * Authentication middleware to verify JWT tokens and check user existence
 */
export const authenticateToken = async (
	req: AuthenticatedRequest,
	res: Response<ApiResponse>,
	next: NextFunction
): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;
		const token =
			authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

		if (!token) {
			res.status(HttpStatusCode.UNAUTHORIZED).json({
				success: false,
				message: 'Access token required',
				error: 'No token provided',
			});
			return;
		}

		// Verify the token
		const decoded = JWTUtils.verifyAccessToken(token);

		// Check if user still exists in database
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: {
				id: true,
				email: true,
				isVerified: true,
			},
		});

		if (!user) {
			res.status(HttpStatusCode.UNAUTHORIZED).json({
				success: false,
				message: 'User account no longer exists',
				error: 'User not found',
			});
			return;
		}

		req.user = decoded;
		next();
	} catch (error) {
		console.error('Auth middleware error:', error);
		res.status(HttpStatusCode.FORBIDDEN).json({
			success: false,
			message: 'Invalid or expired token',
			error: 'Token verification failed',
		});
	}
};

/**
 * Optional authentication middleware - doesn't fail if no token
 */
export const optionalAuth = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;
		const token =
			authHeader && authHeader.split(' ')[1];

		if (token) {
			const decoded =
				JWTUtils.verifyAccessToken(token);

			// Check if user still exists in database
			const user = await prisma.user.findUnique({
				where: { id: decoded.userId },
				select: {
					id: true,
					email: true,
					isVerified: true,
				},
			});

			if (user) {
				req.user = decoded;
			}
		}
		next();
	} catch {
		// Continue without authentication if token is invalid or user doesn't exist
		next();
	}
};

/**
 * Middleware to check if user is verified
 */
export const requireVerification = (
	req: AuthenticatedRequest,
	res: Response<ApiResponse>,
	next: NextFunction
): void => {
	if (!req.user) {
		res.status(HttpStatusCode.UNAUTHORIZED).json({
			success: false,
			message: 'Authentication required',
			error: 'User not authenticated',
		});
		return;
	}

	// Note: In a real app, you'd check the user's verification status from the database
	// For now, we'll assume all authenticated users are verified
	next();
};
