const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: '"CryptoAI Pro" <no-reply@cryptoai.pro>',
    to,
    subject: 'رمز التحقق - CryptoAI Pro',
    html: `
      <div style="font-family: Arial, sans-serif; background: #0a0a1a; color: #fff; padding: 20px; text-align: center;">
        <h2 style="color: #00ff88;">رمز التحقق</h2>
        <p>رمز التحقق الخاص بك هو:</p>
        <h1 style="letter-spacing: 10px; color: #00d4ff;">${otp}</h1>
        <p>الرمز صالح لمدة 10 دقائق.</p>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
};

exports.sendWelcomeEmail = async (to, name) => {
  const mailOptions = {
    from: '"CryptoAI Pro" <no-reply@cryptoai.pro>',
    to,
    subject: 'مرحباً بك في CryptoAI Pro!',
    html: `<h2>أهلاً ${name}!</h2><p>تم تفعيل حسابك بنجاح. ابدأ التداول الذكي الآن.</p>`
  };
  await transporter.sendMail(mailOptions);
};