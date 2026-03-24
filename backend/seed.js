const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Mark = require('./models/Mark');

// Attempt to connect
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/marks-system')
.then(async () => {
    console.log('Connected to MongoDB. Starting data migration...');
    
    // Read old data
    const dataPath = path.join(__dirname, 'data.json');
    if (!fs.existsSync(dataPath)) {
        console.log('No data.json found. Skipping migration.');
        process.exit(0);
    }
    
    const rawData = fs.readFileSync(dataPath, 'utf8');
    let marksData = [];
    try {
        marksData = JSON.parse(rawData);
    } catch (e) {
        console.error('Error parsing data.json:', e);
        process.exit(1);
    }
    
    if (marksData.length === 0) {
        console.log('data.json was empty. Exiting.');
        process.exit(0);
    }

    try {
        // Clear old database marks table first (optional, but prevents Duplicate Key errors on ID)
        await Mark.deleteMany({});
        console.log('Cleared existing MongoDB Mark records.');

        // Insert fresh records
        await Mark.insertMany(marksData);
        console.log(`Successfully migrated ${marksData.length} records from data.json to MongoDB!`);
    } catch (e) {
        console.error('Error inserting into MongoDB:', e);
    } finally {
        // Disconnect safely
        mongoose.disconnect();
        process.exit(0);
    }
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
