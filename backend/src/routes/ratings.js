import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { upsertRating } from '../controllers/ratingsController.js';

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
router.post('/', ratingValidation, upsertRating);

export default router;
