const dotenv = require('dotenv');
const path = require('path');

// Resolve and configure environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Validate required environment variables during server startup
const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`\n❌ STARTUP ERROR: Missing required environment variables: [${missingEnv.join(', ')}]`);
  console.error('Please check your backend .env file configuration.\n');
  process.exit(1);
}

const app = require('./app');
const { connectDatabase } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Log initialization and run database connection
connectDatabase();

const server = app.listen(PORT, () => {
  console.log(`🚀 PrepAI Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('CRITICAL: Unhandled Promise Rejection! Shutting down server... Details:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('CRITICAL: Uncaught Exception! Shutting down server... Details:', err.message);
  process.exit(1);
});
