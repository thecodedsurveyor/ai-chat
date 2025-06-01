import { Router } from 'express';
import {
	getConversations,
	getConversation,
	createConversation,
	updateConversation,
	deleteConversation,
} from '../controllers/conversationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All conversation routes require authentication
router.use(authenticateToken);

// Conversation routes
router.get('/', getConversations);
router.post('/', createConversation);
router.get('/:id', getConversation);
router.put('/:id', updateConversation);
router.delete('/:id', deleteConversation);

export default router;
