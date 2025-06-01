const crypto = require('crypto');

console.log(
	'🚀 AI Chat Platform - Production Keys Generator\n'
);

// Generate secure production keys
const keys = {
	JWT_SECRET: crypto.randomBytes(64).toString('hex'),
	JWT_REFRESH_SECRET: crypto
		.randomBytes(64)
		.toString('hex'),
	ENCRYPTION_KEY: crypto.randomBytes(32).toString('hex'),
	SESSION_SECRET: crypto.randomBytes(64).toString('hex'),
};

console.log('🔐 Generated Production Keys:');
console.log('================================\n');

console.log('Copy the following keys to your .env file:\n');

const envTemplate = `# Backend Configuration
NODE_ENV=development
PORT=3001

# Database Configuration
DATABASE_URL=mongodb+srv://demo-user:demo123pass@cluster0.mongodb.net/ai-chatbot?retryWrites=true&w=majority

# JWT Configuration - Production-ready secrets
JWT_SECRET=${keys.JWT_SECRET}
JWT_REFRESH_SECRET=${keys.JWT_REFRESH_SECRET}
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Encryption & Security
ENCRYPTION_KEY=${keys.ENCRYPTION_KEY}
SESSION_SECRET=${keys.SESSION_SECRET}

# CORS Configuration
FRONTEND_URL=http://localhost:5176

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_SALT_ROUNDS=12

# Email Configuration - Resend Service
RESEND_API_KEY=YOUR_RESEND_API_KEY_HERE
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
EMAIL_FROM_NAME=AI Chat Platform

# Application URLs
APP_URL=http://localhost:5176
RESET_PASSWORD_URL=http://localhost:5176/reset-password`;

console.log(envTemplate);

console.log('\n\n📧 Resend Email Setup Instructions:');
console.log('===================================');
console.log('1. Go to https://resend.com');
console.log('2. Sign up/login to your account');
console.log('3. Create a new API key');
console.log(
	'4. Replace YOUR_RESEND_API_KEY_HERE with your actual API key'
);
console.log(
	'5. Update EMAIL_FROM_ADDRESS with your verified domain'
);
console.log();

console.log('🧪 To test email functionality:');
console.log(
	'node test-resend-email.js your-email@example.com'
);
console.log();

console.log('✅ Security Features:');
console.log('- JWT secrets: 128 characters (64 bytes)');
console.log('- Encryption key: 64 characters (32 bytes)');
console.log('- Session secret: 128 characters (64 bytes)');
console.log(
	'- All keys generated with crypto.randomBytes()'
);
console.log();

console.log('🚀 Ready for production deployment!');
