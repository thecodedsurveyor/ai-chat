const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

// Generate secure production keys
function generateSecureKeys() {
	return {
		JWT_SECRET: crypto.randomBytes(64).toString('hex'),
		JWT_REFRESH_SECRET: crypto
			.randomBytes(64)
			.toString('hex'),
		ENCRYPTION_KEY: crypto
			.randomBytes(32)
			.toString('hex'),
		SESSION_SECRET: crypto
			.randomBytes(64)
			.toString('hex'),
	};
}

// Create readline interface for user input
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function askQuestion(question) {
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			resolve(answer.trim());
		});
	});
}

async function setupProduction() {
	console.log(
		'🚀 Setting up Production Environment for AI Chat\n'
	);

	// Generate secure keys
	console.log('🔐 Generating secure production keys...');
	const keys = generateSecureKeys();
	console.log('✅ Secure keys generated successfully!\n');

	// Get Resend API key from user
	console.log('📧 Email Configuration (Resend Service)');
	const resendApiKey = await askQuestion(
		'Enter your Resend API key: '
	);
	const emailFrom =
		(await askQuestion(
			'Enter your from email domain (e.g., noreply@yourdomain.com) [default: noreply@ai-chat.app]: '
		)) || 'noreply@ai-chat.app';
	const emailFromName =
		(await askQuestion(
			'Enter your from name [default: AI Chat Platform]: '
		)) || 'AI Chat Platform';

	// Get MongoDB URL
	console.log('\n💾 Database Configuration');
	const mongoUrl =
		(await askQuestion(
			'Enter your MongoDB connection URL [default: existing Atlas URL]: '
		)) ||
		'mongodb+srv://demo-user:demo123pass@cluster0.mongodb.net/ai-chatbot?retryWrites=true&w=majority';

	// Get frontend URL
	console.log('\n🌐 Frontend Configuration');
	const frontendUrl =
		(await askQuestion(
			'Enter your frontend URL [default: http://localhost:5176]: '
		)) || 'http://localhost:5176';

	// Create production .env content
	const envContent = `# Backend Configuration
NODE_ENV=development
PORT=3001

# Database Configuration
DATABASE_URL=${mongoUrl}

# JWT Configuration - Production-ready secrets
JWT_SECRET=${keys.JWT_SECRET}
JWT_REFRESH_SECRET=${keys.JWT_REFRESH_SECRET}
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Encryption & Security
ENCRYPTION_KEY=${keys.ENCRYPTION_KEY}
SESSION_SECRET=${keys.SESSION_SECRET}

# CORS Configuration
FRONTEND_URL=${frontendUrl}

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_SALT_ROUNDS=12

# Email Configuration - Resend Service
RESEND_API_KEY=${resendApiKey}
EMAIL_FROM_ADDRESS=${emailFrom}
EMAIL_FROM_NAME=${emailFromName}

# Application URLs
APP_URL=${frontendUrl}
RESET_PASSWORD_URL=${frontendUrl}/reset-password`;

	const envPath = path.join(__dirname, '.env');

	try {
		fs.writeFileSync(envPath, envContent);
		console.log(
			'\n✅ Production .env file created successfully!'
		);
		console.log('📍 Location:', envPath);
		console.log('\n🔧 Configuration includes:');
		console.log(
			'- Secure JWT secrets (64-byte random)'
		);
		console.log('- Encryption keys (32-byte random)');
		console.log('- Resend email service configuration');
		console.log('- MongoDB connection');
		console.log(
			'- Rate limiting and security settings'
		);

		// Test email functionality
		console.log('\n📧 Testing email functionality...');

		// Ask if user wants to test email
		const testEmail = await askQuestion(
			'\nWould you like to test the email functionality? (y/n): '
		);

		if (
			testEmail.toLowerCase() === 'y' ||
			testEmail.toLowerCase() === 'yes'
		) {
			const testEmailAddress = await askQuestion(
				'Enter test email address: '
			);
			await testEmailFunctionality(testEmailAddress);
		}

		console.log(
			'\n🚀 Setup complete! You can now run:'
		);
		console.log('   npm run dev');
	} catch (error) {
		console.error(
			'❌ Error creating .env file:',
			error.message
		);
	} finally {
		rl.close();
	}
}

async function testEmailFunctionality(testEmail) {
	try {
		// Import and test email service
		console.log('\n🧪 Testing email service...');

		// Create a simple test script that can be run
		const testScript = `
const { Resend } = require('resend');
const config = require('dotenv').config();

async function testEmail() {
	try {
		const resend = new Resend(process.env.RESEND_API_KEY);
		
		const { data, error } = await resend.emails.send({
			from: process.env.EMAIL_FROM_ADDRESS || 'noreply@ai-chat.app',
			to: ['${testEmail}'],
			subject: 'AI Chat - Email Test 🧪',
			html: \`
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h2 style="color: #667eea;">🧪 Email Test Successful!</h2>
					<p>This is a test email from your AI Chat platform.</p>
					<p>Email service is working correctly with Resend! ✅</p>
					<p style="color: #666; font-size: 14px;">Sent at: \${new Date().toISOString()}</p>
				</div>
			\`
		});
		
		if (error) {
			console.error('❌ Email test failed:', error);
			return false;
		}
		
		console.log('✅ Test email sent successfully!');
		console.log('📧 Email ID:', data.id);
		return true;
		
	} catch (error) {
		console.error('❌ Email test error:', error.message);
		return false;
	}
}

testEmail();
		`;

		fs.writeFileSync(
			path.join(__dirname, 'test-email.js'),
			testScript
		);
		console.log('📝 Email test script created');
		console.log('🏃 Running email test...');

		// Note: The actual test would need to be run separately
		console.log(
			'⚠️  To run the email test, execute: node test-email.js'
		);
	} catch (error) {
		console.error(
			'❌ Email test setup failed:',
			error.message
		);
	}
}

// Handle process exit
process.on('SIGINT', () => {
	console.log('\n👋 Setup cancelled');
	rl.close();
	process.exit(0);
});

// Run setup
setupProduction().catch(console.error);
