const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['CAT', 'Exam', 'Quiz'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  weight: {
    type: Number, // percentage weight towards final grade
    min: 0,
    max: 100
  },
  syllabus: {
    type: String, // list of topics or reference
    trim: true
  },
  // For countdown
  isUpcoming: {
    type: Boolean,
    default: true
  },
  // Actual score after the exam
  score: {
    type: Number,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exam', examSchema);