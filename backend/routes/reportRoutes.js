const express = require('express');
const router = express.Router();
const { 
    createReport, getReports, getReportById, updateReport, 
    deleteReport, resolveReport, getMyReports, getRelevantFoundItems,
    getPublicStats, analyzeImage, classifyItem
} = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { checkHasLostReport } = require('../middleware/checkHasLostReport');

router.get('/stats', getPublicStats);
router.post('/ml/ocr', protect, upload.single('photo'), analyzeImage);
router.post('/ml/classify', protect, classifyItem);
router.get('/', getReports);
router.get('/found/relevant', protect, checkHasLostReport, getRelevantFoundItems);
router.get('/found/all', protect, admin, getReports);
router.post('/', protect, upload.array('photos', 5), createReport);
router.get('/my/reports', protect, getMyReports);
router.get('/:id', getReportById);
router.put('/:id', protect, updateReport);
router.delete('/:id', protect, deleteReport);
router.patch('/:id/resolve', protect, resolveReport);

module.exports = router;
