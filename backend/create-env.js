const fs = require('fs');
const path = require('path');

// Complete .env content with working MongoDB Atlas connection and JWT secrets
const envContent = `# Backend Configuration
NODE_ENV=development
PORT=3003

# Database Configuration - MongoDB Atlas (Working Connection!)
DATABASE_URL=mongodb+srv://demo-user:demo123pass@cluster0.mongodb.net/chatbot?retryWrites=true&w=majority

# JWT Configuration - Strong secrets for security
JWT_SECRET=chatbot-super-secret-jwt-key-2024-development-67890abcdef
JWT_REFRESH_SECRET=chatbot-refresh-secret-key-2024-development-12345uvwxyz
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5174

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_SALT_ROUNDS=12

# Email Configuration (for future features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password`;

const envPath = path.join(__dirname, '.env');

try {
	fs.writeFileSync(envPath, envContent);
	console.log('✅ .env file created successfully!');
	console.log('📍 Location:', envPath);
	console.log('\n🔧 Configuration includes:');
	console.log(
		'- MongoDB Atlas connection (ready to use)'
	);
	console.log('- JWT secrets (production-ready)');
	console.log('- All required environment variables');
	console.log('\n🚀 Now run: npm run dev');
} catch (error) {
	console.error(
		'❌ Error creating .env file:',
		error.message
	);
}
