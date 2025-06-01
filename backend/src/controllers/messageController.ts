import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

/**
 * Get messages for a specific conversation
 */
export const getMessages = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		const { conversationId } = req.params;
		const { page = 1, limit = 50 } = req.query;

		if (!userId) {
			res.status(401).json({
				success: false,
				message: 'User not authenticated',
			});
			return;
		}

		// Check if conversation belongs to user
		const conversation =
			await prisma.conversation.findFirst({
				where: { id: conversationId, userId },
			});

		if (!conversation) {
			res.status(404).json({
				success: false,
				message: 'Conversation not found',
			});
			return;
		}

		const pageNumber = parseInt(page as string);
		const limitNumber = parseInt(limit as string);
		const skip = (pageNumber - 1) * limitNumber;

		const messages = await prisma.message.findMany({
			where: { conversationId },
			orderBy: { createdAt: 'asc' },
			skip,
			take: limitNumber,
		});

		const totalMessages = await prisma.message.count({
			where: { conversationId },
		});

		res.json({
			success: true,
			data: {
				messages,
				pagination: {
					currentPage: pageNumber,
					totalPages: Math.ceil(
						totalMessages / limitNumber
					),
					totalMessages,
					hasMore:
						skip + messages.length <
						totalMessages,
				},
			},
		});
	} catch (error) {
		console.error('Get messages error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

/**
 * Add a new message to a conversation
 */
export const createMessage = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		const { conversationId } = req.params;
		const { role, content, tokens, model, metadata } =
			req.body;

		if (!userId) {
			res.status(401).json({
				success: false,
				message: 'User not authenticated',
			});
			return;
		}

		// Check if conversation belongs to user
		const conversation =
			await prisma.conversation.findFirst({
				where: { id: conversationId, userId },
			});

		if (!conversation) {
			res.status(404).json({
				success: false,
				message: 'Conversation not found',
			});
			return;
		}

		// Validate role
		if (!['user', 'assistant'].includes(role)) {
			res.status(400).json({
				success: false,
				message:
					'Invalid message role. Must be "user" or "assistant"',
			});
			return;
		}

		// Create the message
		const message = await prisma.message.create({
			data: {
				conversationId,
				role,
				content,
				tokens,
				model,
				metadata,
			},
		});

		// Update conversation metadata
		await prisma.conversation.update({
			where: { id: conversationId },
			data: {
				lastMessageAt: new Date(),
				totalMessages: {
					increment: 1,
				},
				updatedAt: new Date(),
			},
		});

		res.status(201).json({
			success: true,
			message: 'Message created successfully',
			data: { message },
		});
	} catch (error) {
		console.error('Create message error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

/**
 * Delete a specific message
 */
export const deleteMessage = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		const { messageId } = req.params;

		if (!userId) {
			res.status(401).json({
				success: false,
				message: 'User not authenticated',
			});
			return;
		}

		// Find the message and check if it belongs to user's conversation
		const message = await prisma.message.findFirst({
			where: { id: messageId },
			include: {
				conversation: {
					select: { userId: true, id: true },
				},
			},
		});

		if (
			!message ||
			message.conversation.userId !== userId
		) {
			res.status(404).json({
				success: false,
				message: 'Message not found',
			});
			return;
		}

		// Delete the message
		await prisma.message.delete({
			where: { id: messageId },
		});

		// Update conversation message count
		await prisma.conversation.update({
			where: { id: message.conversation.id },
			data: {
				totalMessages: {
					decrement: 1,
				},
				updatedAt: new Date(),
			},
		});

		res.json({
			success: true,
			message: 'Message deleted successfully',
		});
	} catch (error) {
		console.error('Delete message error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

/**
 * Search messages across all conversations
 */
export const searchMessages = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		const { query, page = 1, limit = 20 } = req.query;

		if (!userId) {
			res.status(401).json({
				success: false,
				message: 'User not authenticated',
			});
			return;
		}

		if (
			!query ||
			typeof query !== 'string' ||
			query.trim().length === 0
		) {
			res.status(400).json({
				success: false,
				message: 'Search query is required',
			});
			return;
		}

		const pageNumber = parseInt(page as string);
		const limitNumber = parseInt(limit as string);
		const skip = (pageNumber - 1) * limitNumber;

		// Search messages in user's conversations
		const messages = await prisma.message.findMany({
			where: {
				conversation: {
					userId,
				},
				content: {
					contains: query.trim(),
					mode: 'insensitive',
				},
			},
			include: {
				conversation: {
					select: {
						id: true,
						title: true,
						createdAt: true,
					},
				},
			},
			orderBy: { createdAt: 'desc' },
			skip,
			take: limitNumber,
		});

		const totalResults = await prisma.message.count({
			where: {
				conversation: {
					userId,
				},
				content: {
					contains: query.trim(),
					mode: 'insensitive',
				},
			},
		});

		res.json({
			success: true,
			data: {
				messages,
				query: query.trim(),
				pagination: {
					currentPage: pageNumber,
					totalPages: Math.ceil(
						totalResults / limitNumber
					),
					totalResults,
					hasMore:
						skip + messages.length <
						totalResults,
				},
			},
		});
	} catch (error) {
		console.error('Search messages error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};
