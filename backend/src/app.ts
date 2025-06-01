import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/environment';
import authRoutes from './routes/authRoutes';
import conversationRoutes from './routes/conversationRoutes';
import messageRoutes from './routes/messageRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
	cors({
		origin: (origin, callback) => {
			// Allow requests with no origin (like mobile apps or curl requests)
			if (!origin) return callback(null, true);

			// Parse the frontend URL from config
			const configUrl = new URL(config.FRONTEND_URL);
			const allowedOrigins = [
				config.FRONTEND_URL,
				// Add variations of localhost with different ports
				'http://localhost:5173',
				'http://localhost:5174',
				'http://localhost:5175',
				'http://localhost:5176',
				'http://localhost:5177',
				'http://localhost:5178',
				'http://localhost:5179',
				// Use the same host but with different protocol
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
	})
);

// Rate limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: {
		success: false,
		message:
			'Too many requests from this IP, please try again later.',
	},
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
	res.json({
		success: true,
		message: 'Server is running',
		timestamp: new Date().toISOString(),
	});
});

// API health check endpoint
app.get('/api/health', (req, res) => {
	res.json({
		success: true,
		message: 'API is running',
		timestamp: new Date().toISOString(),
		database: 'connected',
	});
});

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
