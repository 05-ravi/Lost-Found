const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './.env' });

const Report = require('../models/Report');
const Match = require('../models/Match');
const Claim = require('../models/Claim');
const Notification = require('../models/Notification');

async function wipeData() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        // 1. Delete Database Records
        console.log('Clearing database collections...');
        
        const reportResult = await Report.deleteMany({});
        console.log(`- Deleted ${reportResult.deletedCount} reports`);

        const matchResult = await Match.deleteMany({});
        console.log(`- Deleted ${matchResult.deletedCount} matches`);

        const claimResult = await Claim.deleteMany({});
        console.log(`- Deleted ${claimResult.deletedCount} claims`);

        // Only delete notifications related to reports/claims (match_found, claim_received, etc.)
        // or just delete all if we want a clean slate for the user.
        // Given the request "remove all lost and found reports data", we'll clear all related notifications.
        const notificationResult = await Notification.deleteMany({
            type: { $in: ['match_found', 'claim_received', 'claim_accepted', 'claim_rejected', 'item_resolved'] }
        });
        console.log(`- Deleted ${notificationResult.deletedCount} item-related notifications`);

        // 2. Clear Local Uploads
        console.log('Cleaning up local uploads directory...');
        const uploadsDir = path.join(__dirname, '../public/uploads');
        if (fs.existsSync(uploadsDir)) {
            const files = fs.readdirSync(uploadsDir);
            let deletedFiles = 0;
            for (const file of files) {
                // Keep .gitkeep if it exists, otherwise delete everything
                if (file !== '.gitkeep') {
                    fs.unlinkSync(path.join(uploadsDir, file));
                    deletedFiles++;
                }
            }
            console.log(`- Deleted ${deletedFiles} image files from public/uploads`);
        } else {
            console.log('- Uploads directory not found, skipping filesystem cleanup');
        }

        console.log('\nSUCCESS: All lost and found data has been wiped.');
        process.exit(0);
    } catch (error) {
        console.error('CRITICAL ERROR during data wipe:', error.message);
        process.exit(1);
    }
}

wipeData();
