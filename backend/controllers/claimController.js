const Claim = require('../models/Claim');
const Report = require('../models/Report');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const { uploadImage } = require('../services/cloudinaryService');
const { createNotification } = require('../services/notificationService');

// @desc    Submit a claim for an item
// @route   POST /api/claims
// @access  Private
const submitClaim = asyncHandler(async (req, res) => {
    const { reportId, uniqueDetail, dateLost, locationLost, message } = req.body;

    const report = await Report.findById(reportId);
    if (!report) {
        return res.status(404).json(new ApiResponse(404, null, 'Report not found'));
    }

    if (report.status !== 'published') {
        return res.status(400).json(new ApiResponse(400, null, 'Item is no longer available for claims'));
    }

    let proofPhoto = null;
    if (req.file) {
        proofPhoto = await uploadImage(req.file.path);
    }

    const claim = await Claim.create({
        report: reportId,
        claimedBy: req.user._id,
        uniqueDetail,
        dateLost,
        locationLost,
        proofPhoto,
        message
    });

    // Notify the finder
    await createNotification({
        recipient: report.reportedBy,
        type: 'claim_received',
        title: 'New Claim Received',
        message: `Someone is claiming the item you found: ${report.title}`,
        link: `/claims/received`
    });

    res.status(201).json(new ApiResponse(201, claim, 'Claim submitted successfully'));
});

// @desc    Get my claims
// @route   GET /api/claims/my/claims
// @access  Private
const getMyClaims = asyncHandler(async (req, res) => {
    const claims = await Claim.find({ claimedBy: req.user._id })
        .populate('report')
        .sort({ createdAt: -1 });
    res.json(new ApiResponse(200, claims));
});

// @desc    Get claims received on my found items
// @route   GET /api/claims/received
// @access  Private
const getReceivedClaims = asyncHandler(async (req, res) => {
    const reports = await Report.find({ reportedBy: req.user._id, type: 'found' });
    const reportIds = reports.map(r => r._id);

    const claims = await Claim.find({ report: { $in: reportIds } })
        .populate('report')
        .populate('claimedBy', 'name email avatar')
        .sort({ createdAt: -1 });

    res.json(new ApiResponse(200, claims));
});

// @desc    Accept a claim
// @route   PATCH /api/claims/:id/accept
// @access  Private
const acceptClaim = asyncHandler(async (req, res) => {
    const claim = await Claim.findById(req.params.id).populate('report');

    if (!claim) {
        return res.status(404).json(new ApiResponse(404, null, 'Claim not found'));
    }

    if (claim.report.reportedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json(new ApiResponse(403, null, 'Not authorized'));
    }

    claim.status = 'accepted';
    await claim.save();

    // Mark report as matched/resolved
    await Report.findByIdAndUpdate(claim.report._id, { status: 'matched' });

    // Notify the claimer
    await createNotification({
        recipient: claim.claimedBy,
        type: 'claim_accepted',
        title: 'Claim Accepted!',
        message: `Your claim for ${claim.report.title} has been accepted. Connect with the finder for handover.`,
        link: `/claims/tracking`
    });

    // Reject other claims for the same report
    await Claim.updateMany(
        { report: claim.report._id, _id: { $ne: claim._id } },
        { status: 'rejected', rejectionReason: 'Item has been claimed by someone else' }
    );

    res.json(new ApiResponse(200, claim, 'Claim accepted'));
});

// @desc    Reject a claim
// @route   PATCH /api/claims/:id/reject
// @access  Private
const rejectClaim = asyncHandler(async (req, res) => {
    const { rejectionReason } = req.body;
    const claim = await Claim.findById(req.params.id).populate('report');

    if (!claim) {
        return res.status(404).json(new ApiResponse(404, null, 'Claim not found'));
    }

    if (claim.report.reportedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json(new ApiResponse(403, null, 'Not authorized'));
    }

    claim.status = 'rejected';
    claim.rejectionReason = rejectionReason;
    await claim.save();

    // Notify the claimer
    await createNotification({
        recipient: claim.claimedBy,
        type: 'claim_rejected',
        title: 'Claim Rejected',
        message: `Your claim for ${claim.report.title} was rejected. Reason: ${rejectionReason}`,
        link: `/claims/tracking`
    });

    res.json(new ApiResponse(200, claim, 'Claim rejected'));
});

// @desc    Mark item as received
// @route   PATCH /api/claims/:id/received
// @access  Private
const markAsReceived = asyncHandler(async (req, res) => {
    const claim = await Claim.findById(req.params.id).populate('report');

    if (!claim) {
        return res.status(404).json(new ApiResponse(404, null, 'Claim not found'));
    }

    if (claim.claimedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json(new ApiResponse(403, null, 'Not authorized'));
    }

    claim.isReceived = true;
    await claim.save();

    // If item is received, we can mark the report as resolved
    await Report.findByIdAndUpdate(claim.report._id, { status: 'resolved' });

    // Notify the finder
    await createNotification({
        recipient: claim.report.reportedBy,
        type: 'item_resolved',
        title: 'Item Handover Confirmed',
        message: `The claimant has confirmed receiving the item: ${claim.report.title}`,
        link: `/my-reports`
    });

    res.json(new ApiResponse(200, claim, 'Item received confirmed'));
});

module.exports = {
    submitClaim,
    getMyClaims,
    getReceivedClaims,
    acceptClaim,
    rejectClaim,
    markAsReceived
};
