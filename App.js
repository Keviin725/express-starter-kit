const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const { generalLimiter } = require('./middlewares/RateLimiter');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Express Auth Starter API is running! ✨');
});

module.exports = app;
