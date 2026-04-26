const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    lostReport: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
    foundReport: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
    confidence: { type: String, enum: ['high', 'medium', 'low'], required: true },
    score: { type: Number, required: true },
    matchType: { type: String, enum: ['text', 'image', 'both', 'multi-modal'], required: true },
    isDismissed: { type: Boolean, default: false },
    dismissedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
