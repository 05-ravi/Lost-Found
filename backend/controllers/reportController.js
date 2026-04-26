const Report = require("../models/Report");
const Match = require("../models/Match");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const { uploadImage } = require("../services/cloudinaryService");
const {
  getMatchesForReport,
  getImageMatches,
  predictCategory,
  extractTextFromImage,
} = require("../services/mlService");
const { createNotification } = require("../services/notificationService");
const { calculateRelevance } = require("../utils/relevanceScore");

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
const createReport = asyncHandler(async (req, res) => {
  const {
    type,
    title,
    category,
    description,
    dateOccurred,
    timeOccurred,
    location,
    isPrivate,
    requiresProof,
  } = req.body;

  let uploadedPhotos = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      try {
        const photo = await uploadImage(file.path);
        uploadedPhotos.push(photo);
      } catch (error) {
        console.error(`Failed to upload photo ${file.path}:`, error.message);
        // Continue with other photos or proceed with zero photos if all fail
      }
    }
  }

  const report = await Report.create({
    type,
    title,
    category,
    description,
    dateOccurred,
    timeOccurred,
    location: typeof location === "string" ? JSON.parse(location) : location,
    photos: uploadedPhotos,
    reportedBy: req.user._id,
    isPrivate,
    requiresProof,
  });

  // ML Integration: Get matches in background
  setImmediate(async () => {
    try {
      const textMatches = await getMatchesForReport(report);

      // Optimization: Also check for image matches if photos exist
      let visualMatches = [];
      if (report.photos && report.photos.length > 0) {
        visualMatches = await getImageMatches(
          report.photos[0].url,
          report.type,
        );
      }

      // Merge matches, prioritizing text but allowing visual to supplement
      const combinedMatches = [...textMatches];
      visualMatches.forEach((vm) => {
        const existing = combinedMatches.find((cm) => cm.id === vm.id);
        if (existing) {
          // Boost score if both match
          existing.score = Math.min(0.99, existing.score + vm.score * 0.2);
          existing.matchType = "both";
        } else if (vm.score >= 0.75) {
          combinedMatches.push({ ...vm, matchType: "image" });
        }
      });

      for (const match of combinedMatches) {
        const lostId = type === "lost" ? report._id : match.id;
        const foundId = type === "found" ? report._id : match.id;

        // Check if this match already exists
        const existingMatch = await Match.findOne({
          lostReport: lostId,
          foundReport: foundId,
        });
        if (existingMatch) continue;

        const matchDoc = await Match.create({
          lostReport: lostId,
          foundReport: foundId,
          confidence:
            match.score >= 0.85 ? "high" : match.score >= 0.7 ? "medium" : "low",
          score: match.score,
          matchType: match.matchType || "text",
        });

        // Find the report that was NOT the one we just created
        const otherReport = await Report.findById(match.id);
        if (!otherReport) continue;

        // Notify both parties (the current reporter and the other reporter)
        // 1. Notify the "Other" reporter
        await createNotification({
          recipient: otherReport.reportedBy,
          type: "match_found",
          title: "Smart Match Found!",
          message: `Our AI found a potential match for your ${otherReport.type === "lost" ? "lost" : "found"} item: ${otherReport.title}`,
          link: "/my-matches",
        });

        // 2. Notify the "Current" reporter (optional but helpful)
        await createNotification({
          recipient: req.user._id,
          type: "match_found",
          title: "New Potential Match!",
          message: `We found a potential match for your ${type} item: ${title}`,
          link: "/my-matches",
        });
      }
    } catch (error) {
      console.error("Background ML matching failed:", error);
    }
  });

  res
    .status(201)
    .json(new ApiResponse(201, report, "Report created successfully"));
});

