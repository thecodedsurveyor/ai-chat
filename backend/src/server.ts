import app from './app';
import config from './config/environment';
import rateLimitService from './services/rateLimitService';

const PORT = config.PORT || 3003;

const server = app.listen(PORT, () => {
	// Server started on port ${PORT}
});

// Graceful shutdown
const gracefulShutdown = async () => {
	// Close Redis connection
	await rateLimitService.disconnect();

	// Close HTTP server
	server.close(() => {
		process.exit(0);
	});
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default server;
