const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
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
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  estimatedHours: {
    type: Number,
    required: true,
    min: 0
  },
  deadline: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  },
  // For engineering students: procedural or theory
  type: {
    type: String,
    enum: ['procedural', 'theory'],
    default: 'theory'
  },
  subject: {
    type: String,
    trim: true
  },
  // Additional fields for tracking
  actualHoursSpent: {
    type: Number,
    default: 0
  },
  // For repetition/spaced repetition
  lastReviewed: {
    type: Date
  },
  reviewInterval: {
    type: Number, // in days
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);