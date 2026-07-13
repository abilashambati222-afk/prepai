const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const path = require('path');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const jobDescriptionRoutes = require('./routes/jobDescriptionRoutes');
const careerRoutes = require('./routes/careerRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploaded resume files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Development request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes'
  }
});
app.use('/api', limiter);

// Core API Health Route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'PrepAI API Server is healthy.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Mount Authentication Router
app.use('/api/v1/auth', authRoutes);

// Mount Profile Router
app.use('/api/v1/profile', profileRoutes);

// Mount Dashboard Router
app.use('/api/v1/dashboard', dashboardRoutes);

// Mount Resume Router
app.use('/api/v1/resume', resumeRoutes);

// Mount Job Description Router
app.use('/api/v1/job-descriptions', jobDescriptionRoutes);

// Mount Career Router
app.use('/api/v1/career', careerRoutes);

// Mount Interview Router
app.use('/api/v1/interview', interviewRoutes);

// Fallback Route Handler (404)
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'API endpoint not found',
      status: 404
    }
  });
});

// Centralized Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
