import { Request, Response, NextFunction } from 'express';
import {
	AppError,
	ApiResponse,
	HttpStatusCode,
} from '../types';
import config from '../config/environment';

/**
 * Global error handling middleware
 */
export const errorHandler = (
	err: Error | AppError,
	req: Request,
	res: Response<ApiResponse>,
	next: NextFunction
): void => {
	let error = { ...err } as AppError;
	error.message = err.message;

	// Log error for debugging
	console.error('Error:', {
		message: err.message,
		stack: err.stack,
		url: req.url,
		method: req.method,
		timestamp: new Date().toISOString(),
	});

	// Mongoose bad ObjectId
	if (err.name === 'CastError') {
		const message = 'Invalid resource ID';
		error = new AppError(
			message,
			HttpStatusCode.BAD_REQUEST
		);
	}

	// Mongoose duplicate key
	if (
		err.name === 'MongoError' &&
		(err as any).code === 11000
	) {
		const message = 'Duplicate field value entered';
		error = new AppError(
			message,
			HttpStatusCode.CONFLICT
		);
	}

	// Mongoose validation error
	if (err.name === 'ValidationError') {
		const message = 'Validation failed';
		error = new AppError(
			message,
			HttpStatusCode.BAD_REQUEST
		);
	}

	// JWT errors
	if (err.name === 'JsonWebTokenError') {
		const message = 'Invalid token';
		error = new AppError(
			message,
			HttpStatusCode.UNAUTHORIZED
		);
	}

	if (err.name === 'TokenExpiredError') {
		const message = 'Token expired';
		error = new AppError(
			message,
			HttpStatusCode.UNAUTHORIZED
		);
	}

	// Default to 500 server error
	const statusCode =
		error.statusCode ||
		HttpStatusCode.INTERNAL_SERVER_ERROR;
	const message =
		error.message || 'Internal server error';

	res.status(statusCode).json({
		success: false,
		message,
		error:
			config.NODE_ENV === 'development'
				? err.stack
				: undefined,
	});
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
		message: `Route ${req.originalUrl} not found`,
		error: 'Not Found',
	});
};

/**
 * Async error wrapper to catch async errors
 */
export const asyncHandler = (fn: Function) => {
	return (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};
