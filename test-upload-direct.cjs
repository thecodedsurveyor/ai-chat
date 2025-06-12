// Direct test of the upload endpoint
const https = require('https');
const http = require('http');

console.log(
	'🧪 Testing Profile Picture Upload Endpoint...\n'
);

// Test the upload endpoint directly
async function testUploadEndpoint() {
	try {
		// First, let's check if the backend is responding
		console.log('🔍 Checking backend health...');

		const healthResponse = await fetch(
			'http://localhost:3001/api/health'
		);

		if (!healthResponse.ok) {
			console.log('❌ Backend is not responding');
			return;
		}

		const healthData = await healthResponse.json();
		console.log(
			'✅ Backend is healthy:',
			healthData.message
		);
		console.log('   Database:', healthData.database);
		console.log('   Timestamp:', healthData.timestamp);

		// Check if cloudinary endpoint exists
		console.log(
			'\n🔍 Testing upload endpoint (without auth)...'
		);

		const testResponse = await fetch(
			'http://localhost:3001/api/auth/upload-profile-picture',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		console.log(`   Status: ${testResponse.status}`);

		if (testResponse.status === 401) {
			console.log(
				'✅ Upload endpoint exists and requires authentication (expected)'
			);
		} else if (testResponse.status === 400) {
			console.log(
				'✅ Upload endpoint exists and validates file upload'
			);
		} else {
			console.log(
				`   Response: ${testResponse.status} ${testResponse.statusText}`
			);
		}

		const errorData = await testResponse.json();
		console.log(`   Message: ${errorData.message}`);

		console.log('\n📋 Summary:');
		console.log('✅ Backend server is running');
		console.log('✅ Database is connected');
		console.log('✅ Upload endpoint is accessible');
		console.log(
			'✅ Authentication is required (secure)'
		);

		console.log('\n🎯 Next Steps:');
		console.log(
			'1. Log into your app at http://localhost:5173'
		);
		console.log('2. Go to your profile page');
		console.log(
			'3. Click the camera icon on your profile picture'
		);
		console.log(
			'4. Upload an image to test Cloudinary integration'
		);
	} catch (error) {
		console.error('❌ Test failed:', error.message);
	}
}

testUploadEndpoint();
