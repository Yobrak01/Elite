const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Debug: Check if env vars are loaded
console.log('MONGODB_URI from env:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
if (process.env.MONGODB_URI) {
  console.log('MONGODB_URI starts with:', process.env.MONGODB_URI.substring(0, 20) + '...');
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elite97', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('ELITE97 STUDY SYSTEM API');
});

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const scheduleRoutes = require('./routes/schedule');
const analyticsRoutes = require('./routes/analytics');
const userRoutes = require('./routes/user');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});