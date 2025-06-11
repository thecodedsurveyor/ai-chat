import { Request, Response, NextFunction } from 'express';
import { ApiResponse, HttpStatusCode } from '../types';

/**
 * Global error handling middleware
 */
export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	_next: NextFunction
): void => {
	console.error('Error:', err);

	// Default error response
	let status = 500;
	let message = 'Internal Server Error';

	// Handle specific error types
	if (err.name === 'ValidationError') {
		status = 400;
		message = err.message;
	} else if (err.name === 'UnauthorizedError') {
		status = 401;
		message = 'Unauthorized';
	} else if (err.name === 'CastError') {
		status = 400;
		message = 'Invalid ID format';
	}

	// Send error response
	res.status(status).json({
		success: false,
		message,
		...(process.env.NODE_ENV === 'development' && {
			stack: err.stack,
		}),
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
