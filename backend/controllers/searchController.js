const Report = require('../models/Report');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Search reports with keywords and filters
// @route   GET /api/search
// @access  Public
const searchReports = asyncHandler(async (req, res) => {
    const { q, category, dateFrom, dateTo, type } = req.query;
    
    let query = { status: 'published' };

    if (q) {
        query.$or = [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { 'location.text': { $regex: q, $options: 'i' } }
        ];
    }

    if (category) {
        query.category = category;
    }

    if (type) {
        query.type = type;
    }

    if (dateFrom || dateTo) {
        query.dateOccurred = {};
        if (dateFrom) query.dateOccurred.$gte = new Date(dateFrom);
        if (dateTo) query.dateOccurred.$lte = new Date(dateTo);
    }

    const results = await Report.find(query)
        .populate('reportedBy', 'name avatar')
        .sort({ createdAt: -1 });

    res.json(new ApiResponse(200, results));
});

module.exports = {
    searchReports
};
