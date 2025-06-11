import { Router } from 'express';
import {
	register,
	login,
	logout,
	refreshToken,
	getProfile,
	updateProfile,
	changePassword,
	requestPasswordReset,
	resetPassword,
	deleteAccount,
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

router.post(
	'/request-password-reset',
	validate(ValidationUtils.requestPasswordResetSchema),
	requestPasswordReset
);

router.post(
	'/reset-password',
	validate(ValidationUtils.resetPasswordSchema),
	resetPassword
);

// Token refresh route
router.post('/refresh-token', refreshToken);

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

router.delete(
	'/delete-account',
	authenticateToken,
	deleteAccount
);

export default router;
