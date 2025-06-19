import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const prisma = new PrismaClient();

// Colors for console output
const colors = {
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	white: '\x1b[37m',
	reset: '\x1b[0m',
};

// Create readline interface for user input
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// Helper function to ask questions
const askQuestion = (question: string): Promise<string> => {
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			resolve(answer.trim());
		});
	});
};

// Function to create a backup of all users
async function createBackup(): Promise<string | null> {
	try {
		console.log(
			`${colors.blue}📦 Creating backup of all users...${colors.reset}`
		);

		// Get all users with their related data
		const users = await prisma.user.findMany({
			include: {
				chats: true,
				sessions: true,
				conversations: {
					include: {
						messages: true,
					},
				},
			},
		});

		if (users.length === 0) {
			console.log(
				`${colors.yellow}⚠️  No users found to backup${colors.reset}`
			);
			return null;
		}

		// Create backup filename with timestamp
		const timestamp = new Date()
			.toISOString()
			.replace(/[:.]/g, '-');
		const backupDir = path.join(
			__dirname,
			'..',
			'backups'
		);

		// Create backups directory if it doesn't exist
		if (!fs.existsSync(backupDir)) {
			fs.mkdirSync(backupDir, { recursive: true });
		}

		const backupFile = path.join(
			backupDir,
			`users-backup-${timestamp}.json`
		);

		// Write backup file
		fs.writeFileSync(
			backupFile,
			JSON.stringify(users, null, 2)
		);

		console.log(
			`${colors.green}✅ Backup created: ${backupFile}${colors.reset}`
		);
		console.log(
			`${colors.cyan}📊 Backed up ${users.length} users${colors.reset}`
		);

		return backupFile;
	} catch (error) {
		console.error(
			`${colors.red}❌ Error creating backup:${colors.reset}`,
			error
		);
		return null;
	}
}

// Function to get user statistics
async function getUserStats() {
	try {
		const userCount = await prisma.user.count();
		const chatCount = await prisma.chat.count();
		const conversationCount =
			await prisma.conversation.count();
		const messageCount = await prisma.message.count();
		const sessionCount = await prisma.session.count();

		return {
			users: userCount,
			chats: chatCount,
			conversations: conversationCount,
			messages: messageCount,
			sessions: sessionCount,
		};
	} catch (error) {
		console.error(
			`${colors.red}❌ Error getting stats:${colors.reset}`,
			error
		);
		return null;
	}
}

// Function to delete all users and related data
async function deleteAllUsers(): Promise<boolean> {
	try {
		console.log(
			`${colors.yellow}🗑️  Deleting all users and related data...${colors.reset}`
		);

		// Delete in the correct order to avoid foreign key constraints
		console.log(
			`${colors.blue}   Deleting messages...${colors.reset}`
		);
		const deletedMessages =
			await prisma.message.deleteMany({});

		console.log(
			`${colors.blue}   Deleting conversations...${colors.reset}`
		);
		const deletedConversations =
			await prisma.conversation.deleteMany({});

		console.log(
			`${colors.blue}   Deleting chats...${colors.reset}`
		);
		const deletedChats = await prisma.chat.deleteMany(
			{}
		);

		console.log(
			`${colors.blue}   Deleting sessions...${colors.reset}`
		);
		const deletedSessions =
			await prisma.session.deleteMany({});

		console.log(
			`${colors.blue}   Deleting chat analytics...${colors.reset}`
		);
		const deletedAnalytics =
			await prisma.chatAnalytics.deleteMany({});

		console.log(
			`${colors.blue}   Deleting users...${colors.reset}`
		);
		const deletedUsers = await prisma.user.deleteMany(
			{}
		);

		console.log(
			`${colors.green}✅ Deletion completed successfully!${colors.reset}`
		);
		console.log(
			`${colors.cyan}📊 Deleted:${colors.reset}`
		);
		console.log(`   • ${deletedUsers.count} users`);
		console.log(`   • ${deletedChats.count} chats`);
		console.log(
			`   • ${deletedConversations.count} conversations`
		);
		console.log(
			`   • ${deletedMessages.count} messages`
		);
		console.log(
			`   • ${deletedSessions.count} sessions`
		);
		console.log(
			`   • ${deletedAnalytics.count} analytics records`
		);

		return true;
	} catch (error) {
		console.error(
			`${colors.red}❌ Error deleting users:${colors.reset}`,
			error
		);
		return false;
	}
}

