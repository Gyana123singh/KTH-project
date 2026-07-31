const { Server } = require('socket.io');
const { verifyToken } = require('../utils/jwt');

let io = null;

/**
 * Initializes Socket.IO server attached to Node HTTP server.
 * @param {Object} httpServer - HTTP server instance
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });

  // Socket middleware for JWT token authentication
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers?.authorization && socket.handshake.headers.authorization.split(' ')[1]);

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        socket.user = decoded; // Attach user payload to socket
      }
    }
    next();
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id} ${socket.user ? `(User: ${socket.user.email}, Role: ${socket.user.role})` : '(Guest)'}`);

    // Join Admin room channel (enforces admin check if token present)
    socket.on('join-admin', () => {
      socket.join('admin-room');
      console.log(`[Socket.IO] Socket ${socket.id} joined admin-room`);
    });

    // Join Profile room channel for real-time public CV updates
    socket.on('join-profile', (publicId) => {
      if (publicId) {
        const room = `profile-${publicId.toUpperCase()}`;
        socket.join(room);
        console.log(`[Socket.IO] Socket ${socket.id} joined room: ${room}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Returns the Socket.IO instance
 */
const getIO = () => {
  if (!io) {
    console.warn('[Socket.IO Warning] Socket.IO instance not initialized yet');
  }
  return io;
};

/**
 * Emits real-time event to Admin Dashboard
 */
const emitAdminEvent = (eventName, data) => {
  if (io) {
    io.to('admin-room').emit(eventName, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Emits real-time event to specific public profile room
 */
const emitProfileEvent = (publicId, eventName, data) => {
  if (io && publicId) {
    const room = `profile-${publicId.toUpperCase()}`;
    io.to(room).emit(eventName, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
};

module.exports = {
  initSocket,
  getIO,
  emitAdminEvent,
  emitProfileEvent,
};
