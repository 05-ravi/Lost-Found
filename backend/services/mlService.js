const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

const getMatchesForReport = async (reportData) => {
    try {
        const Report = require('../models/Report');
        const targetType = reportData.type === 'lost' ? 'found' : 'lost';
        
        const candidates = await Report.find({
            type: targetType,
            status: 'published'
        }).select('_id title description reportedBy');

        if (candidates.length === 0) return [];

        const formattedCandidates = candidates.map(c => ({
            id: c._id.toString(),
            title: c.title,
            description: c.description,
            reportedBy: c.reportedBy.toString()
        }));

        const response = await axios.post(`${ML_SERVICE_URL}/ml/match/text`, {
            title: reportData.title,
            description: reportData.description,
            type: reportData.type,
            id: reportData._id.toString(),
            candidates: formattedCandidates
        });
        return response.data;
    } catch (error) {
        console.error('ML Match Text failed:', error.message);
        return [];
    }
};

const getImageMatches = async (imageUrl, type) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/ml/match/image`, {
            image_url: imageUrl,
            type
        });
        return response.data;
    } catch (error) {
        console.error('ML Match Image failed:', error.message);
        return [];
    }
};

const predictCategory = async (description) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/ml/classify/category`, {
            description
        });
        return response.data.category;
    } catch (error) {
        console.error('ML Predict Category failed:', error.message);
        return 'Other';
    }
};

const extractTextFromImage = async (imageUrl) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/ml/ocr/extract`, {
            image_url: imageUrl
        });
        return response.data;
    } catch (error) {
        console.error('ML OCR failed:', error.message);
        return { text: '', fields: {} };
    }
};

module.exports = {
    getMatchesForReport,
    getImageMatches,
    predictCategory,
    extractTextFromImage
};
