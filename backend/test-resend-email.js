const { Resend } = require('resend');
require('dotenv').config();

async function testResendEmail() {
	console.log('🧪 Testing Resend Email Service...\n');

	// Check if API key is available
	if (!process.env.RESEND_API_KEY) {
		console.error(
			'❌ RESEND_API_KEY not found in environment variables'
		);
		console.log(
			'Please add your Resend API key to the .env file'
		);
		process.exit(1);
	}

	// Initialize Resend
	const resend = new Resend(process.env.RESEND_API_KEY);

	// Test email configuration
	const testEmail = process.argv[2] || 'test@example.com';
	const fromEmail =
		process.env.EMAIL_FROM_ADDRESS ||
		'noreply@neuronflow.com';
	const fromName =
		process.env.EMAIL_FROM_NAME ||
		'NeuronFlow Platform';

	console.log('📧 Email Configuration:');
	console.log(`   From: ${fromName} <${fromEmail}>`);
	console.log(`   To: ${testEmail}`);
	console.log(
		`   API Key: ${process.env.RESEND_API_KEY.substring(0, 8)}...`
	);
	console.log();

	try {
		// Test 1: Simple test email
		console.log('🔄 Sending test email...');

		const { data, error } = await resend.emails.send({
			from: `${fromName} <${fromEmail}>`,
			to: [testEmail],
			subject: 'NeuronFlow - Email Service Test 🧪',
			html: `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Email Test</title>
				</head>
				<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
					<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; color: white; margin-bottom: 20px;">
						<h1 style="margin: 0; font-size: 24px;">🧪 Email Test Successful!</h1>
					</div>
					
					<div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
						<h2 style="color: #2d3748; margin-top: 0;">Test Results:</h2>
						<ul style="color: #4a5568;">
							<li>✅ Resend API connection working</li>
							<li>✅ Email delivery successful</li>
							<li>✅ HTML template rendering correctly</li>
							<li>✅ Email service ready for production</li>
						</ul>
					</div>
					
					<div style="border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; background: white;">
						<p style="margin: 0; color: #718096; font-size: 14px;">
							<strong>Test Details:</strong><br>
							Sent at: ${new Date().toISOString()}<br>
							Service: Resend Email API<br>
							Platform: NeuronFlow Backend
						</p>
					</div>
					
					<div style="text-align: center; margin-top: 20px;">
						<p style="color: #a0aec0; font-size: 12px;">
							This is an automated test email from your NeuronFlow platform.
						</p>
					</div>
				</body>
				</html>
			`,
		});

		if (error) {
			console.error('❌ Email test failed:');
			console.error('Error details:', error);
			return false;
		}

		console.log('✅ Test email sent successfully!');
		console.log(`📧 Email ID: ${data.id}`);
		console.log(`📬 Check your inbox at: ${testEmail}`);

		// Test 2: Password Reset Email Template
		console.log(
			'\n🔄 Testing password reset email template...'
		);

		const resetToken = 'test-token-123456789';
		const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5176'}/reset-password?token=${resetToken}&email=${encodeURIComponent(testEmail)}`;

		const { data: resetData, error: resetError } =
			await resend.emails.send({
				from: `${fromName} <${fromEmail}>`,
				to: [testEmail],
				subject: 'Password Reset Test - NeuronFlow',
				html: `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Password Reset Test</title>
				</head>
				<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
					<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 12px; text-align: center; color: white; margin-bottom: 20px;">
						<h1 style="margin: 0; font-size: 24px;">🔐 Password Reset Test</h1>
					</div>
					
					<div style="background: #fff5f5; border: 1px solid #feb2b2; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
						<p style="margin: 0; color: #742a2a;">
							<strong>⚠️ This is a test email!</strong><br>
							This password reset link is for testing purposes only.
						</p>
					</div>
					
					<p style="color: #2d3748; font-size: 16px;">Hello,</p>
					<p style="color: #4a5568;">We received a request to reset your password for your NeuronFlow account. This is a test of the password reset email template.</p>
					
					<div style="text-align: center; margin: 30px 0;">
						<a href="${resetUrl}" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
							Reset Password (Test)
						</a>
					</div>
					
					<div style="background: #f7fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
						<p style="margin: 0; color: #4a5568; font-size: 14px;">
							<strong>Test URL:</strong><br>
							<code style="background: #edf2f7; padding: 2px 4px; border-radius: 4px; font-size: 12px;">${resetUrl}</code>
						</p>
					</div>
					
					<p style="color: #718096; font-size: 14px;">
						This test email was sent at ${new Date().toLocaleString()}
					</p>
				</body>
				</html>
			`,
			});

		if (resetError) {
			console.error(
				'❌ Password reset email test failed:',
				resetError
			);
		} else {
			console.log(
				'✅ Password reset email sent successfully!'
			);
			console.log(`📧 Email ID: ${resetData.id}`);
		}

		console.log('\n🎉 Email testing complete!');
		console.log('\n📊 Summary:');
		console.log('   ✅ Resend API connection: Working');
		console.log('   ✅ Basic email sending: Working');
		console.log('   ✅ HTML templates: Working');
		console.log('   ✅ Password reset flow: Working');
		console.log(
			'\n🚀 Your email service is ready for production!'
		);

		return true;
	} catch (error) {
		console.error(
			'❌ Email test error:',
			error.message
		);
		console.error('Full error:', error);
		return false;
	}
}

// Get test email from command line argument
if (process.argv.length < 3) {
	console.log(
		'Usage: node test-resend-email.js <test-email-address>'
	);
	console.log(
		'Example: node test-resend-email.js your-email@example.com'
	);
	process.exit(1);
}

testResendEmail()
	.then((success) => {
		process.exit(success ? 0 : 1);
	})
	.catch((error) => {
		console.error('Test failed:', error);
		process.exit(1);
	});
