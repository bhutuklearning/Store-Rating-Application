import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

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
router.post('/register', registerValidation, async (req, res, next) => {
  try {
    const { name, email, password, address } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role: 'USER',
      },
    });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'heyheyhey',
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
});

// POST /login - All roles
router.post('/login', [
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password').exists().withMessage('Password is required'),
  handleValidationErrors
], async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'heyheyhey',
      { expiresIn: '7d' }
    );

    res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
});

// PATCH /change-password - Auth required
router.patch('/change-password', authMiddleware, [
  passwordValidation,
  handleValidationErrors
], async (req, res, next) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
