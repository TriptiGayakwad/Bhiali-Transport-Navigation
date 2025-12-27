const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bhilai Transport API is running' });
});

// API routes
app.use('/api/routes', require('./routes/routes'));
app.use('/api/users', require('./routes/users'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/transport', require('./routes/transport'));
app.use('/api/railway', require('./routes/railway'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Bhilai Transport API running on port ${PORT}`);
});

module.exports = app;