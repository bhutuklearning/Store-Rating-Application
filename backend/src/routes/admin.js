import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import {
  getAdminDashboard,
  createUser,
  createStore,
  listUsers,
  listStores,
  getUserDetail
} from '../controllers/adminController.js';

const router = Router();

// Apply admin access control to all routes in this router
router.use(authMiddleware);
router.use(requireRole('ADMIN'));

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const userCreateValidation = [
  body('name').isString().isLength({ min: 20, max: 60 }).withMessage('Name must be 20–60 characters long'),
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password')
    .isString()
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be 8–16 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  body('address').isString().isLength({ max: 400 }).withMessage('Address cannot exceed 400 characters'),
  body('role').isIn(['USER', 'ADMIN', 'STORE_OWNER']).withMessage('Invalid role'),
  handleValidationErrors
];

const storeCreateValidation = [
  body('name').isString().notEmpty().withMessage('Store name is required'),
  body('email').isEmail().withMessage('Must be a valid store email address'),
  body('address').isString().notEmpty().withMessage('Store address is required'),
  body('ownerId').isString().notEmpty().withMessage('Owner ID is required'),
  handleValidationErrors
];

// GET /dashboard — Return: totalUsers, totalStores, totalRatings counts.
router.get('/dashboard', getAdminDashboard);

// POST /users — Create USER, ADMIN, or STORE_OWNER.
router.post('/users', userCreateValidation, createUser);

// POST /stores — Create store.
router.post('/stores', storeCreateValidation, createStore);

// GET /users — List all users (USER + STORE_OWNER + ADMIN).
router.get('/users', listUsers);

// GET /stores — List all stores with their average rating.
router.get('/stores', listStores);

// GET /users/:id — User detail.
router.get('/users/:id', getUserDetail);

export default router;
