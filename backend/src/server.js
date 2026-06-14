require('dotenv').config();
const http = require('http');
const app = require('./app');
const socketHandler = require('./sockets/socketHandler');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);

// Initialize Socket.io
socketHandler(server);

server.listen(PORT, HOST, () => {
  logger.info(`✅ Taqueen Server running on ${HOST}:${PORT}`);
  logger.info(`📡 Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

module.exports = server;
