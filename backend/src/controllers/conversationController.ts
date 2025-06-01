import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

/**
 * Get all conversations for the authenticated user
 */
export const getConversations = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<void> => {
	try {
		const userId = req.user?.userId;

		if (!userId) {
			res.status(401).json({
				success: false,
				message: 'User not authenticated',
			});
			return;
		}

		const conversations =
			await prisma.conversation.findMany({
				where: {
					userId,
					isArchived: false,
				},
				include: {
					_count: {
						select: { messages: true },
					},
				},
				orderBy: {
					lastMessageAt: 'desc',
				},
			});

		res.json({
			success: true,
			data: { conversations },
		});
	} catch (error) {
		console.error('Get conversations error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

/**
 * Get a specific conversation with its messages
 */
export const getConversation = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		const { id } = req.params;

		if (!userId) {
			res.status(401).json({
				success: false,
				message: 'User not authenticated',
			});
			return;
		}

		const conversation =
			await prisma.conversation.findFirst({
				where: {
					id,
					userId,
				},
				include: {
					messages: {
						orderBy: { createdAt: 'asc' },
					},
				},
			});

		if (!conversation) {
			res.status(404).json({
				success: false,
				message: 'Conversation not found',
			});
			return;
		}

		res.json({
			success: true,
			data: { conversation },
		});
	} catch (error) {
		console.error('Get conversation error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

/**
 * Create a new conversation
 */
export const createConversation = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		const { title } = req.body;

		if (!userId) {
			res.status(401).json({
				success: false,
				message: 'User not authenticated',
			});
			return;
		}

		const conversation =
			await prisma.conversation.create({
				data: {
					userId,
					title: title || 'New Conversation',
				},
			});

		res.status(201).json({
			success: true,
			message: 'Conversation created successfully',
			data: { conversation },
		});
	} catch (error) {
		console.error('Create conversation error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

/**
 * Update conversation (title, archive status, etc.)
 */
export const updateConversation = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		const { id } = req.params;
		const { title, isArchived, isPinned, isFavorite } =
			req.body;

		if (!userId) {
			res.status(401).json({
				success: false,
				message: 'User not authenticated',
			});
			return;
		}

		// Check if conversation belongs to user
		const existingConversation =
			await prisma.conversation.findFirst({
				where: { id, userId },
			});

		if (!existingConversation) {
			res.status(404).json({
				success: false,
				message: 'Conversation not found',
			});
			return;
		}

		const conversation =
			await prisma.conversation.update({
				where: { id },
				data: {
					...(title !== undefined && { title }),
					...(isArchived !== undefined && {
						isArchived,
					}),
					...(isPinned !== undefined && {
						isPinned,
					}),
					...(isFavorite !== undefined && {
						isFavorite,
					}),
					updatedAt: new Date(),
				},
			});

		res.json({
			success: true,
			message: 'Conversation updated successfully',
			data: { conversation },
		});
	} catch (error) {
		console.error('Update conversation error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

/**
 * Delete a conversation
 */
export const deleteConversation = async (
	req: AuthenticatedRequest,
	res: Response
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		const { id } = req.params;

		if (!userId) {
			res.status(401).json({
				success: false,
				message: 'User not authenticated',
			});
			return;
		}

		// Check if conversation belongs to user
		const existingConversation =
			await prisma.conversation.findFirst({
				where: { id, userId },
			});

		if (!existingConversation) {
			res.status(404).json({
				success: false,
				message: 'Conversation not found',
			});
			return;
		}

		// Delete conversation (messages will be deleted automatically due to cascade)
		await prisma.conversation.delete({
			where: { id },
		});

		res.json({
			success: true,
			message: 'Conversation deleted successfully',
		});
	} catch (error) {
		console.error('Delete conversation error:', error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};
