const mongoose = require('mongoose');
const crypto = require('crypto');

const ApiKeySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exchange: { type: String, required: true },
  apiKey: { type: String, required: true },
  secret: { type: String, required: true },
  password: String,
  whitelistIPs: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// تشفير المفتاح السري قبل الحفظ
ApiKeySchema.pre('save', function(next) {
  if (!this.isModified('secret')) return next();
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(this.secret, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  this.secret = encrypted;
  next();
});

// فك التشفير
ApiKeySchema.methods.decryptSecret = function() {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let decrypted = decipher.update(this.secret, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = mongoose.model('ApiKey', ApiKeySchema);