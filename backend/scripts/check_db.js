require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function checkData() {
    try {
        console.log('Connecting to Atlas...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const collections = ['users', 'items', 'claims'];
        const results = {};

        for (const colName of collections) {
            const count = await mongoose.connection.db.collection(colName).countDocuments();
            const samples = await mongoose.connection.db.collection(colName).find().limit(3).toArray();
            results[colName] = { count, samples };
        }

        console.log('\n--- DATABASE SUMMARY ---');
        for (const [name, data] of Object.entries(results)) {
            console.log(`\nCollection: ${name.toUpperCase()}`);
            console.log(`Total Documents: ${data.count}`);
            if (data.count > 0) {
                console.log('Sample Data:');
                console.log(JSON.stringify(data.samples, null, 2));
            } else {
                console.log('Empty collection.');
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error checking data:', error.message);
        process.exit(1);
    }
}

checkData();
