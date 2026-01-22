/**
 * API Routes Module
 * Handles all API endpoints for the application
 */

const { getAllReports, addReport } = require('./database');

/**
 * GET /api/reports
 * Retrieve all lab reports from the database
 */
async function getReports(req, res) {
  try {
    const reports = await getAllReports();
    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message
    });
  }
}

/**
 * POST /api/reports
 * Create a new lab report
 * Expected body: { title, course, description, author, link }
 */
async function createReport(req, res) {
  try {
    const { title, course, description, author, link } = req.body;
    
    // Basic validation
    if (!title || !course || !author) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, course, and author are required'
      });
    }
    
    // Create the report
    const newReport = await addReport({
      title,
      course,
      description: description || '',
      author,
      link: link || ''
    });
    
    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: newReport
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create report',
      error: error.message
    });
  }
}

module.exports = {
  getReports,
  createReport
};
