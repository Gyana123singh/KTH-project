const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');

// Route imports
const authRoutes = require('./routes/authRoutes');
const talentRoutes = require('./routes/talentRoutes');
const employerRoutes = require('./routes/employerRoutes');
const publicRoutes = require('./routes/publicRoutes');
const voiceRoutes = require('./routes/voiceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO real-time server
initSocket(server);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Kitchen Talent Hub (KTH) Backend API',
    realtime: 'Socket.IO Enabled',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/talent', talentRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Server Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 KTH Backend API Server running on port ${PORT}`);
  console.log(`⚡ Real-time Socket.IO Server active`);
  console.log(`🌐 Public Open Discovery Endpoint: http://localhost:${PORT}/api/public/talent/search`);
  console.log(`🛡️ Admin API Endpoint: http://localhost:${PORT}/api/admin/dashboard/stats`);
  console.log(`===================================================`);
});

module.exports = app;
