const Report = require('../models/Report');
const Claim = require('../models/Claim');
const Match = require('../models/Match');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = asyncHandler(async (req, res) => {
    const totalLost = await Report.countDocuments({ type: 'lost', reportedBy: req.user._id });
    const totalFound = await Report.countDocuments({ type: 'found', reportedBy: req.user._id });
    const totalResolved = await Report.countDocuments({ status: 'resolved', reportedBy: req.user._id });

    // Category breakdown
    const categoriesCount = await Report.aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    // User specific counts
    const myReportsCount = await Report.countDocuments({ reportedBy: req.user._id });
    const myActiveClaims = await Claim.countDocuments({ claimedBy: req.user._id, status: 'pending' });
    
    // Recent activity (latest 5 across all items)
    const recentActivity = await Report.find({ status: 'published' })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('reportedBy', 'name avatar');

    res.json(new ApiResponse(200, {
        stats: {
            totalLost,
            totalFound,
            totalResolved,
            resolutionRate: totalLost + totalFound > 0 
                ? Math.round((totalResolved / (totalLost + totalFound)) * 100) 
                : 0
        },
        categories: categoriesCount,
        myStats: {
            reports: myReportsCount,
            claims: myActiveClaims
        },
        recentActivity
    }));
});

module.exports = {
    getStats
};
