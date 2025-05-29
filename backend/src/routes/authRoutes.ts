import { Router } from 'express';
import {
	register,
	login,
	logout,
	getProfile,
	updateProfile,
	changePassword,
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { ValidationUtils } from '../utils/validation';

const router = Router();

// Public routes
router.post(
	'/register',
	validate(ValidationUtils.registerSchema),
	register
);

router.post(
	'/login',
	validate(ValidationUtils.loginSchema),
	login
);

// Protected routes
router.post('/logout', authenticateToken, logout);

router.get('/profile', authenticateToken, getProfile);

router.put(
	'/profile',
	authenticateToken,
	validate(ValidationUtils.updateUserSchema),
	updateProfile
);

router.put(
	'/change-password',
	authenticateToken,
	changePassword
);

export default router;
