const ApiResponse = require('../utils/apiResponse');
const fs = require('fs');
const path = require('path');

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        statusCode = 404;
        message = 'Resource not found';
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // Log to file for debugging
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url} - ${statusCode} - ${message}\n${err.stack}\n\n`;
    fs.appendFileSync(path.join(__dirname, '../error_logs.txt'), logMessage);

    res.status(statusCode).json(new ApiResponse(statusCode, null, message));
};

module.exports = errorHandler;
