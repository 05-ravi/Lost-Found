const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.bio = req.body.bio || user.bio;
        user.avatar = req.body.avatar || user.avatar;

        const updatedUser = await user.save();
        res.json(new ApiResponse(200, {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            bio: updatedUser.bio,
            avatar: updatedUser.avatar
        }, 'Profile updated'));
    } else {
        res.status(404).json(new ApiResponse(404, null, 'User not found'));
    }
});

// @desc    Update privacy settings
// @route   PUT /api/users/privacy
// @access  Private
const updatePrivacy = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.privacySettings = req.body.privacySettings;
        await user.save();
        res.json(new ApiResponse(200, user.privacySettings, 'Privacy settings updated'));
    } else {
        res.status(404).json(new ApiResponse(404, null, 'User not found'));
    }
});

// @desc    Update notification preferences
// @route   PUT /api/users/notification-prefs
// @access  Private
const updateNotificationPrefs = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.notificationPrefs = req.body.notificationPrefs;
        await user.save();
        res.json(new ApiResponse(200, user.notificationPrefs, 'Notification preferences updated'));
    } else {
        res.status(404).json(new ApiResponse(404, null, 'User not found'));
    }
});

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(oldPassword))) {
        user.password = newPassword;
        await user.save();
        res.json(new ApiResponse(200, null, 'Password changed successfully'));
    } else {
        res.status(400).json(new ApiResponse(400, null, 'Invalid old password'));
    }
});

// @desc    Delete account
// @route   DELETE /api/users/account
// @access  Private
const deleteAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        await user.deleteOne();
        res.json(new ApiResponse(200, null, 'Account deleted'));
    } else {
        res.status(404).json(new ApiResponse(404, null, 'User not found'));
    }
});

module.exports = {
    updateProfile,
    updatePrivacy,
    updateNotificationPrefs,
    changePassword,
    deleteAccount
};
