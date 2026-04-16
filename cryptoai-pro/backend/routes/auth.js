const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyOTP,
  enable2FA,
  verify2FA,
  getMe,
  googleLogin
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/google', googleLogin);
router.post('/enable-2fa', protect, enable2FA);
router.post('/verify-2fa', protect, verify2FA);
router.get('/me', protect, getMe);

module.exports = router;