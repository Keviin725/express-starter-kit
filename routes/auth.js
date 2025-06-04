const express = require('express');
const { body } = require('express-validator');
const { 
  register, 
  login, 
  verifyEmail, 
  forgotPassword, 
  resetPassword,
  refreshToken 
} = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/AuthMiddleware');
const { authLimiter, passwordResetLimiter } = require('../middlewares/RateLimiter');

const router = express.Router();

// Protected test route
router.get('/me', authMiddleware, (req, res) => {
  res.json({ 
    message: 'Protected route accessed successfully', 
    user: req.user 
  });
});

// Auth routes with rate limiting
router.post(
  '/register',
  authLimiter,
  [
    body('phone').isMobilePhone().withMessage('Invalid phone number'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty if provided'),
  ],
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('phone').isMobilePhone().withMessage('Invalid phone number'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

// Email verification
router.get('/verify-email/:token', verifyEmail);

// Password reset
router.post(
  '/forgot-password',
  passwordResetLimiter,
  [
    body('email').isEmail().withMessage('Invalid email'),
  ],
  forgotPassword
);

router.post(
  '/reset-password/:token',
  passwordResetLimiter,
  [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  resetPassword
);

// Token refresh
router.post(
  '/refresh-token',
  authLimiter,
  [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  ],
  refreshToken
);

module.exports = router;
