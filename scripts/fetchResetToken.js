require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const fetchResetToken = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ phone: '+14155552671' });
    console.log('Reset Password Token:', user.resetPasswordToken);
    process.exit(0);
  } catch (error) {
    console.error('Error fetching reset token:', error);
    process.exit(1);
  }
};

fetchResetToken();
