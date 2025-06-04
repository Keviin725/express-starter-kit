const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const EmailService = require('../services/EmailService');

// Helper function to generate tokens
const generateToken = () => crypto.randomBytes(32).toString('hex');

// Helper function to generate JWT
const generateJWT = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { phone, email, password, name } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ $or: [{ phone }, { email }] });
    if (userExists) {
      return res.status(400).json({ 
        msg: userExists.phone === phone ? 'Phone number already registered.' : 'Email already registered.' 
      });
    }

    // Create verification token
    const verificationToken = generateToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      phone,
      email,
      name,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires
    });

    await user.save();

    // Send verification email
    await EmailService.sendVerificationEmail(email, verificationToken);

    // Generate tokens
    const { accessToken, refreshToken } = generateJWT(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({ 
      accessToken, 
      refreshToken,
      user: { 
        id: user._id, 
        phone, 
        email,
        name,
        isVerified: false
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Error registering user.' });
  }
};

exports.login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ msg: 'User not found.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid password.' });

    // Generate new tokens
    const { accessToken, refreshToken } = generateJWT(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ 
      accessToken, 
      refreshToken,
      user: { 
        id: user._id, 
        phone, 
        email: user.email,
        name: user.name,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Error during login.' });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired verification token.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ msg: 'Email verified successfully.' });
  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({ msg: 'Error verifying email.' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    const resetToken = generateToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    try {
      await EmailService.sendPasswordResetEmail(email, resetToken);
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      return res.status(500).json({ msg: 'Failed to send password reset email.' });
    }

    res.json({ msg: 'Password reset email sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ msg: 'Error processing password reset.' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired reset token.' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: 'Password reset successful.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ msg: 'Error resetting password.' });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ msg: 'Refresh token required.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ msg: 'Invalid refresh token.' });
    }

    const tokens = generateJWT(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json(tokens);
  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(401).json({ msg: 'Invalid refresh token.' });
  }
};
