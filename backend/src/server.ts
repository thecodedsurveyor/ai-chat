import app from './app';
import config from './config/environment';
import rateLimitService from './services/rateLimitService';

const PORT = config.PORT || 3003;

const server = app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
	console.log(
		`📊 Rate limiting: ${rateLimitService.getStatus().client}`
	);
});

// Graceful shutdown
const gracefulShutdown = async () => {
	console.log('Shutting down gracefully...');

	// Close Redis connection
	await rateLimitService.disconnect();

	// Close HTTP server
	server.close(() => {
		console.log('✅ Server shut down complete');
		process.exit(0);
	});
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default server;
