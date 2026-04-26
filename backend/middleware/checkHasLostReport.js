const Report = require('../models/Report');
const asyncHandler = require('../utils/asyncHandler');

const checkHasLostReport = asyncHandler(async (req, res, next) => {
    const lostReports = await Report.find({
        reportedBy: req.user._id,
        type: 'lost',
        status: { $in: ['published', 'matched'] }
    });

    if (!lostReports || lostReports.length === 0) {
        return res.status(403).json({
            success: false,
            hasLostReport: false,
            message: "You need an active lost report to browse found items"
        });
    }

    req.lostReports = lostReports;
    next();
});

module.exports = { checkHasLostReport };
