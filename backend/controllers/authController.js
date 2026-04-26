const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    let { name, email, password, collegeId } = req.body;
    email = email.toLowerCase();

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json(new ApiResponse(400, null, 'User already exists'));
    }

    const user = await User.create({
        name,
        email,
        password,
        collegeId
    });

    if (user) {
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Send Welcome Email
        const { sendEmail, getBaseTemplate } = require('../services/emailService');
        const welcomeHtml = getBaseTemplate(
            `Welcome to VJIT Lost & Found, ${user.name}!`,
            `We're excited to have you on board. You can now report lost items, browse for found ones, and get AI-powered matches instantly.`,
            'Go to Dashboard',
            `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard`
        );
        
        await sendEmail(
            user.email,
            'Welcome to VJIT Lost & Found!',
            'Thank you for joining our community.',
            welcomeHtml
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json(new ApiResponse(201, {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken
        }, 'User registered successfully'));
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    let { email, password } = req.body;
    email = email.toLowerCase();

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json(new ApiResponse(200, {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken
        }, 'Login successful'));
    } else {
        console.warn(`Failed login attempt for email: ${email}`);
        res.status(401).json(new ApiResponse(401, null, 'Invalid email or password'));
    }
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json(new ApiResponse(401, null, 'Refresh token not found'));
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json(new ApiResponse(401, null, 'User not found'));
        }

        const accessToken = generateAccessToken(user._id);
        res.json(new ApiResponse(200, { accessToken }, 'Token refreshed'));
    } catch (error) {
        res.status(401).json(new ApiResponse(401, null, 'Invalid refresh token'));
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('refreshToken', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.json(new ApiResponse(200, null, 'Logged out successfully'));
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.json(new ApiResponse(200, user));
});

module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getMe
};
