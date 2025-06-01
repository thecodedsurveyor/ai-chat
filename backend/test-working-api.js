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
	console.log('🧪 AI Chat Backend - API Testing\n');
	console.log('🌐 Base URL:', BASE_URL);
	console.log('📧 Test Email:', TEST_EMAIL);
	console.log('━'.repeat(60));

	try {
		// Test 1: Base endpoint
		console.log('\n📊 Testing Base Routes...');
		try {
			const baseResponse = await axios.get(
				`${BASE_URL}/`
			);
			logTest(
				'Base endpoint',
				baseResponse.status === 200,
				'Server responding'
			);
		} catch (error) {
			if (error.response?.status === 404) {
				logTest(
					'Base endpoint',
					true,
					'No base route (expected)'
				);
			} else {
				logTest(
					'Base endpoint',
					false,
					error.message
				);
			}
		}

		// Test 2: Registration
		console.log('\n👤 Testing Registration...');
		try {
			const registerData = {
				firstName: 'Test',
				lastName: 'User',
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

		// Test 5: Request Password Reset (correct endpoint)
		console.log(
			'\n📧 Testing Password Reset Request...'
		);
		try {
			const forgotPasswordData = {
				email: TEST_EMAIL,
			};
			const forgotResponse = await axios.post(
				`${BASE_URL}/api/auth/request-password-reset`,
				forgotPasswordData
			);
			logTest(
				'Password reset request',
				forgotResponse.status === 200,
				'Reset email sent'
			);
		} catch (error) {
			logTest(
				'Password reset request',
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

		// Test 7: Logout
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
	} else {
		console.log(
			'\n⚠️  Some tests failed. Check the details above.'
		);
	}

	return testResults;
}

console.log('🚀 Testing AI Chat API...');
testAPI()
	.then(() => {
		console.log('\n🔔 Testing complete!');
	})
	.catch(console.error);
