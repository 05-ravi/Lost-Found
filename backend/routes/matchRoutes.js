const express = require('express');
const router = express.Router();
const { getMyMatches, dismissMatch } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyMatches);
router.patch('/:id/dismiss', protect, dismissMatch);

module.exports = router;
