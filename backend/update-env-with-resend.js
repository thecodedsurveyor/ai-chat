const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

async function updateEnvWithResend() {
	console.log('🔧 Manual Resend Configuration Setup\n');

	const envPath = path.join(__dirname, '.env');

	// Check if .env exists
	if (!fs.existsSync(envPath)) {
		console.log(
			'❌ .env file not found. Please run create-env.js first.'
		);
		process.exit(1);
	}

	// Read current .env content
	let envContent = fs.readFileSync(envPath, 'utf8');

	console.log('📧 Enter your Resend configuration:');

	const resendApiKey = await askQuestion(
		'Resend API Key: '
	);
	const emailFrom =
		(await askQuestion(
			'From Email (default: noreply@ai-chat.app): '
		)) || 'noreply@ai-chat.app';
	const emailFromName =
		(await askQuestion(
			'From Name (default: AI Chat Platform): '
		)) || 'AI Chat Platform';

	// Update or add Resend configuration
	const resendConfig = `
# Email Configuration - Resend Service
RESEND_API_KEY=${resendApiKey}
EMAIL_FROM_ADDRESS=${emailFrom}
EMAIL_FROM_NAME=${emailFromName}`;

	// Check if Resend config already exists
	if (envContent.includes('RESEND_API_KEY')) {
		// Replace existing configuration
		envContent = envContent.replace(
			/# Email Configuration.*\nRESEND_API_KEY=.*\nEMAIL_FROM_ADDRESS=.*\nEMAIL_FROM_NAME=.*/s,
			resendConfig.trim()
		);
	} else {
		// Add new configuration
		envContent += '\n' + resendConfig;
	}

	// Write updated content
	fs.writeFileSync(envPath, envContent);

	console.log(
		'\n✅ .env file updated with Resend configuration!'
	);
	console.log('📍 Location:', envPath);

	// Ask if user wants to test email
	const testEmail = await askQuestion(
		'\nWould you like to test email functionality? (y/n): '
	);

	if (
		testEmail.toLowerCase() === 'y' ||
		testEmail.toLowerCase() === 'yes'
	) {
		const testEmailAddress = await askQuestion(
			'Enter test email address: '
		);
		console.log(
			'\n🧪 To test email functionality, run:'
		);
		console.log(
			`node test-resend-email.js ${testEmailAddress}`
		);
	}

	rl.close();
}

function askQuestion(question) {
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			resolve(answer.trim());
		});
	});
}

updateEnvWithResend().catch(console.error);