// Main function
async function main() {
	console.log(
		`${colors.magenta}🚨 USER DELETION SCRIPT 🚨${colors.reset}`
	);
	console.log(
		`${colors.yellow}⚠️  This will delete ALL users and their data from the database!${colors.reset}`
	);
	console.log();

	try {
		// Get current statistics
		console.log(
			`${colors.blue}📊 Current database statistics:${colors.reset}`
		);
		const stats = await getUserStats();

		if (!stats) {
			console.log(
				`${colors.red}❌ Could not retrieve database statistics${colors.reset}`
			);
			process.exit(1);
		}

		if (stats.users === 0) {
			console.log(
				`${colors.green}✅ No users found in the database${colors.reset}`
			);
			process.exit(0);
		}

		console.log(`   • Users: ${stats.users}`);
		console.log(`   • Chats: ${stats.chats}`);
		console.log(
			`   • Conversations: ${stats.conversations}`
		);
		console.log(`   • Messages: ${stats.messages}`);
		console.log(`   • Sessions: ${stats.sessions}`);
		console.log();

		// Ask for backup confirmation
		const wantBackup = await askQuestion(
			`${colors.cyan}💾 Do you want to create a backup before deletion? (y/N): ${colors.reset}`
		);

		let backupCreated = false;
		if (
			wantBackup.toLowerCase() === 'y' ||
			wantBackup.toLowerCase() === 'yes'
		) {
			const backupFile = await createBackup();
			backupCreated = !!backupFile;
			if (!backupCreated) {
				const continueWithoutBackup =
					await askQuestion(
						`${colors.yellow}⚠️  Backup failed. Continue without backup? (y/N): ${colors.reset}`
					);
				if (
					continueWithoutBackup.toLowerCase() !==
						'y' &&
					continueWithoutBackup.toLowerCase() !==
						'yes'
				) {
					console.log(
						`${colors.blue}ℹ️  Operation cancelled${colors.reset}`
					);
					process.exit(0);
				}
			}
			console.log();
		}

		// Final confirmation
		console.log(
			`${colors.red}⚠️  FINAL WARNING: This action cannot be undone!${colors.reset}`
		);
		const finalConfirm = await askQuestion(
			`${colors.red}Type "DELETE ALL USERS" to confirm deletion: ${colors.reset}`
		);

		if (finalConfirm !== 'DELETE ALL USERS') {
			console.log(
				`${colors.blue}ℹ️  Operation cancelled - confirmation text didn't match${colors.reset}`
			);
			process.exit(0);
		}

		console.log();

		// Perform deletion
		const success = await deleteAllUsers();

		if (success) {
			console.log();
			console.log(
				`${colors.green}🎉 All users have been successfully deleted!${colors.reset}`
			);
			if (backupCreated) {
				console.log(
					`${colors.blue}💾 Backup was created before deletion${colors.reset}`
				);
			}
		} else {
			console.log(
				`${colors.red}❌ Deletion failed - check the error messages above${colors.reset}`
			);
			process.exit(1);
		}
	} catch (error) {
		console.error(
			`${colors.red}❌ Unexpected error:${colors.reset}`,
			error
		);
		process.exit(1);
	} finally {
		rl.close();
		await prisma.$disconnect();
	}
}

// Handle process termination
process.on('SIGINT', async () => {
	console.log(
		`\n${colors.yellow}⚠️  Script interrupted by user${colors.reset}`
	);
	rl.close();
	await prisma.$disconnect();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	console.log(
		`\n${colors.yellow}⚠️  Script terminated${colors.reset}`
	);
	rl.close();
	await prisma.$disconnect();
	process.exit(0);
});

// Run the script
if (require.main === module) {
	main().catch((error) => {
		console.error(
			`${colors.red}❌ Fatal error:${colors.reset}`,
			error
		);
		process.exit(1);
	});
}
