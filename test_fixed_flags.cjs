// Test script for fixed feature flag operations
const http = require('http');

const API_BASE = 'http://localhost:3001/api/admin';

function makeRequest(url, options = {}) {
	return new Promise((resolve, reject) => {
		const req = http.request(url, options, (res) => {
			let data = '';
			res.on('data', (chunk) => (data += chunk));
			res.on('end', () => {
				try {
					resolve({
						status: res.statusCode,
						data: JSON.parse(data),
					});
				} catch (error) {
					resolve({
						status: res.statusCode,
						data,
					});
				}
			});
		});

		req.on('error', reject);

		if (options.body) {
			req.write(options.body);
		}
		req.end();
	});
}

async function testFixedFeatureFlags() {
	console.log(
		'🛠️  Testing Fixed Feature Flag Operations...\n'
	);

	try {
		// Step 1: Login to get token
		console.log('1. Admin login...');
		const loginResponse = await makeRequest(
			`${API_BASE}/login`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: 'admin@neuronflow.ai',
					password: 'admin123!',
				}),
			}
		);

		if (!loginResponse.data.success) {
			console.log('❌ Login failed');
			return;
		}

		const token = loginResponse.data.data.accessToken;
		console.log('✅ Login successful');

		const authHeaders = {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		};

		// Step 2: Get current flags (should now have correct structure)
		console.log('\n2. Getting existing flags...');
		const getFlagsResponse = await makeRequest(
			`${API_BASE}/flags`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		console.log(
			'✅ Current flags:',
			getFlagsResponse.data.data.length
		);
		console.log(
			'Flag structure:',
			JSON.stringify(
				getFlagsResponse.data.data[0],
				null,
				2
			)
		);

		// Step 3: Test editing an existing flag
		const existingFlagId =
			getFlagsResponse.data.data[0].id;
		console.log(
			`\n3. Testing edit on existing flag: ${existingFlagId}`
		);

		const editResponse = await makeRequest(
			`${API_BASE}/flags/${existingFlagId}`,
			{
				method: 'PUT',
				headers: authHeaders,
				body: JSON.stringify({
					description:
						'Updated via test - ' +
						new Date().toLocaleTimeString(),
					rolloutPercentage: 80,
				}),
			}
		);

		console.log(
			'Edit response status:',
			editResponse.status
		);
		if (editResponse.data.success) {
			console.log('✅ Flag edited successfully');
		} else {
			console.log(
				'❌ Flag edit failed:',
				editResponse.data.message
			);
		}

		// Step 4: Test deleting the first flag (if safe to do so)
		// For safety, let's create a new one first to delete
		console.log(
			'\n4. Creating test flag for deletion...'
		);
		const createResponse = await makeRequest(
			`${API_BASE}/flags`,
			{
				method: 'POST',
				headers: authHeaders,
				body: JSON.stringify({
					name: 'test_delete_flag',
					description:
						'Flag created just for deletion test',
					category: 'experiment',
					environment: 'development',
				}),
			}
		);

		if (createResponse.data.success) {
			const newFlagId = createResponse.data.data.id;
			console.log(
				'✅ Test flag created with ID:',
				newFlagId
			);

			// Now delete it
			console.log('\n5. Deleting the test flag...');
			const deleteResponse = await makeRequest(
				`${API_BASE}/flags/${newFlagId}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log(
				'Delete response status:',
				deleteResponse.status
			);
			if (deleteResponse.data.success) {
				console.log('✅ Flag deleted successfully');
			} else {
				console.log(
					'❌ Flag delete failed:',
					deleteResponse.data.message
				);
			}
		} else {
			console.log(
				'❌ Test flag creation failed:',
				createResponse.data.message
			);
		}

		console.log(
			'\n🎉 Fixed feature flag test completed!'
		);
	} catch (error) {
		console.error('❌ Test failed:', error.message);
	}
}

testFixedFeatureFlags();
