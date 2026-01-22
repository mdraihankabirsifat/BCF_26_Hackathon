/**
 * Database Module
 * Handles all database operations using a local JSON file
 * This is a mock database for hackathon purposes
 */

const fs = require('fs').promises;
const path = require('path');

// Path to the database file
const DB_PATH = path.join(__dirname, 'db.json');

/**
 * Read all data from the database
 * @returns {Promise<Object>} The database object
 */
async function readDB() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is empty, return default structure
        if (error.code === 'ENOENT') {
            const defaultData = { reports: [] };
            await writeDB(defaultData);
            return defaultData;
        }
        throw error;
    }
}

/**
 * Write data to the database
 * @param {Object} data - The data object to write
 */
async function writeDB(data) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Get all reports from the database
 * @returns {Promise<Array>} Array of all reports
 */
async function getAllReports() {
    const db = await readDB();
    return db.reports;
}

/**
 * Add a new report to the database
 * @param {Object} report - The report object to add
 * @returns {Promise<Object>} The added report with generated ID
 */
async function addReport(report) {
    const db = await readDB();

    // Generate a unique ID (simple timestamp-based ID for hackathon)
    const newReport = {
        id: Date.now().toString(),
        ...report,
        createdAt: new Date().toISOString()
    };

    db.reports.push(newReport);
    await writeDB(db);

    return newReport;
}

module.exports = {
    getAllReports,
    addReport
};
