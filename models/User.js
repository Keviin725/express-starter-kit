const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    refreshToken: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
