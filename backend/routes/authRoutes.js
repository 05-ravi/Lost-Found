const express = require('express');
const router = express.Router();
const { registerUser, loginUser, refreshAccessToken, logoutUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const { check } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

router.post('/register', [
    check('email', 'Please include a valid VJIT email').not().isEmpty(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('name', 'Name is required').not().isEmpty(),
    check('collegeId', 'College ID is required').not().isEmpty(),
    validateRequest
], registerUser);

router.post('/login', authLimiter, loginUser);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);

module.exports = router;
