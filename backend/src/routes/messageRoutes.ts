import { Router } from 'express';
import {
	getMessages,
	createMessage,
	deleteMessage,
	searchMessages,
} from '../controllers/messageController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All message routes require authentication
router.use(authenticateToken);

// Message routes
router.get('/search', searchMessages);
router.get('/conversation/:conversationId', getMessages);
router.post('/conversation/:conversationId', createMessage);
router.delete('/:messageId', deleteMessage);

export default router;
