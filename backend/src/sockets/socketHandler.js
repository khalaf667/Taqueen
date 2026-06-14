const socketIO = require('socket.io');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');

const socketHandler = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:3000',
      credentials: true
    },
    pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL) || 25000,
    pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT) || 60000
  });

  // Middleware: Authenticate socket connection
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication failed'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  // Connection
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.userId}`);

    // Join branch room
    socket.on('join_branch', (branchId) => {
      socket.join(`branch_${branchId}`);
      logger.info(`User ${socket.userId} joined branch ${branchId}`);
    });

    // Order events
    socket.on('order:created', (data) => {
      io.to(`branch_${data.branchId}`).emit('order:new', data);
      logger.info(`Order created: ${data.orderId}`);
    });

    socket.on('order:status_changed', (data) => {
      io.to(`branch_${data.branchId}`).emit('order:updated', data);
      logger.info(`Order status changed: ${data.orderId} -> ${data.status}`);
    });

    // KDS events
    socket.on('kds:order_received', (data) => {
      io.to(`branch_${data.branchId}`).emit('kds:new_order', data);
    });

    socket.on('kds:order_prepared', (data) => {
      io.to(`branch_${data.branchId}`).emit('kds:order_ready', data);
    });

    // Table events
    socket.on('table:status_changed', (data) => {
      io.to(`branch_${data.branchId}`).emit('table:updated', data);
      logger.info(`Table status changed: ${data.tableId} -> ${data.status}`);
    });

    // Inventory events
    socket.on('inventory:stock_low', (data) => {
      io.to(`branch_${data.branchId}`).emit('inventory:alert', data);
      logger.warn(`Low stock alert: ${data.ingredientName}`);
    });

    // Dashboard events
    socket.on('dashboard:metrics_updated', (data) => {
      io.to(`branch_${data.branchId}`).emit('dashboard:update', data);
    });

    // Disconnect
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userId}`);
    });

    // Error handling
    socket.on('error', (error) => {
      logger.error(`Socket error for user ${socket.userId}:`, error);
    });
  });

  return io;
};

module.exports = socketHandler;
