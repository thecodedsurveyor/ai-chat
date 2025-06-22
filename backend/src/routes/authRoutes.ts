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
	getEmailStatus,
	verifyEmail,
	resendVerificationEmail,
} from '../controllers/authController';
import { uploadProfilePicture } from '../controllers/uploadController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { ValidationUtils } from '../utils/validation';
import { uploadProfilePicture as uploadMiddleware } from '../middleware/upload';
import {
	authRateLimiter,
	passwordResetRateLimiter,
	emailVerificationRateLimiter,
	generalRateLimiter,
} from '../middleware/rateLimiter';

const router = Router();

// Public routes with rate limiting
router.post(
	'/register',
	authRateLimiter,
	validate(ValidationUtils.registerSchema),
	register
);

router.post(
	'/login',
	authRateLimiter,
	validate(ValidationUtils.loginSchema),
	login
);

router.post(
	'/request-password-reset',
	passwordResetRateLimiter,
	validate(ValidationUtils.requestPasswordResetSchema),
	requestPasswordReset
);

router.post(
	'/reset-password',
	passwordResetRateLimiter,
	validate(ValidationUtils.resetPasswordSchema),
	resetPassword
);

// Email service status (for debugging)
router.get(
	'/email-status',
	generalRateLimiter,
	getEmailStatus
);

// Email verification routes
router.post(
	'/verify-email',
	emailVerificationRateLimiter,
	verifyEmail
);
router.post(
	'/resend-verification',
	emailVerificationRateLimiter,
	resendVerificationEmail
);

// Token refresh route
router.post(
	'/refresh-token',
	authRateLimiter,
	refreshToken
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

router.post(
	'/upload-profile-picture',
	authenticateToken,
	uploadMiddleware,
	uploadProfilePicture
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
