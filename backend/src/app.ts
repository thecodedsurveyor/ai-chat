import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/environment';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
	cors({
		origin: config.FRONTEND_URL,
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

// API routes
app.use('/api/auth', authRoutes);

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
