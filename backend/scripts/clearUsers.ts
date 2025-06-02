import { PrismaClient } from '@prisma/client';

async function clearUsers() {
	const prisma = new PrismaClient();

	try {
		console.log(
			'🗑️ Clearing all user data from database...'
		);

		// Delete all messages first (cascade will not handle this automatically)
		await prisma.message.deleteMany();
		console.log('✅ All messages deleted');

		// Delete all conversations
		await prisma.conversation.deleteMany();
		console.log('✅ All conversations deleted');

		// Delete all chats
		await prisma.chat.deleteMany();
		console.log('✅ All chats deleted');

		// Delete all sessions
		await prisma.session.deleteMany();
		console.log('✅ All sessions deleted');

		// Delete chat analytics
		await prisma.chatAnalytics.deleteMany();
		console.log('✅ All chat analytics deleted');

		// Finally delete all users
		await prisma.user.deleteMany();
		console.log('✅ All users deleted');

		console.log('🎉 Database cleared successfully!');
	} catch (error) {
		console.error('Error clearing database:', error);
	} finally {
		await prisma.$disconnect();
	}
}

clearUsers();
