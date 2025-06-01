const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:3001';
const TEST_EMAIL = 'delivered@resend.dev';
const TEST_PASSWORD = 'TestPassword123!';

let testResults = {
	passed: 0,
	failed: 0,
	tests: [],
};

function logTest(name, passed, details = '') {
	const status = passed ? '✅' : '❌';
	const result = { name, passed, details };
	testResults.tests.push(result);
	testResults[passed ? 'passed' : 'failed']++;
	console.log(
		`${status} ${name}${details ? ': ' + details : ''}`
	);
}

async function testAPI() {
	console.log(
		'🧪 AI Chat Backend - Comprehensive API Testing\n'
	);
	console.log('🌐 Base URL:', BASE_URL);
	console.log('📧 Test Email:', TEST_EMAIL);
	console.log('━'.repeat(60));

	try {
		// Test 1: Health Check
		console.log(
			'\n📊 Testing Health & Status Routes...'
		);
		try {
			const healthResponse = await axios.get(
				`${BASE_URL}/api/health`
			);
			logTest(
				'Health endpoint',
				healthResponse.status === 200,
				healthResponse.data?.message
			);
		} catch (error) {
			logTest(
				'Health endpoint',
				false,
				error.message
			);
		}

		// Test 2: Registration
		console.log('\n👤 Testing Registration...');
		try {
			const registerData = {
				name: 'Test User',
				email: TEST_EMAIL,
				password: TEST_PASSWORD,
			};

			const registerResponse = await axios.post(
				`${BASE_URL}/api/auth/register`,
				registerData
			);
			logTest(
				'User registration',
				registerResponse.status === 201,
				'User created successfully'
			);
		} catch (error) {
			if (
				error.response?.status === 400 &&
				error.response?.data?.message?.includes(
					'already exists'
				)
			) {
				logTest(
					'User registration',
					true,
					'User already exists (expected)'
				);
			} else {
				logTest(
					'User registration',
					false,
					error.response?.data?.message ||
						error.message
				);
			}
		}

		// Test 3: Login
		console.log('\n🔐 Testing Login...');
		let authToken = null;
		try {
			const loginData = {
				email: TEST_EMAIL,
				password: TEST_PASSWORD,
			};

			const loginResponse = await axios.post(
				`${BASE_URL}/api/auth/login`,
				loginData
			);
			authToken =
				loginResponse.data?.data?.accessToken;
			logTest(
				'User login',
				loginResponse.status === 200 && authToken,
				'Token received'
			);
		} catch (error) {
			logTest(
				'User login',
				false,
				error.response?.data?.message ||
					error.message
			);
		}

		// Test 4: Protected Route (Profile)
		if (authToken) {
			console.log('\n👤 Testing Protected Routes...');
			try {
				const profileResponse = await axios.get(
					`${BASE_URL}/api/auth/profile`,
					{
						headers: {
							Authorization: `Bearer ${authToken}`,
						},
					}
				);
				logTest(
					'Protected profile route',
					profileResponse.status === 200,
					'Profile data retrieved'
				);
			} catch (error) {
				logTest(
					'Protected profile route',
					false,
					error.response?.data?.message ||
						error.message
				);
			}
		}

		// Test 5: Forgot Password
		console.log('\n📧 Testing Forgot Password...');
		try {
			const forgotPasswordData = {
				email: TEST_EMAIL,
			};
			const forgotResponse = await axios.post(
				`${BASE_URL}/api/auth/forgot-password`,
				forgotPasswordData
			);
			logTest(
				'Forgot password request',
				forgotResponse.status === 200,
				'Reset email sent'
			);
		} catch (error) {
			logTest(
				'Forgot password request',
				false,
				error.response?.data?.message ||
					error.message
			);
		}

		// Test 6: Invalid Login
		console.log('\n🚫 Testing Invalid Requests...');
		try {
			const invalidLogin = {
				email: TEST_EMAIL,
				password: 'wrongpassword',
			};
			await axios.post(
				`${BASE_URL}/api/auth/login`,
				invalidLogin
			);
			logTest(
				'Invalid password rejection',
				false,
				'Should have failed'
			);
		} catch (error) {
			logTest(
				'Invalid password rejection',
				error.response?.status === 401,
				'Correctly rejected'
			);
		}

		// Test 7: Refresh Token
		if (authToken) {
			console.log('\n🔄 Testing Token Refresh...');
			try {
				const refreshResponse = await axios.post(
					`${BASE_URL}/api/auth/refresh`,
					{},
					{
						headers: {
							Authorization: `Bearer ${authToken}`,
						},
					}
				);
				logTest(
					'Token refresh',
					refreshResponse.status === 200,
					'New token generated'
				);
			} catch (error) {
				logTest(
					'Token refresh',
					false,
					error.response?.data?.message ||
						error.message
				);
			}
		}

		// Test 8: Logout
		if (authToken) {
			console.log('\n🚪 Testing Logout...');
			try {
				const logoutResponse = await axios.post(
					`${BASE_URL}/api/auth/logout`,
					{},
					{
						headers: {
							Authorization: `Bearer ${authToken}`,
						},
					}
				);
				logTest(
					'User logout',
					logoutResponse.status === 200,
					'Successfully logged out'
				);
			} catch (error) {
				logTest(
					'User logout',
					false,
					error.response?.data?.message ||
						error.message
				);
			}
		}
	} catch (error) {
		console.error(
			'❌ Critical testing error:',
			error.message
		);
	}

	// Final Results
	console.log('\n' + '━'.repeat(60));
	console.log('📊 TEST RESULTS SUMMARY');
	console.log('━'.repeat(60));
	console.log(`✅ Passed: ${testResults.passed}`);
	console.log(`❌ Failed: ${testResults.failed}`);
	console.log(
		`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`
	);

	if (testResults.failed === 0) {
		console.log(
			'\n🎉 ALL TESTS PASSED! Backend is fully functional!'
		);
		console.log('🚀 Ready for production deployment!');
	} else {
		console.log(
			'\n⚠️  Some tests failed. Check the details above.'
		);
	}

	console.log('\n📋 Detailed Test Results:');
	testResults.tests.forEach((test, index) => {
		const status = test.passed ? '✅' : '❌';
		console.log(
			`${index + 1}. ${status} ${test.name}${test.details ? ' - ' + test.details : ''}`
		);
	});

	return testResults;
}

// Auto-retry mechanism for server startup
async function waitForServer(
	maxRetries = 10,
	delay = 2000
) {
	for (let i = 0; i < maxRetries; i++) {
		try {
			await axios.get(`${BASE_URL}/api/health`);
			console.log('✅ Backend server is ready!');
			return true;
		} catch (error) {
			console.log(
				`⏳ Waiting for server... (${i + 1}/${maxRetries})`
			);
			await new Promise((resolve) =>
				setTimeout(resolve, delay)
			);
		}
	}
	console.log(
		'❌ Server not responding after maximum retries'
	);
	return false;
}

async function main() {
	console.log(
		'🔄 Checking if backend server is running...'
	);
	const serverReady = await waitForServer();

	if (serverReady) {
		await testAPI();
	} else {
		console.log(
			'❌ Cannot test API - server is not running'
		);
		console.log(
			'💡 Please run: cd backend && npm run dev'
		);
	}
}

// Add axios dependency check
try {
	require('axios');
} catch (error) {
	console.log('📦 Installing axios for testing...');
	require('child_process').execSync('npm install axios', {
		stdio: 'inherit',
	});
}

main().catch(console.error);
