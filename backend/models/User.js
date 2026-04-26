const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        match: [/^[A-Z0-9]{10}@vjit\.ac\.in$/i, 'Please use a valid VJIT email (rollno@vjit.ac.in)']
    },
    password: { type: String, required: true },
    collegeId: { type: String, required: true },
    phone: { type: String },
    avatar: { type: String },
    bio: { type: String },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    privacySettings: {
        showPhone: { type: Boolean, default: false },
        showEmail: { type: Boolean, default: false },
        isDiscoverable: { type: Boolean, default: true }
    },
    notificationPrefs: {
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true }
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
