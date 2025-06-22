import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import config from './config/environment';
import authRoutes from './routes/authRoutes';
import conversationRoutes from './routes/conversationRoutes';
import messageRoutes from './routes/messageRoutes';
import adminRoutes from './routes/adminRoutes';
import {
	errorHandler,
	securityHeaders,
} from './middleware/errorHandler';
import { sanitizeInputs } from './middleware/validation';
import { generalRateLimiter } from './middleware/rateLimiter';

const app = express();

// Security headers middleware (should be first)
app.use(securityHeaders);

// Compression middleware (should be early in the stack)
app.use(
	compression({
		filter: (req, res) => {
			// Don't compress responses with this request header
			if (req.headers['x-no-compression']) {
				return false;
			}
			// Fallback to standard filter function
			return compression.filter(req, res);
		},
		level: 6, // Good balance between compression and CPU usage
		threshold: 1024, // Only compress responses larger than 1KB
	})
);

// Enhanced security middleware with stricter CSP
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				styleSrc: [
					"'self'",
					"'unsafe-inline'", // Consider removing in production
					'https:',
				],
				scriptSrc: ["'self'"],
				imgSrc: [
					"'self'",
					'data:',
					'blob:',
					'https://res.cloudinary.com',
					...(config.NODE_ENV === 'development'
						? ['http://localhost:3001']
						: []),
				],
				fontSrc: ["'self'", 'https:', 'data:'],
				connectSrc: [
					"'self'",
					...(config.NODE_ENV === 'development'
						? [
								'http://localhost:3001',
								'http://localhost:5173',
								'http://localhost:5174',
								'http://localhost:5175',
							]
						: []),
				],
				objectSrc: ["'none'"],
				mediaSrc: ["'self'"],
				frameSrc: ["'none'"],
			},
		},
		crossOriginEmbedderPolicy: false, // Disable if causing issues with external resources
		hsts: {
			maxAge: 31536000, // 1 year
			includeSubDomains: true,
			preload: true,
		},
	})
);

// CORS configuration with enhanced security
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);

			const configUrl = new URL(config.FRONTEND_URL);
			const allowedOrigins = [
				config.FRONTEND_URL,
				...(config.NODE_ENV === 'development'
					? [
							'http://localhost:5173',
							'http://localhost:5174',
							'http://localhost:5175',
							'http://localhost:5176',
							'http://localhost:5177',
							'http://localhost:5178',
							'http://localhost:5179',
						]
					: []),
				`https://${configUrl.host}`,
			];

			if (
				allowedOrigins.indexOf(origin) !== -1 ||
				config.NODE_ENV !== 'production'
			) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true,
		methods: [
			'GET',
			'POST',
			'PUT',
			'DELETE',
			'OPTIONS',
		],
		allowedHeaders: [
			'Content-Type',
			'Authorization',
			'X-Request-ID',
		],
		maxAge: 86400, // Cache preflight for 24 hours
	})
);

// Apply general rate limiting using Redis-based persistent rate limiter
app.use(generalRateLimiter);

// Body parsing middleware with size limits
app.use(
	express.json({
		limit: '2mb',
		verify: (req, res, buf) => {
			// Store raw body for webhook verification if needed
			(
				req as Express.Request & {
					rawBody?: Buffer;
				}
			).rawBody = buf;
		},
	})
);
app.use(
	express.urlencoded({ extended: true, limit: '2mb' })
);

// Input sanitization middleware
app.use(sanitizeInputs);

// Health check endpoints with caching
app.get('/health', (req, res) => {
	res.set('Cache-Control', 'public, max-age=60'); // Cache for 1 minute
	res.json({
		success: true,
		message: 'Server is running',
		timestamp: new Date().toISOString(),
		environment: config.NODE_ENV,
	});
});

app.get('/api/health', (req, res) => {
	res.set('Cache-Control', 'public, max-age=60'); // Cache for 1 minute
	res.json({
		success: true,
		message: 'API is running',
		timestamp: new Date().toISOString(),
		database: 'connected',
		version: '1.0.0',
	});
});

// Note: Static file serving removed - now using Cloudinary for image storage

// API routes (rate limiting is now handled per route)
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use('*', (req, res) => {
	res.status(404).json({
		success: false,
		message: 'Endpoint not found',
		error: 'NOT_FOUND',
	});
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
