import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware } from '../middleware/auth.js';
import { registerUser, loginUser, changePassword } from '../controllers/authController.js';

const router = Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const passwordValidation = body('password')
  .isString()
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be 8–16 characters long')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage('Password must contain at least one special character');

const registerValidation = [
  body('name')
    .isString()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be 20–60 characters long'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
  passwordValidation,
  body('address')
    .isString()
    .isLength({ max: 400 })
    .withMessage('Address cannot exceed 400 characters'),
  handleValidationErrors
];

// POST /register - Normal users only (role = USER)
router.post('/register', registerValidation, registerUser);

// POST /login - All roles
router.post('/login', [
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password').exists().withMessage('Password is required'),
  handleValidationErrors
], loginUser);

// PATCH /change-password - Auth required
router.patch('/change-password', authMiddleware, [
  passwordValidation,
  handleValidationErrors
], changePassword);

export default router;
