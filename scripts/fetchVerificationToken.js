require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const fetchVerificationToken = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ phone: '+14155552671' });
    console.log('Verification Token:', user.verificationToken);
    process.exit(0);
  } catch (error) {
    console.error('Error fetching verification token:', error);
    process.exit(1);
  }
};

fetchVerificationToken();
