import { createClient, RedisClientType } from 'redis';
import config from '../config/environment';

class RateLimitService {
	private redis: RedisClientType | null = null;
	private isConnected = false;

	constructor() {
		this.initialize();
	}

	private async initialize() {
		try {
			// Create Redis client
			this.redis = createClient({
				url:
					process.env.REDIS_URL ||
					'redis://localhost:6379',
				socket: {
					connectTimeout: 5000,
					reconnectStrategy: (retries) => {
						if (retries > 5) return false;
						return Math.min(
							retries * 100,
							3000
						);
					},
				},
			});

			// Handle Redis events
			this.redis.on('error', (err) => {
				console.warn(
					'⚠️  Redis connection failed, falling back to memory-based rate limiting:',
					err.message
				);
				this.isConnected = false;
			});

			this.redis.on('connect', () => {
				console.log(
					'🔗 Redis connected for persistent rate limiting'
				);
				this.isConnected = true;
			});

			this.redis.on('disconnect', () => {
				console.warn(
					'⚠️  Redis disconnected, falling back to memory-based rate limiting'
				);
				this.isConnected = false;
			});

			// Try to connect
			await this.redis.connect();
		} catch (error) {
			console.warn(
				'⚠️  Redis initialization failed, using memory-based rate limiting:',
				error
			);
			this.isConnected = false;
			this.redis = null;
		}
	}

	/**
	 * Check if request is within rate limit
	 * @param key - Unique identifier for the client (IP, user ID, etc.)
	 * @param maxRequests - Maximum requests allowed
	 * @param windowMs - Time window in milliseconds
	 * @returns Object with allowed status and remaining requests
	 */
	async checkRateLimit(
		key: string,
		maxRequests: number = config.RATE_LIMIT_MAX_REQUESTS,
		windowMs: number = config.RATE_LIMIT_WINDOW_MS
	): Promise<{
		allowed: boolean;
		count: number;
		remaining: number;
		resetTime: number;
	}> {
		if (!this.isConnected || !this.redis) {
			// Fallback to allowing all requests if Redis is unavailable
			return {
				allowed: true,
				count: 0,
				remaining: maxRequests,
				resetTime: Date.now() + windowMs,
			};
		}

		try {
			const now = Date.now();
			const window = Math.floor(now / windowMs);
			const redisKey = `rate_limit:${key}:${window}`;

			// Use Redis pipeline for atomic operations
			const pipeline = this.redis.multi();
			pipeline.incr(redisKey);
			pipeline.expire(
				redisKey,
				Math.ceil(windowMs / 1000)
			);

			const results = await pipeline.exec();
			const count =
				typeof results?.[0] === 'number'
					? results[0]
					: 1;

			const allowed = count <= maxRequests;
			const remaining = Math.max(
				0,
				maxRequests - count
			);
			const resetTime = (window + 1) * windowMs;

			return {
				allowed,
				count,
				remaining,
				resetTime,
			};
		} catch (error) {
			console.error(
				'Redis rate limit check failed:',
				error
			);
			// Fallback to allowing the request
			return {
				allowed: true,
				count: 0,
				remaining: maxRequests,
				resetTime: Date.now() + windowMs,
			};
		}
	}

	/**
	 * Get current rate limit status without incrementing
	 */
	async getRateLimitStatus(
		key: string,
		maxRequests: number = config.RATE_LIMIT_MAX_REQUESTS,
		windowMs: number = config.RATE_LIMIT_WINDOW_MS
	): Promise<{
		count: number;
		remaining: number;
		resetTime: number;
	}> {
		if (!this.isConnected || !this.redis) {
			return {
				count: 0,
				remaining: maxRequests,
				resetTime: Date.now() + windowMs,
			};
		}

		try {
			const now = Date.now();
			const window = Math.floor(now / windowMs);
			const redisKey = `rate_limit:${key}:${window}`;

			const count = await this.redis.get(redisKey);
			const currentCount = count
				? parseInt(count, 10)
				: 0;

			return {
				count: currentCount,
				remaining: Math.max(
					0,
					maxRequests - currentCount
				),
				resetTime: (window + 1) * windowMs,
			};
		} catch (error) {
			console.error(
				'Redis rate limit status check failed:',
				error
			);
			return {
				count: 0,
				remaining: maxRequests,
				resetTime: Date.now() + windowMs,
			};
		}
	}

	/**
	 * Clear rate limit for a specific key (useful for testing)
	 */
	async clearRateLimit(key: string): Promise<void> {
		if (!this.isConnected || !this.redis) {
			return;
		}

		try {
			const pattern = `rate_limit:${key}:*`;
			const keys = await this.redis.keys(pattern);
			if (keys.length > 0) {
				await this.redis.del(keys);
			}
		} catch (error) {
			console.error(
				'Failed to clear rate limit:',
				error
			);
		}
	}

	/**
	 * Get Redis connection status
	 */
	getStatus(): {
		connected: boolean;
		client: string;
	} {
		return {
			connected: this.isConnected,
			client: this.isConnected
				? 'redis'
				: 'memory-fallback',
		};
	}

	/**
	 * Gracefully disconnect from Redis
	 */
	async disconnect(): Promise<void> {
		if (this.redis && this.isConnected) {
			try {
				await this.redis.disconnect();
				console.log(
					'🔌 Redis disconnected gracefully'
				);
			} catch (error) {
				console.error(
					'Error disconnecting from Redis:',
					error
				);
			}
		}
	}
}

// Export singleton instance
export const rateLimitService = new RateLimitService();
export default rateLimitService;
