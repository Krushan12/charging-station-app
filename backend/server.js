const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/db');
const ErrorResponse = require('./utils/errorResponse');

const authRoutes = require('./routes/authRoutes');
const chargingStationRoutes = require('./routes/chargingStationRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'https://charging-station-app.vercel.app',
    'http://localhost:5173',
    'http://localhost:4173' // Vite preview port
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://charging-station-app.vercel.app", "http://localhost:5173"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/charging-stations', chargingStationRoutes);

// Add a route handler for the root path
app.get('/', (req, res) => {
  res.send('Charging Station Backend is running!');
});

// Add a route handler for favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Add a route handler for Chrome DevTools request
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => res.status(204).end());

// 404 handler
app.use((req, res, next) => {
  next(new ErrorResponse(`Not found - ${req.originalUrl}`, 404));
});

// Error handling middleware
app.use((err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err.stack);

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
});

// Connect to MongoDB Atlas
mongoose.connect(config.mongoURI, config.options)
.then(() => console.log('Successfully connected to MongoDB Atlas'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('Please check:');
  console.error('1. Your MongoDB Atlas IP whitelist');
  console.error('2. Your connection string format');
  console.error('3. Your database credentials');
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});