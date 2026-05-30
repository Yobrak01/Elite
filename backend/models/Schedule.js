const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: String, // HH:mm format
    required: true
  },
  endTime: {
    type: String, // HH:mm format
    required: true
  },
  // Recurrence pattern
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    type: String, // daily, weekly, monthly
    enum: ['none', 'daily', 'weekly', 'monthly'],
    default: 'none'
  },
  // For weekly recurrence, which days (0-6, where 0 is Sunday)
  daysOfWeek: [{
    type: Number,
    min: 0,
    max: 6
  }],
  // Specific date for non-recurring or monthly
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  // Schedule type
  type: {
    type: String,
    enum: ['lecture', 'gym', 'exam', 'church', 'personal', 'study', 'break', 'other'],
    default: 'study'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Color for UI representation
  color: {
    type: String,
    default: '#3b82f6' // blue-500
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Schedule', scheduleSchema);