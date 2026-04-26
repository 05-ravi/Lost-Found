const Notification = require('../models/Notification');
const { getIO } = require('../config/socket');
const { sendEmail, getBaseTemplate } = require('./emailService');
const User = require('../models/User');

const createNotification = async ({ recipient, type, title, message, link }) => {
    try {
        const notification = await Notification.create({
            recipient,
            type,
            title,
            message,
            link
        });

        // Emit Socket.io event
        const io = getIO();
        if (io) {
            io.to(recipient.toString()).emit('notification:new', notification);
        }

        // Check user preferences for email
        const user = await User.findById(recipient);
        if (user && user.notificationPrefs.email) {
            const html = getBaseTemplate(
                title,
                message,
                'View Details',
                `${process.env.CLIENT_URL || 'http://localhost:5173'}${link}`
            );

            await sendEmail(
                user.email,
                title,
                message,
                html
            );
        }

        return notification;
    } catch (error) {
        console.error('Notification creation failed:', error);
    }
};

module.exports = { createNotification };
