const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteAllUsers() {
	console.log(
		'🗑️  Deleting all users and related data...'
	);

	try {
		// Delete in correct order to avoid foreign key constraints
		const deletedMessages =
			await prisma.message.deleteMany({});
		console.log(
			`   ✅ Deleted ${deletedMessages.count} messages`
		);

		const deletedConversations =
			await prisma.conversation.deleteMany({});
		console.log(
			`   ✅ Deleted ${deletedConversations.count} conversations`
		);

		const deletedChats = await prisma.chat.deleteMany(
			{}
		);
		console.log(
			`   ✅ Deleted ${deletedChats.count} chats`
		);

		const deletedSessions =
			await prisma.session.deleteMany({});
		console.log(
			`   ✅ Deleted ${deletedSessions.count} sessions`
		);

		const deletedAnalytics =
			await prisma.chatAnalytics.deleteMany({});
		console.log(
			`   ✅ Deleted ${deletedAnalytics.count} analytics records`
		);

		const deletedUsers = await prisma.user.deleteMany(
			{}
		);
		console.log(
			`   ✅ Deleted ${deletedUsers.count} users`
		);

		console.log(
			'🎉 All users and related data deleted successfully!'
		);
	} catch (error) {
		console.error('❌ Error deleting users:', error);
	} finally {
		await prisma.$disconnect();
	}
}

// Run the script
deleteAllUsers();
