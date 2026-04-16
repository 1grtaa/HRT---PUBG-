const User = require('../models/User');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { sendOTPEmail, sendWelcomeEmail } = require('../services/emailService');
const crypto = require('crypto');

// توليد OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// @desc    تسجيل مستخدم جديد
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجل مسبقاً' });
    }
    const otp = generateOTP();
    user = await User.create({
      name,
      email,
      password,
      phone,
      otpCode: otp,
      otpExpires: Date.now() + 10 * 60 * 1000 // 10 دقائق
    });
    await sendOTPEmail(email, otp);
    res.status(201).json({ success: true, message: 'تم إنشاء الحساب. تحقق من بريدك الإلكتروني للرمز.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    تسجيل الدخول
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
    }
    if (user.twoFactorEnabled) {
      return res.status(200).json({ success: true, require2FA: true, userId: user._id });
    }
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    تحقق من OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otpCode: otp, otpExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'رمز التحقق غير صحيح أو منتهي' });
    }
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// دالة إرسال الـ Token
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      userId: user.userId,
      plan: user.plan,
      level: user.level,
      xp: user.xp,
      role: user.role,
      avatar: user.avatar
    }
  });
};

// @desc    تفعيل 2FA
exports.enable2FA = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({ name: `CryptoAI (${req.user.email})` });
    req.user.twoFactorSecret = secret.base32;
    await req.user.save();
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
    res.status(200).json({ success: true, secret: secret.base32, qrCodeUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    تحقق من رمز 2FA
exports.verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const verified = speakeasy.totp.verify({
      secret: req.user.twoFactorSecret,
      encoding: 'base32',
      token
    });
    if (!verified) {
      return res.status(400).json({ success: false, message: 'رمز 2FA غير صحيح' });
    }
    req.user.twoFactorEnabled = true;
    await req.user.save();
    res.status(200).json({ success: true, message: 'تم تفعيل المصادقة الثنائية بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    الحصول على بيانات المستخدم الحالي
exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

// @desc    تسجيل الدخول عبر Google (مبسط)
exports.googleLogin = async (req, res) => {
  // تحتاج إلى مكتبة google-auth-library
  // هذا مثال مبسط
  const { googleToken } = req.body;
  // التحقق من الـ token وجلب البيانات ...
  res.status(501).json({ message: 'يتم تطويرها' });
};