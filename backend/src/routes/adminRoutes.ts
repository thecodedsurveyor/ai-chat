import { Router } from 'express';
import { AdminController } from '../controllers/adminController';

const router = Router();

// Admin authentication
router.post('/login', AdminController.login);

// User management
router.get('/users', AdminController.getAllUsers);
router.post(
	'/users/:userId/action',
	AdminController.performUserAction
);

// System health
router.get('/health', AdminController.getSystemHealth);

// Feature flags
router.get('/flags', AdminController.getFeatureFlags);
router.post(
	'/flags/:flagId/toggle',
	AdminController.toggleFeatureFlag
);
router.post(
	'/flags/:flagId/rollout',
	AdminController.updateFeatureFlagRollout
);
router.post('/flags', AdminController.createFeatureFlag);
router.put(
	'/flags/:flagId',
	AdminController.editFeatureFlag
);
router.delete(
	'/flags/:flagId',
	AdminController.deleteFeatureFlag
);

// Analytics
router.get('/analytics', AdminController.getAdminAnalytics);

export default router;
