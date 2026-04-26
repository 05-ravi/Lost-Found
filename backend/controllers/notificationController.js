const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50);
    res.json(new ApiResponse(200, notifications));
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const readAllNotifications = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { isRead: true }
    );
    res.json(new ApiResponse(200, null, 'All notifications marked as read'));
});

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const readNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        return res.status(404).json(new ApiResponse(404, null, 'Notification not found'));
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
        return res.status(403).json(new ApiResponse(403, null, 'Not authorized'));
    }

    notification.isRead = true;
    await notification.save();

    res.json(new ApiResponse(200, notification, 'Notification marked as read'));
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        return res.status(404).json(new ApiResponse(404, null, 'Notification not found'));
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
        return res.status(403).json(new ApiResponse(403, null, 'Not authorized'));
    }

    await notification.deleteOne();

    res.json(new ApiResponse(200, null, 'Notification removed'));
});

module.exports = {
    getNotifications,
    readAllNotifications,
    readNotification,
    deleteNotification
};
