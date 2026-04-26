const express = require('express');
const router = express.Router();
const { 
    updateProfile, updatePrivacy, updateNotificationPrefs, 
    changePassword, deleteAccount 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.put('/profile', protect, updateProfile);
router.put('/privacy', protect, updatePrivacy);
router.put('/notification-prefs', protect, updateNotificationPrefs);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;
