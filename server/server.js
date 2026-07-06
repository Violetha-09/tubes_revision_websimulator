require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { initPrisma } = require('./db');
const apiRoutes = require('./src/routes');
const errorMiddleware = require('./src/middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ type: ['application/json', 'text/plain'] }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Multipart/form-data parsing fallback for Postman
app.use((req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      const boundaryMatch = contentType.match(/boundary=(.+)$/);
      if (boundaryMatch) {
        const boundary = '--' + boundaryMatch[1];
        const parts = data.split(boundary);
        req.body = req.body || {};
        for (const part of parts) {
          if (part.includes('name="')) {
            const nameMatch = part.match(/name="([^"]+)"/);
            if (nameMatch) {
              const name = nameMatch[1];
              const headerEnd = part.indexOf('\r\n\r\n');
              if (headerEnd !== -1) {
                let value = part.substring(headerEnd + 4);
                // Remove trailing CRLF and boundary markers
                if (value.endsWith('\r\n')) {
                  value = value.substring(0, value.length - 2);
                }
                const cleanValue = value.split('\r\n')[0].trim();
                req.body[name] = cleanValue;
              }
            }
          }
        }
      }
      next();
    });
  } else {
    next();
  }
});

// Initialize Database connection on start
initPrisma();

app.get('/', (req, res) => {
  res.json({
    message: "Tubes World Cup Web Simulator Backend API is running!",
    endpoints: {
      "GET /api/teams": "Get all teams",
      "GET /api/matches": "Get all matches",
      "POST /api/matches/reset": "Reset all tournament data",
      "POST /api/matches/simulate-group": "Simulate unplayed group stage matches",
      "POST /api/matches/advance-knockout": "Calculate standings and generate knockout bracket",
      "PUT /api/matches/:id": "Update score of a specific match",
      "POST /api/auth/register": "Register a new user/admin",
      "POST /api/auth/login": "Authenticate credentials and set JWT cookie"
    }
  });
});

// Mount modular API routes
app.use('/api', apiRoutes);

// Global Error Handler Middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
