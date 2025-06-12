// Simple test to verify Cloudinary configuration
require('dotenv').config({ path: './backend/.env' });

console.log('🧪 Testing Cloudinary Configuration...\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log(
	`   CLOUDINARY_CLOUD_NAME: ${
		process.env.CLOUDINARY_CLOUD_NAME
			? '✅ Set'
			: '❌ Missing'
	}`
);
console.log(
	`   CLOUDINARY_API_KEY: ${
		process.env.CLOUDINARY_API_KEY
			? '✅ Set'
			: '❌ Missing'
	}`
);
console.log(
	`   CLOUDINARY_API_SECRET: ${
		process.env.CLOUDINARY_API_SECRET
			? '✅ Set'
			: '❌ Missing'
	}\n`
);

if (
	!process.env.CLOUDINARY_CLOUD_NAME ||
	!process.env.CLOUDINARY_API_KEY ||
	!process.env.CLOUDINARY_API_SECRET
) {
	console.log(
		'❌ Missing Cloudinary credentials. Please check your backend/.env file.'
	);
	process.exit(1);
}

// Test Cloudinary connection
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

async function testCloudinaryConnection() {
	try {
		console.log(
			'🔗 Testing Cloudinary API connection...'
		);

		// Test connection by getting account details
		const result = await cloudinary.api.ping();

		if (result.status === 'ok') {
			console.log(
				'✅ Cloudinary connection successful!'
			);
			console.log(
				`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`
			);
			console.log(
				'   Status: Connected to Cloudinary API\n'
			);

			// Test upload capabilities
			console.log(
				'📤 Testing upload capabilities...'
			);

			// Create a simple 1x1 pixel image buffer
			const testImageBuffer = Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
				'base64'
			);

			const uploadResult = await new Promise(
				(resolve, reject) => {
					cloudinary.uploader
						.upload_stream(
							{
								folder: 'neuronflow/profiles',
								public_id: `test-${Date.now()}`,
								transformation: [
									{
										width: 300,
										height: 300,
										crop: 'fill',
										format: 'webp',
										quality:
											'auto:good',
									},
								],
							},
							(error, result) => {
								if (error) reject(error);
								else resolve(result);
							}
						)
						.end(testImageBuffer);
				}
			);

			console.log('✅ Test upload successful!');
			console.log(
				`   Image URL: ${uploadResult.secure_url}`
			);
			console.log(
				`   Public ID: ${uploadResult.public_id}`
			);
			console.log(
				`   Format: ${uploadResult.format}`
			);
			console.log(
				`   Size: ${uploadResult.width}x${uploadResult.height}\n`
			);

			// Clean up test image
			console.log('🧹 Cleaning up test image...');
			await cloudinary.uploader.destroy(
				uploadResult.public_id
			);
			console.log('✅ Test image deleted');
		} else {
			console.log('❌ Cloudinary connection failed');
		}
	} catch (error) {
		console.error(
			'❌ Cloudinary test failed:',
			error.message
		);

		if (error.http_code === 401) {
			console.log(
				'   This usually means your API credentials are incorrect.'
			);
		} else if (error.http_code === 403) {
			console.log(
				"   This usually means your account doesn't have permission for this operation."
			);
		}
	}
}

testCloudinaryConnection();
