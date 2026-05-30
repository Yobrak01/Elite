const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
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
  course: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  submitted: {
    type: Boolean,
    default: false
  },
  grade: {
    type: Number, // out of 100 or as per grading system
    min: 0,
    max: 100
  },
  // Estimated time to complete
  estimatedHours: {
    type: Number,
    min: 0
  },
  // Actual time spent
  actualHoursSpent: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Assignment', assignmentSchema);