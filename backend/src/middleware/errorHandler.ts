import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { ApiResponse, HttpStatusCode } from '../types';

/**
 * Global error handling middleware with enhanced security
 */
export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	_next: NextFunction
): void => {
	// Log error details for debugging (server-side only)
	console.error('Error occurred:', {
		message: err.message,
		stack: err.stack,
		url: req.url,
		method: req.method,
		ip: req.ip,
		userAgent: req.get('User-Agent'),
		timestamp: new Date().toISOString(),
	});

	// Default error response
	let status = 500;
	let message = 'Internal Server Error';
	let errorCode = 'INTERNAL_ERROR';

	// Handle specific error types with secure messaging
	if (err.name === 'ValidationError') {
		status = 400;
		message = 'Invalid input data';
		errorCode = 'VALIDATION_ERROR';
	} else if (
		err.name === 'UnauthorizedError' ||
		err.message.includes('unauthorized')
	) {
		status = 401;
		message = 'Authentication required';
		errorCode = 'UNAUTHORIZED';
	} else if (
		err.name === 'ForbiddenError' ||
		err.message.includes('forbidden')
	) {
		status = 403;
		message = 'Access denied';
		errorCode = 'FORBIDDEN';
	} else if (err.name === 'CastError') {
		status = 400;
		message = 'Invalid ID format';
		errorCode = 'INVALID_ID';
	} else if (
		err.name === 'MongoError' ||
		err.name === 'MongoServerError'
	) {
		status = 500;
		message = 'Database operation failed';
		errorCode = 'DATABASE_ERROR';
	} else if (err.name === 'JsonWebTokenError') {
		status = 401;
		message = 'Invalid token';
		errorCode = 'INVALID_TOKEN';
	} else if (err.name === 'TokenExpiredError') {
		status = 401;
		message = 'Token expired';
		errorCode = 'TOKEN_EXPIRED';
	}

	// Prepare response object
	const errorResponse: ApiResponse = {
		success: false,
		message,
		error: errorCode,
	};

	// Only include stack trace in development mode and for internal errors
	if (
		process.env.NODE_ENV === 'development' &&
		status === 500
	) {
		errorResponse.stack = err.stack;
	}

	// Add request ID for tracking (if available)
	if (req.headers['x-request-id']) {
		errorResponse.requestId = req.headers[
			'x-request-id'
		] as string;
	}

	// Send error response
	res.status(status).json(errorResponse);
};

/**
 * Handle 404 errors for undefined routes
 */
export const notFound = (
	req: Request,
	res: Response<ApiResponse>
): void => {
	res.status(HttpStatusCode.NOT_FOUND).json({
		success: false,
		message: 'Endpoint not found',
		error: 'NOT_FOUND',
	});
};

/**
 * Async error wrapper to catch async errors
 */
export const asyncHandler = (
	fn: (
		req: Request,
		res: Response,
		next: NextFunction
	) => Promise<void>
) => {
	return (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};

/**
 * Security headers middleware
 */
export const securityHeaders = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	// Remove server information
	res.removeHeader('X-Powered-By');

	// Add security headers
	res.setHeader('X-Content-Type-Options', 'nosniff');
	res.setHeader('X-Frame-Options', 'DENY');
	res.setHeader('X-XSS-Protection', '1; mode=block');
	res.setHeader(
		'Referrer-Policy',
		'strict-origin-when-cross-origin'
	);

	// Add request ID for tracking
	if (!req.headers['x-request-id']) {
		const requestId = require('crypto')
			.randomBytes(16)
			.toString('hex');
		req.headers['x-request-id'] = requestId;
		res.setHeader('X-Request-ID', requestId);
	}

	next();
};
