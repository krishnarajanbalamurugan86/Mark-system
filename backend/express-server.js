require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const cors = require('cors'); // We need cors to communicate with React
const mongoose = require('mongoose');
const Mark = require('./models/Mark');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/marks-system')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const app = express();
const port = process.env.PORT || 3000;
const apiSecret = process.env.API_SECRET_KEY;

class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter();

myEmitter.on('requestReceived', (url) => {
    // Append to a log file
    const logData = `[${new Date().toISOString()}] Request received on: ${url} (Secret Loaded: ${!!apiSecret})\n`;
    fs.appendFile(path.join(__dirname, 'server.log'), logData, (err) => {
        if (err) console.error('Error writing to log file', err);
    });
});

// Middleware
app.use(express.json());
app.use(cors()); // default cors for React app
app.use((req, res, next) => {
    myEmitter.emit('requestReceived', req.url);
    next();
});
app.use(express.static(path.join(__dirname, "public")));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "public/dist/index.html"));
});

// Serve frontend-vanilla statically (already existing usage of express.static)
app.use('/vanilla', express.static(path.join(__dirname, '../frontend-vanilla')));

// [USER REQUEST]: use express.static
// Adding another express.static just to explicitly serve an 'assets' folder (even if it doesn't exist yet)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve React production build
app.use('/react', express.static(path.join(__dirname, '../frontend-react/dist')));
// SPA routing fallback for React
app.get(/^\/react(?:\/.*)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend-react/dist/index.html'));
});

// Serve Angular production build
app.use('/angular', express.static(path.join(__dirname, '../frontend-angular/dist/frontend-angular/browser')));
// SPA routing fallback for Angular
app.get(/^\/angular(?:\/.*)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend-angular/dist/frontend-angular/browser/index.html'));
});

// Home Route Redirect
app.get('/', (req, res) => {
    res.redirect('/react'); // Let's redirect home to React for convenience
});

// API Route for Marks Data (JSON)
app.get('/api/marks', async (req, res) => {
    try {
        const marks = await Mark.find({});
        res.setHeader('Content-Type', 'application/json');
        res.json(marks);
    } catch (err) {
        console.error('Error fetching marks from DB:', err);
        res.status(500).send('Error reading internal data');
    }
});

const crypto = require('crypto'); // [USER REQUEST]: require crypto

// API Route for POSTing new Marks Data
app.post('/api/marks', async (req, res) => {
    try {
        const newRecord = req.body;
        if (!newRecord.id) newRecord.id = Date.now();

        // [USER REQUEST]: use crypto.createHash
        // We hash the student's name + id to create a unique signature, without affecting the existing frontend display
        newRecord.signatureHash = crypto.createHash('sha256').update(newRecord.studentName + newRecord.id).digest('hex');

        const mark = new Mark(newRecord);
        await mark.save();

        res.status(201).json(mark);
    } catch (err) {
        console.error('Error saving mark to DB:', err);
        res.status(500).send('Error saving data');
    }
});

// API Route for XML Data
app.get('/api/marks-xml', (req, res) => {
    fs.readFile(path.join(__dirname, 'data.xml'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading XML data');
            return;
        }
        res.setHeader('Content-Type', 'application/xml');
        res.send(data);
    });
});

// Send File explicit example
app.get('/manual-file', (req, res) => {
    // absolute path using __dirname
    res.sendFile(path.join(__dirname, '../frontend-vanilla/index.html'));
});

// Fallback Route / 404
app.use((req, res) => {
    res.status(404).send('<h1>404 Page Not Found</h1>');
});

// Start Server
app.listen(port, () => {
    console.log(`Express server running on http://localhost:${port}`);
    console.log(`Loaded API Secret: ${apiSecret ? 'Yes' : 'No'}`);

    // Demonstrate basic fs synchronous operation on startup
    if (!fs.existsSync(path.join(__dirname, 'server.log'))) {
        fs.writeFileSync(path.join(__dirname, 'server.log'), 'Server Log initialized.\n');
    }
});
