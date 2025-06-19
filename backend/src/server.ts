import app from './app';
import config from './config/environment';

const PORT = config.PORT || 3003;

const server = app.listen(PORT, () => {
	// Server started successfully
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
