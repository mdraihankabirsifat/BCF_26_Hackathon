/**
 * Main Server File
 * Express server setup and route configuration
 */

const express = require('express');
const path = require('path');
const { getReports, createReport } = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Parse JSON request bodies
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static('public'));

// API Routes
// GET endpoint: Retrieve all reports
app.get('/api/reports', getReports);

// POST endpoint: Create a new report
app.post('/api/reports', createReport);

// Root route - serve the landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📅 Started at: ${new Date().toLocaleString()}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   GET  /api/reports - Get all reports`);
  console.log(`   POST /api/reports - Create a new report`);
});
