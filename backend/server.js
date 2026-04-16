require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const tradeRoutes = require('./routes/trade');
const signalRoutes = require('./routes/signals');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');
const paymentRoutes = require('./routes/payments');
const chatRoutes = require('./routes/chat');
const { protect } = require('./middleware/auth');
const { initSocket } = require('./sockets');
const User = require('./models/User');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Security middleware
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use('/api/', limiter);

// Static folder
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', protect, userRoutes);
app.use('/api/trade', protect, tradeRoutes);
app.use('/api/signals', protect, signalRoutes);
app.use('/api/admin', protect, adminRoutes);
app.use('/api/ai', protect, aiRoutes);
app.use('/api/payments', protect, paymentRoutes);
app.use('/api/chat', protect, chatRoutes);

// Create admin account if not exists
const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin'
      });
      console.log('✅ Admin account created');
    }
  } catch (err) {
    console.error('Admin creation error:', err);
  }
};
createAdmin();

// Socket.io
initSocket(server);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'خطأ في الخادم'
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});