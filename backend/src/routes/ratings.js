import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../utils/prisma.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);
router.use(requireRole('USER'));

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const ratingValidation = [
  body('storeId').isString().notEmpty().withMessage('Store ID is required'),
  body('value')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating value must be an integer between 1 and 5'),
  handleValidationErrors
];

// POST / - Submit or update (upsert) a rating for a store
router.post('/', ratingValidation, async (req, res, next) => {
  try {
    const { storeId, value } = req.body;
    const userId = req.user.id;

    // Check if store exists
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const rating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      update: {
        value,
      },
      create: {
        userId,
        storeId,
        value,
      },
    });

    res.status(200).json(rating);
  } catch (error) {
    next(error);
  }
});

export default router;
