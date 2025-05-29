import { Response, NextFunction } from 'express';
import { JWTUtils } from '../utils/jwt';
import {
	AuthenticatedRequest,
	ApiResponse,
	HttpStatusCode,
} from '../types';

/**
 * Authentication middleware to verify JWT tokens
 */
export const authenticateToken = (
	req: AuthenticatedRequest,
	res: Response<ApiResponse>,
	next: NextFunction
): void => {
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
		req.user = decoded;
		next();
	} catch (error) {
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
export const optionalAuth = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): void => {
	try {
		const authHeader = req.headers.authorization;
		const token =
			authHeader && authHeader.split(' ')[1];

		if (token) {
			const decoded =
				JWTUtils.verifyAccessToken(token);
			req.user = decoded;
		}
		next();
	} catch (error) {
		// Continue without authentication if token is invalid
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
