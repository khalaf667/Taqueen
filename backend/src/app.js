const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Body Parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Taqueen API is running' });
});

// API Routes
const apiPrefix = process.env.API_PREFIX || '/api/v1';

app.use(`${apiPrefix}/auth`, require('./routes/authRoutes'));
app.use(`${apiPrefix}/users`, authMiddleware, require('./routes/userRoutes'));
app.use(`${apiPrefix}/companies`, authMiddleware, require('./routes/companyRoutes'));
app.use(`${apiPrefix}/branches`, authMiddleware, require('./routes/branchRoutes'));
app.use(`${apiPrefix}/menu`, authMiddleware, require('./routes/menuRoutes'));
app.use(`${apiPrefix}/orders`, authMiddleware, require('./routes/orderRoutes'));
app.use(`${apiPrefix}/tables`, authMiddleware, require('./routes/tableRoutes'));
app.use(`${apiPrefix}/inventory`, authMiddleware, require('./routes/inventoryRoutes'));
app.use(`${apiPrefix}/dashboard`, authMiddleware, require('./routes/dashboardRoutes'));
app.use(`${apiPrefix}/staff`, authMiddleware, require('./routes/staffRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Error Handler (Must be last)
app.use(errorHandler);

module.exports = app;
