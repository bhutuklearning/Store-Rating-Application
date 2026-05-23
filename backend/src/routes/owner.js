import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { getOwnerDashboard } from '../controllers/ownerController.js';

const router = Router();

router.use(authMiddleware);
router.use(requireRole('STORE_OWNER'));

// GET /dashboard - Returns store average rating and list of reviews/reviewers
router.get('/dashboard', getOwnerDashboard);

export default router;
