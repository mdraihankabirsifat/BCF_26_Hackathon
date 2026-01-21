/**
 * Frontend JavaScript
 * Handles API communication and DOM manipulation
 */

// ============================================
// API Functions - Handle communication with backend
// ============================================

/**
 * Fetch all reports from the API
 * @returns {Promise<Array>} Array of report objects
 */
async function fetchReports() {
    try {
        const response = await fetch('/api/reports');
        const result = await response.json();

        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.message || 'Failed to fetch reports');
        }
    } catch (error) {
        console.error('Error fetching reports:', error);
        throw error;
    }
}

/**
 * Submit a new report to the API
 * @param {Object} reportData - The report data object
 * @returns {Promise<Object>} The created report object
 */
async function submitReport(reportData) {
    try {
        const response = await fetch('/api/reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reportData)
        });

        const result = await response.json();

        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.message || 'Failed to submit report');
        }
    } catch (error) {
        console.error('Error submitting report:', error);
        throw error;
    }
}

// ============================================
// UI Functions - Handle DOM manipulation
// ============================================

/**
 * Display reports on the landing page
 */
async function displayReports() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const errorMessageEl = document.getElementById('error-message');
    const reportsContainer = document.getElementById('reports-container');
    const emptyState = document.getElementById('empty-state');

    try {
        // Show loading state
        loadingEl.classList.remove('hidden');
        errorEl.classList.add('hidden');
        reportsContainer.innerHTML = '';
        emptyState.classList.add('hidden');

        // Fetch reports from API
        const reports = await fetchReports();

        // Hide loading state
        loadingEl.classList.add('hidden');

        // Check if there are any reports
        if (reports.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        // Display each report as a card
        reports.forEach(report => {
            const reportCard = createReportCard(report);
            reportsContainer.appendChild(reportCard);
        });

    } catch (error) {
        // Show error state
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
        errorMessageEl.textContent = `Error: ${error.message}`;
    }
}

/**
 * Create a report card element
 * @param {Object} report - The report object
 * @returns {HTMLElement} The card element
 */
function createReportCard(report) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition';

    // Format the date
    const date = new Date(report.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    card.innerHTML = `
    <div class="flex items-start justify-between mb-3">
      <h3 class="text-xl font-bold text-gray-800">${escapeHtml(report.title)}</h3>
      <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
        ${escapeHtml(report.course)}
      </span>
    </div>
    
    ${report.description ? `
      <p class="text-gray-600 mb-4 line-clamp-3">${escapeHtml(report.description)}</p>
    ` : ''}
    
    <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
      <span>By ${escapeHtml(report.author)}</span>
      <span>${date}</span>
    </div>
    
    ${report.link ? `
      <a 
        href="${escapeHtml(report.link)}" 
        target="_blank" 
        rel="noopener noreferrer"
        class="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
      >
        View Report
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
        </svg>
      </a>
    ` : ''}
  `;

    return card;
}

/**
 * Handle form submission
 */
function handleFormSubmit() {
    const form = document.getElementById('report-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    if (!form) return; // Form doesn't exist on this page

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');

        // Collect form data
        const formData = new FormData(form);
        const reportData = {
            title: formData.get('title'),
            course: formData.get('course'),
            author: formData.get('author'),
            description: formData.get('description') || '',
            link: formData.get('link') || ''
        };

        try {
            // Submit to API
            await submitReport(reportData);

            // Show success message
            successMessage.classList.remove('hidden');
            form.reset();

        } catch (error) {
            // Show error message
            errorMessage.classList.remove('hidden');
            errorText.textContent = `Error: ${error.message}`;
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Report';
        }
    });
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - The text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Initialize - Run when page loads
// ============================================

// Check which page we're on and initialize accordingly
document.addEventListener('DOMContentLoaded', () => {
    // If we're on the landing page, load and display reports
    if (document.getElementById('reports-container')) {
        displayReports();
    }

    // If we're on the submit page, set up form handler
    if (document.getElementById('report-form')) {
        handleFormSubmit();
    }
});
