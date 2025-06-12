const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Test Cloudinary upload functionality
async function testCloudinaryUpload() {
	try {
		console.log(
			'🧪 Testing Cloudinary Upload Functionality...\n'
		);

		// Create a simple test image (1x1 pixel PNG)
		const testImageBuffer = Buffer.from(
			'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
			'base64'
		);

		// Save as temporary file
		const testImagePath = path.join(
			__dirname,
			'test-image.png'
		);
		fs.writeFileSync(testImagePath, testImageBuffer);

		console.log('✅ Test image created');

		// Test authentication endpoint first
		console.log('🔐 Testing authentication...');

		const authResponse = await fetch(
			'http://localhost:3001/api/auth/login',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: 'test@example.com', // You may need to adjust this
					password: 'testpassword123',
				}),
			}
		);

		if (!authResponse.ok) {
			console.log(
				'⚠️  Authentication failed - you may need to register a test user first'
			);
			console.log(
				'   Or update the test credentials in test-cloudinary.js'
			);
			return;
		}

		const authData = await authResponse.json();
		const token = authData.data.accessToken;
		console.log('✅ Authentication successful');

		// Test Cloudinary upload
		console.log('📤 Testing Cloudinary upload...');

		const form = new FormData();
		form.append(
			'profilePicture',
			fs.createReadStream(testImagePath)
		);

		const uploadResponse = await fetch(
			'http://localhost:3001/api/auth/upload-profile-picture',
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					...form.getHeaders(),
				},
				body: form,
			}
		);

		const uploadResult = await uploadResponse.json();

		if (uploadResponse.ok) {
			console.log('✅ Cloudinary upload successful!');
			console.log('📋 Upload Details:');
			console.log(
				`   - Status: ${uploadResponse.status}`
			);
			console.log(
				`   - Cloudinary URL: ${uploadResult.data.cloudinaryUrl}`
			);
			console.log(
				`   - Public ID: ${uploadResult.data.publicId}`
			);
			console.log(
				`   - User Avatar: ${uploadResult.data.user.avatar}`
			);
		} else {
			console.log('❌ Cloudinary upload failed');
			console.log('📋 Error Details:', uploadResult);
		}

		// Clean up
		fs.unlinkSync(testImagePath);
		console.log('🧹 Cleaned up test files');
	} catch (error) {
		console.error('❌ Test failed:', error.message);
	}
}

// Run the test
testCloudinaryUpload();
