const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 0
  },
  focusScore: {
    type: Number, // 0-100
    min: 0,
    max: 100
  },
  date: {
    type: Date,
    default: Date.now
  },
  // Notes about the session
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StudySession', studySessionSchema);