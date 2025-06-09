#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const ENV_TEMPLATE = `# Frontend API Keys Configuration
# =============================================================================
# AI/ML SERVICES (REQUIRED)
# =============================================================================

# OpenRouter API Key (REQUIRED for AI chat functionality)
# Get your API key from: https://openrouter.ai/keys
# Replace "your_actual_api_key_here" with your real API key
VITE_OPENROUTER_API_KEY=your_actual_api_key_here

# =============================================================================
# OPTIONAL CONFIGURATION
# =============================================================================

# AssemblyAI API Key (OPTIONAL - for advanced speech recognition)
# Get your API key from: https://www.assemblyai.com/
VITE_ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here

# Backend API Base URL (OPTIONAL - defaults to http://localhost:3001/api)
# Only set this if your backend is hosted elsewhere
VITE_API_BASE_URL=http://localhost:3001/api

# =============================================================================
# INSTRUCTIONS
# =============================================================================

# 1. Replace "your_actual_api_key_here" with your actual OpenRouter API key
# 2. The OpenRouter API key is REQUIRED for the AI chat to work
# 3. Other keys are optional and can be left with placeholder values
# 4. Never commit your .env file to git (it's already in .gitignore)
# 5. Restart your development server after making changes to this file

# =============================================================================
# PRIORITY LEVELS
# =============================================================================

# 🔴 CRITICAL (App won't work without this):
#    - VITE_OPENROUTER_API_KEY

# 🟡 OPTIONAL (App works but with limited features):
#    - VITE_ASSEMBLYAI_API_KEY
#    - VITE_API_BASE_URL
`;

function setupEnvironment() {
	const envPath = path.join(process.cwd(), '.env');

	console.log('🔧 AI Chatbot Environment Setup');
	console.log('================================');

	// Check if .env already exists
	if (fs.existsSync(envPath)) {
		console.log('⚠️  .env file already exists!');
		console.log('   Location:', envPath);
		console.log(
			'   Please check if VITE_OPENROUTER_API_KEY is properly configured.'
		);
		console.log(
			'   If you need to recreate it, delete the existing file first.'
		);
		return;
	}

	try {
		// Create .env file
		fs.writeFileSync(envPath, ENV_TEMPLATE);
		console.log('✅ Created .env file successfully!');
		console.log('   Location:', envPath);
		console.log('');
		console.log('🔑 Next steps:');
		console.log(
			'   1. Go to https://openrouter.ai/keys'
		);
		console.log(
			'   2. Create an account and get your API key'
		);
		console.log(
			'   3. Open the .env file and replace "your_actual_api_key_here"'
		);
		console.log(
			'   4. Restart your development server (npm run dev)'
		);
		console.log('');
		console.log(
			'📖 Need detailed help? Check ENV_SETUP.md for full instructions.'
		);
	} catch (error) {
		console.error(
			'❌ Error creating .env file:',
			error.message
		);
		console.log('');
		console.log('💡 Manual setup:');
		console.log(
			'   1. Create a file named ".env" in your project root'
		);
		console.log(
			'   2. Copy the template from ENV_SETUP.md'
		);
		console.log('   3. Add your OpenRouter API key');
	}
}

// Run the setup
setupEnvironment();
