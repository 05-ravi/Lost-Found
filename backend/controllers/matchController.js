const Match = require('../models/Match');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get my matched items
// @route   GET /api/matches/my
// @access  Private
const getMyMatches = asyncHandler(async (req, res) => {
    // Find reports belonging to the user
    // Then find matches involving those reports
    const matches = await Match.find({
        $or: [
            { lostReport: { $in: await getMyReportIds(req.user._id) } },
            { foundReport: { $in: await getMyReportIds(req.user._id) } }
        ],
        isDismissed: false
    })
    .populate({ path: 'lostReport', populate: { path: 'reportedBy', select: 'name avatar' } })
    .populate({ path: 'foundReport', populate: { path: 'reportedBy', select: 'name avatar' } })
    .sort({ score: -1 });
    const activeMatches = matches.filter(m => 
        m.lostReport?.status !== 'resolved' && 
        m.foundReport?.status !== 'resolved'
    );

    res.json(new ApiResponse(200, activeMatches));
});

// @desc    Dismiss a match
// @route   PATCH /api/matches/:id/dismiss
// @access  Private
const dismissMatch = asyncHandler(async (req, res) => {
    const match = await Match.findById(req.params.id);

    if (!match) {
        return res.status(404).json(new ApiResponse(404, null, 'Match not found'));
    }

    match.isDismissed = true;
    match.dismissedBy = req.user._id;
    await match.save();

    res.json(new ApiResponse(200, null, 'Match dismissed'));
});

// Helper to get user's report IDs
const getMyReportIds = async (userId) => {
    const Report = require('../models/Report');
    const reports = await Report.find({ reportedBy: userId }).select('_id');
    return reports.map(r => r._id);
};

module.exports = {
    getMyMatches,
    dismissMatch
};
