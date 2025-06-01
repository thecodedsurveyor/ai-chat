const { Resend } = require('resend');
require('dotenv').config();

async function simpleEmailTest() {
	console.log('🔍 Simple Resend Email Debug Test\n');

	const resend = new Resend(process.env.RESEND_API_KEY);

	console.log('📋 Configuration:');
	console.log(
		`API Key: ${process.env.RESEND_API_KEY?.substring(0, 10)}...`
	);
	console.log(`From: ${process.env.EMAIL_FROM_ADDRESS}`);
	console.log(
		`From Name: ${process.env.EMAIL_FROM_NAME}`
	);

	// Try with the actual Resend testing email
	const testEmail = 'delivered@resend.dev'; // This is Resend's test email

	try {
		console.log(
			`\n🧪 Testing with Resend test email: ${testEmail}`
		);

		const { data, error } = await resend.emails.send({
			from: 'Acme <onboarding@resend.dev>', // Use verified Resend domain
			to: [testEmail],
			subject: 'Hello World!',
			html: '<h1>Hello from AI Chat!</h1><p>This is a test email.</p>',
		});

		if (error) {
			console.error('❌ Error:', error);

			// Try alternative configuration
			console.log(
				'\n🔄 Trying alternative configuration...'
			);

			const { data: data2, error: error2 } =
				await resend.emails.send({
					from: 'noreply@resend.dev',
					to: [testEmail],
					subject: 'Hello World Alternative!',
					text: 'This is a simple text email test.',
				});

			if (error2) {
				console.error(
					'❌ Alternative also failed:',
					error2
				);
			} else {
				console.log(
					'✅ Alternative worked!',
					data2
				);
			}
		} else {
			console.log('✅ Success!', data);
		}
	} catch (err) {
		console.error('❌ Exception:', err.message);
	}
}

simpleEmailTest();
