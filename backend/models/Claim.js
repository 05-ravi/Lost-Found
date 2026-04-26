const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    uniqueDetail: { type: String, required: true },
    dateLost: { type: Date },
    locationLost: { type: String },
    proofPhoto: {
        url: { type: String },
        publicId: { type: String }
    },
    message: { type: String },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected', 'cancelled'], 
        default: 'pending' 
    },
    rejectionReason: { type: String },
    isReceived: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);
