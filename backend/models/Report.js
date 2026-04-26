const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    type: { type: String, enum: ['lost', 'found'], required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    dateOccurred: { type: Date, required: true },
    timeOccurred: { type: String },
    location: {
        text: { type: String, required: true },
        lat: { type: Number },
        lng: { type: Number }
    },
    photos: [{
        url: { type: String },
        publicId: { type: String }
    }],
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
        type: String, 
        enum: ['published', 'matched', 'resolved', 'archived', 'under_review'], 
        default: 'published' 
    },
    isPrivate: { type: Boolean, default: false },
    requiresProof: { type: Boolean, default: false },
    textEmbedding: { type: [Number], default: [] },
    imageEmbedding: { type: [Number], default: [] },
    matchedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }]
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
