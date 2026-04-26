const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const message = errors.array().map(err => err.msg).join(', ');
        return res.status(400).json(new ApiResponse(400, null, message));
    }
    next();
};

module.exports = validateRequest;
