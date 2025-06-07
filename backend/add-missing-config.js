const fs = require('fs');

console.log(
	'🔧 Adding missing configuration to .env file...\n'
);

// Read current .env content
let envContent = fs.readFileSync('.env', 'utf8');

// Configuration to add based on the user's setup session
const missingConfig = `
# =============================================================================
# 📧 RESEND EMAIL SERVICE CONFIGURATION
# =============================================================================
RESEND_API_KEY=re_Nchb39NP_873pRmQXaMSDiYqLHrvyv5UC
EMAIL_FROM_ADDRESS=onboarding@resend.dev
EMAIL_FROM_NAME=Ai Chat

# =============================================================================
# 🗄️ DATABASE CONFIGURATION
# =============================================================================
DATABASE_URL=mongodb+srv://codedsurveyor:5563622222@cluster0.iunbydq.mongodb.net/chatbot?retryWrites=true&w=majority

# =============================================================================
# 🔐 ADDITIONAL SECURITY KEYS
# =============================================================================
ENCRYPTION_KEY=051819469d1fb8a7348cfd388767f4f7847e728503f15ca1a1439e2ab7f7b041
SESSION_SECRET=4d38b8e1bc1df9e95ad82c128283189220ee17e011507161070d06fe96bce25e59088dd55c4258de529cf6e41f8755c2ba2d927c44c00d58a7bee4b1b710bb5ac

# =============================================================================
# 🌐 APPLICATION URLS
# =============================================================================
APP_URL=http://localhost:5174
RESET_PASSWORD_URL=http://localhost:5174/reset-password
`;

// Append missing configuration
envContent += missingConfig;

// Write updated content
fs.writeFileSync('.env', envContent);

console.log('✅ Missing configuration added to .env file!');
console.log('📧 Resend API Key: Added');
console.log('🗄️ Database URL: Added');
console.log('🔐 Security Keys: Added');
console.log('🌐 Application URLs: Added');
console.log('\n🚀 Backend is now ready for testing!');
