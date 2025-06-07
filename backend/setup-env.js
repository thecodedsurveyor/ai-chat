const fs = require('fs');
const path = require('path');

const envContent = `# Backend Configuration
NODE_ENV=development
PORT=3001

# Database Configuration - Replace with your MongoDB connection string
# For local MongoDB:
DATABASE_URL=mongodb://localhost:27017/chatbot-dev

# For MongoDB Atlas (recommended):
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/chatbot?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=chatbot-super-secret-jwt-key-2024-development
JWT_REFRESH_SECRET=chatbot-refresh-secret-key-2024-development
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5176

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_SALT_ROUNDS=12

# Email Configuration (for future OTP features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
`;

const envPath = path.join(__dirname, '.env');

try {
	fs.writeFileSync(envPath, envContent);
	console.log('✅ .env file created successfully!');
	console.log('📍 Location:', envPath);
	console.log('\n🔧 Next steps:');
	console.log('1. Set up MongoDB (local or Atlas)');
	console.log('2. Update DATABASE_URL in .env file');
	console.log('3. Run: npm run dev');
	console.log(
		'\n📚 See BACKEND_SETUP_GUIDE.md for detailed instructions'
	);
} catch (error) {
	console.error(
		'❌ Error creating .env file:',
		error.message
	);
}
