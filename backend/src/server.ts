import app from './app';
import config from './config/environment';

const PORT = config.PORT || 3003;

const server = app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
	console.log(`📊 Environment: ${config.NODE_ENV}`);
	console.log(`🌐 Frontend URL: ${config.FRONTEND_URL}`);
	console.log(`💾 Database: Connected to MongoDB`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
	console.log(
		'SIGTERM received. Shutting down gracefully...'
	);
	server.close(() => {
		console.log('Process terminated');
		process.exit(0);
	});
});

process.on('SIGINT', () => {
	console.log(
		'SIGINT received. Shutting down gracefully...'
	);
	server.close(() => {
		console.log('Process terminated');
		process.exit(0);
	});
});

export default server;
