const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use SMTP settings
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: `"Campus Lost & Found" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

const getBaseTemplate = (title, message, buttonText, buttonLink) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .email-container { font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 32px; }
            .logo { color: #003366; font-size: 24px; font-weight: 800; margin-bottom: 24px; text-decoration: none; }
            .title { color: #003366; font-size: 22px; font-weight: 700; margin-bottom: 16px; }
            .message { color: #555555; line-height: 1.6; font-size: 16px; margin-bottom: 32px; }
            .button { background-color: #003366; color: white !important; padding: 16px 32px; border-radius: 16px; text-decoration: none; font-weight: 700; display: inline-block; }
            .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #eeeeee; color: #999999; font-size: 12px; }
        </style>
    </head>
    <body style="background-color: #f7f9fc; padding: 40px 0;">
        <div class="email-container" style="background-color: #ffffff;">
            <div class="logo">LOST<span style="color: #FF3B30;">&</span>FOUND</div>
            <div class="title">${title}</div>
            <div class="message">${message}</div>
            ${buttonText ? `<a href="${buttonLink}" class="button">${buttonText}</a>` : ''}
            <div class="footer">
                <p>VJIT Campus Lost & Found Portal</p>
                <p>This is an automated notification. Please do not reply directly to this email.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = { sendEmail, getBaseTemplate };
