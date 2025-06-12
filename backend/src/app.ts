import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import config from './config/environment';
import authRoutes from './routes/authRoutes';
import conversationRoutes from './routes/conversationRoutes';
import messageRoutes from './routes/messageRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

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

// Security middleware with optimized CSP
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				styleSrc: [
					"'self'",
					"'unsafe-inline'",
					'https:',
				],
				scriptSrc: ["'self'"],
				imgSrc: [
					"'self'",
					'data:',
					'blob:',
					'https://res.cloudinary.com',
					'http://localhost:3001',
				],
				fontSrc: ["'self'", 'https:', 'data:'],
				connectSrc: [
					"'self'",
					'http://localhost:3001',
					'http://localhost:5173',
					'http://localhost:5174',
					'http://localhost:5175',
				],
			},
		},
	})
);

// CORS configuration with optimizations
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);

			const configUrl = new URL(config.FRONTEND_URL);
			const allowedOrigins = [
				config.FRONTEND_URL,
				'http://localhost:5173',
				'http://localhost:5174',
				'http://localhost:5175',
				'http://localhost:5176',
				'http://localhost:5177',
				'http://localhost:5178',
				'http://localhost:5179',
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
		allowedHeaders: ['Content-Type', 'Authorization'],
		maxAge: 86400, // Cache preflight for 24 hours
	})
);

// Rate limiting with optimization
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100,
	message: {
		success: false,
		message:
			'Too many requests from this IP, please try again later.',
	},
	standardHeaders: true,
	legacyHeaders: false,
	skip: (req) => {
		// Skip rate limiting for health checks
		return (
			req.path === '/health' ||
			req.path === '/api/health'
		);
	},
});
app.use(limiter);

// Body parsing middleware with size limits
app.use(express.json({ limit: '2mb' }));
app.use(
	express.urlencoded({ extended: true, limit: '2mb' })
);

// Health check endpoints with caching
app.get('/health', (req, res) => {
	res.set('Cache-Control', 'public, max-age=60'); // Cache for 1 minute
	res.json({
		success: true,
		message: 'Server is running',
		timestamp: new Date().toISOString(),
	});
});

app.get('/api/health', (req, res) => {
	res.set('Cache-Control', 'public, max-age=60'); // Cache for 1 minute
	res.json({
		success: true,
		message: 'API is running',
		timestamp: new Date().toISOString(),
		database: 'connected',
	});
});

// Note: Static file serving removed - now using Cloudinary for image storage

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

// 404 handler
app.use('*', (req, res) => {
	res.status(404).json({
		success: false,
		message: 'Route not found',
	});
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
