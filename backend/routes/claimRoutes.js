const express = require('express');
const router = express.Router();
const { 
    submitClaim, getMyClaims, getReceivedClaims, 
    acceptClaim, rejectClaim, markAsReceived 
} = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('proofPhoto'), submitClaim);
router.get('/my/claims', protect, getMyClaims);
router.get('/received', protect, getReceivedClaims);
router.patch('/:id/accept', protect, acceptClaim);
router.patch('/:id/reject', protect, rejectClaim);
router.patch('/:id/received', protect, markAsReceived);

module.exports = router;
