const express = require('express');
const router = express.Router();
const { getNotifications, readAllNotifications, readNotification, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.patch('/read-all', protect, readAllNotifications);
router.patch('/:id/read', protect, readNotification);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
