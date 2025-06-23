import { Request, Response, NextFunction } from 'express';
import rateLimitService from '../services/rateLimitService';

export interface RateLimitOptions {
	windowMs?: number;
	maxRequests?: number;
	keyGenerator?: (req: Request) => string;
	skipSuccessfulRequests?: boolean;
	skipFailedRequests?: boolean;
	onLimitReached?: (req: Request, res: Response) => void;
}

/**
 * Custom rate limiting middleware using Redis for persistence
 */
export function createRateLimiter(
	options: RateLimitOptions = {}
) {
	const {
		windowMs = 15 * 60 * 1000, // 15 minutes
		maxRequests = 100,
		keyGenerator = (req: Request) =>
			req.ip || 'unknown',
		skipSuccessfulRequests = false,
		skipFailedRequests = false,
		onLimitReached = (req: Request, res: Response) => {
			res.status(429).json({
				success: false,
				message:
					'Too many requests, please try again later.',
				error: 'RATE_LIMIT_EXCEEDED',
			});
		},
	} = options;

	return async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const key = keyGenerator(req);

			// Check rate limit
			const result =
				await rateLimitService.checkRateLimit(
					key,
					maxRequests,
					windowMs
				);

			// Add rate limit headers
			res.set({
				'X-RateLimit-Limit': maxRequests.toString(),
				'X-RateLimit-Remaining':
					result.remaining.toString(),
				'X-RateLimit-Reset': new Date(
					result.resetTime
				).toISOString(),
				'X-RateLimit-Window': windowMs.toString(),
			});

			// Check if rate limit exceeded
			if (!result.allowed) {
				onLimitReached(req, res);
				return;
			}

			// Handle response to potentially decrement counter for failed requests
			if (
				skipSuccessfulRequests ||
				skipFailedRequests
			) {
				const originalSend = res.send;
				res.send = function (data) {
					const statusCode = res.statusCode;
					const shouldSkip =
						(skipSuccessfulRequests &&
							statusCode < 400) ||
						(skipFailedRequests &&
							statusCode >= 400);

					if (shouldSkip) {
						// Note: In a more sophisticated implementation,
						// you might decrement the counter here
					}

					return originalSend.call(this, data);
				};
			}

			next();
		} catch (error) {
			console.error('Rate limiter error:', error);
			// On error, allow the request to proceed
			next();
		}
	};
}

/**
 * Pre-configured rate limiters for different endpoints
 */
export const authRateLimiter = createRateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	maxRequests: 50, // More restrictive for auth endpoints
	keyGenerator: (req) => `auth:${req.ip}`,
	onLimitReached: (req, res) => {
		res.status(429).json({
			success: false,
			message:
				'Too many authentication attempts, please try again later.',
			error: 'RATE_LIMIT_EXCEEDED',
		});
	},
});

export const generalRateLimiter = createRateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	maxRequests: 1000, // More permissive for general endpoints
	keyGenerator: (req) => `general:${req.ip}`,
});

export const passwordResetRateLimiter = createRateLimiter({
	windowMs: 60 * 60 * 1000, // 1 hour
	maxRequests: 5, // Very restrictive for password reset
	keyGenerator: (req) =>
		`pwd_reset:${req.ip}:${req.body?.email || 'unknown'}`,
	onLimitReached: (req, res) => {
		res.status(429).json({
			success: false,
			message:
				'Too many password reset attempts. Please try again in an hour.',
			error: 'RATE_LIMIT_EXCEEDED',
		});
	},
});

export const emailVerificationRateLimiter =
	createRateLimiter({
		windowMs: 10 * 60 * 1000, // 10 minutes
		maxRequests: 3, // Limit email verification resends
		keyGenerator: (req) =>
			`email_verify:${req.ip}:${req.body?.email || 'unknown'}`,
		onLimitReached: (req, res) => {
			res.status(429).json({
				success: false,
				message:
					'Too many verification emails sent. Please wait before requesting another.',
				error: 'RATE_LIMIT_EXCEEDED',
			});
		},
	});

export default {
	createRateLimiter,
	authRateLimiter,
	generalRateLimiter,
	passwordResetRateLimiter,
	emailVerificationRateLimiter,
};
