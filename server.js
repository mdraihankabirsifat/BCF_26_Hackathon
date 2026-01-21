const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Route for Hello World page with current time
app.get('/', (req, res) => {
  const currentTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hello World - Hackathon Practice</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
        }
        .container {
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 3rem 4rem;
          border-radius: 20px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        .time {
          font-size: 1.5rem;
          margin-top: 2rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          display: inline-block;
        }
        .subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-top: 0.5rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Hello World!</h1>
        <p class="subtitle">Welcome to your Hackathon Practice Project</p>
        <div class="time">
          <strong>Current Time:</strong><br>
          ${currentTime}
        </div>
      </div>
    </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📅 Started at: ${new Date().toLocaleString()}`);
});