// @desc    Get all reports with filters
// @route   GET /api/reports
// @access  Public
const getReports = asyncHandler(async (req, res) => {
  const { type, category, status, page = 1, limit = 10 } = req.query;
  const query = {};

  if (type) query.type = type;
  if (category) query.category = category;
  if (status) query.status = status;
  else query.status = "published";

  const skip = (page - 1) * limit;

  const reports = await Report.find(query)
    .populate("reportedBy", "name avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Report.countDocuments(query);

  res.json(
    new ApiResponse(200, {
      reports,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    }),
  );
});

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Public
const getReportById = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id).populate(
    "reportedBy",
    "name email phone avatar privacySettings",
  );

  if (!report) {
    return res.status(404).json(new ApiResponse(404, null, "Report not found"));
  }

  res.json(new ApiResponse(200, report));
});

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private
const updateReport = asyncHandler(async (req, res) => {
  let report = await Report.findById(req.params.id);

  if (!report) {
    return res.status(404).json(new ApiResponse(404, null, "Report not found"));
  }

  if (report.reportedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json(new ApiResponse(403, null, "Not authorized"));
  }

  report = await Report.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(new ApiResponse(200, report, "Report updated"));
});

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return res.status(404).json(new ApiResponse(404, null, "Report not found"));
  }

  if (report.reportedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json(new ApiResponse(403, null, "Not authorized"));
  }

  await report.deleteOne();
  res.json(new ApiResponse(200, null, "Report removed"));
});

// @desc    Resolve report
// @route   PATCH /api/reports/:id/resolve
// @access  Private
const resolveReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return res.status(404).json(new ApiResponse(404, null, "Report not found"));
  }

  report.status = "resolved";
  await report.save();
  res.json(new ApiResponse(200, report, "Report marked as resolved"));
});

// @desc    Get my reports
// @route   GET /api/reports/my/reports
// @access  Private
const getMyReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ reportedBy: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(new ApiResponse(200, reports));
});

// @desc    Get highly relevant found items for user
// @route   GET /api/reports/found/relevant
// @access  Private
const getRelevantFoundItems = asyncHandler(async (req, res) => {
  const lostReports = req.lostReports;
  const {
    page = 1,
    limit = 12,
    category,
    dateFrom,
    dateTo,
    location,
  } = req.query;

  const query = { type: "found", status: "published" };

  if (category) query.category = category;
  if (dateFrom || dateTo) {
    query.dateOccurred = {};
    if (dateFrom) query.dateOccurred.$gte = new Date(dateFrom);
    if (dateTo) query.dateOccurred.$lte = new Date(dateTo);
  }
  if (location) {
    query["location.text"] = { $regex: location, $options: "i" };
  }

  const foundItems = await Report.find(query)
    .populate("reportedBy", "name avatar")
    .lean();

  const relevantItems = [];
  for (const item of foundItems) {
    const relevance = calculateRelevance(item, lostReports);
    if (relevance.score >= 70) {
      item.relevance = relevance;
      relevantItems.push(item);
    }
  }

  relevantItems.sort((a, b) => b.relevance.score - a.relevance.score);

  const limitNum = Number(limit);
  const pageNum = Number(page);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedItems = relevantItems.slice(startIndex, endIndex);

  res.json({
    success: true,
    hasLostReport: true,
    totalResults: relevantItems.length,
    page: pageNum,
    totalPages: Math.ceil(relevantItems.length / limitNum),
    data: paginatedItems,
  });
});

// @desc    Get public statistics for landing page
// @route   GET /api/reports/public/stats
// @access  Public
const getPublicStats = asyncHandler(async (req, res) => {
  const totalLost = await Report.countDocuments({ type: "lost" });
  const totalFound = await Report.countDocuments({ type: "found" });
  const totalResolved = await Report.countDocuments({ status: "resolved" });

  res.json(
    new ApiResponse(200, {
      totalLost,
      totalFound,
      totalResolved,
    }),
  );
});
// @desc    Analyze image with OCR
// @route   POST /api/reports/ml/ocr
// @access  Private
const analyzeImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "No image provided"));
  }

  try {
    const photo = await uploadImage(req.file.path);
    const ocrData = await extractTextFromImage(photo.url);
    res.json(
      new ApiResponse(200, {
        photoUrl: photo.url,
        ...ocrData,
      }),
    );
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, "OCR analysis failed"));
  }
});

// @desc    Classify item category
// @route   POST /api/reports/ml/classify
// @access  Private
const classifyItem = asyncHandler(async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "No description provided"));
  }

  const category = await predictCategory(description);
  res.json(new ApiResponse(200, { category }));
});

module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
  resolveReport,
  getMyReports,
  getRelevantFoundItems,
  getPublicStats,
  analyzeImage,
  classifyItem,
};
