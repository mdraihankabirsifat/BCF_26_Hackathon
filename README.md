# LabShare - BUET CSE Lab Report Platform

A full-stack web application for BUET CSE students to share and discover lab reports. Built for a 10-hour hackathon using Node.js, Express, and Tailwind CSS.

## Project Goal

A platform for students to share lab reports and study resources, making it easy to discover and access course materials.

## Features

- ✅ **Create Reports**: Submit lab reports with title, course code, description, and links
- ✅ **View Reports**: Browse all submitted reports in a clean, modern interface
- ✅ **RESTful API**: Backend API with Create and Read operations
- ✅ **Modern UI**: Beautiful, responsive design using Tailwind CSS
- ✅ **JSON Database**: Simple file-based storage (no cloud setup needed)

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, JavaScript, Tailwind CSS (CDN)
- **Database**: JSON file (db.json)
- **API Communication**: Fetch API

## Project Structure

```
.
├── server.js          # Main Express server and route configuration
├── database.js        # Database module for JSON file operations
├── routes.js          # API route handlers (Create & Read)
├── db.json            # JSON database file (auto-created)
├── package.json       # Project dependencies
├── public/            # Frontend files
│   ├── index.html     # Landing page with reports display
│   ├── submit.html    # Form page for submitting reports
│   └── app.js         # Frontend JavaScript for API calls
└── README.md          # This file
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   ```
   http://localhost:3000
   ```

## API Endpoints

### GET `/api/reports`
Retrieve all lab reports.

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "1234567890",
      "title": "Data Structures Lab 1",
      "course": "CSE 2201",
      "author": "John Doe",
      "description": "Array operations implementation",
      "link": "https://drive.google.com/...",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### POST `/api/reports`
Create a new lab report.

**Request Body:**
```json
{
  "title": "Data Structures Lab 1",
  "course": "CSE 2201",
  "author": "John Doe",
  "description": "Array operations implementation",
  "link": "https://drive.google.com/..."
}
```

**Required Fields:** `title`, `course`, `author`

**Response:**
```json
{
  "success": true,
  "message": "Report created successfully",
  "data": {
    "id": "1234567890",
    "title": "Data Structures Lab 1",
    ...
  }
}
```

## Code Architecture

### Backend Modules

- **`server.js`**: Sets up Express server, middleware, and route mounting
- **`database.js`**: Handles all database operations (read/write JSON file)
- **`routes.js`**: Contains API route handlers with validation and error handling

### Frontend Files

- **`index.html`**: Landing page with navigation, hero section, and reports grid
- **`submit.html`**: Form page for submitting new reports
- **`app.js`**: Frontend JavaScript with API functions and DOM manipulation

## How It Works

1. **Database**: The `database.js` module reads/writes to `db.json` file
2. **API Routes**: `routes.js` handles GET and POST requests
3. **Frontend**: Uses Fetch API to communicate with backend endpoints
4. **UI Updates**: JavaScript dynamically updates the DOM based on API responses

## Customization

- **Change Port**: Set `PORT` environment variable or modify `server.js`
- **Add Fields**: Update form in `submit.html`, API validation in `routes.js`, and database schema
- **Styling**: Modify Tailwind classes in HTML files or add custom CSS

## Notes

- The server runs on port 3000 by default
- Database file (`db.json`) is automatically created on first run
- All code is well-commented for easy understanding and modification
- Perfect for hackathon projects - minimal setup, maximum functionality!

## License

ISC
