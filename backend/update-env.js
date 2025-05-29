const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

console.log('🔧 MongoDB Atlas Connection String Updater');
console.log('');
console.log(
	'Please paste your MongoDB Atlas connection string here:'
);
console.log(
	'(It should look like: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/...)'
);
console.log('');

rl.question(
	'MongoDB Connection String: ',
	(connectionString) => {
		if (!connectionString.trim()) {
			console.log(
				'❌ No connection string provided. Keeping default local MongoDB URL.'
			);
			rl.close();
			return;
		}

		// Read current .env file
		let envContent = fs.readFileSync('.env', 'utf8');

		// Update the DATABASE_URL
		envContent = envContent.replace(
			/DATABASE_URL=".*"/,
			`DATABASE_URL="${connectionString.trim()}"`
		);

		// Write back to .env file
		fs.writeFileSync('.env', envContent);

		console.log('✅ .env file updated successfully!');
		console.log(
			'✅ MongoDB Atlas connection string configured.'
		);
		console.log('');
		console.log('🚀 Next steps:');
		console.log('1. Run: npm run prisma:generate');
		console.log('2. Run: npm run prisma:push');
		console.log('3. Run: npm run dev');

		rl.close();
	}
);
