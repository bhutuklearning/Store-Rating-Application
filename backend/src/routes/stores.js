import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { listStores } from '../controllers/storesController.js';

const router = Router();

router.use(authMiddleware);
router.use(requireRole('USER'));

// GET / - List all stores with their average rating and the logged-in user's rating
router.get('/', listStores);

export default router;
