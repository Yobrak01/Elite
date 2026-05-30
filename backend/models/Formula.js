const mongoose = require('mongoose');

const formulaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  // The formula itself (could be LaTeX or plain text)
  formula: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    trim: true
  },
  // For spaced repetition
  lastReviewed: {
    type: Date
  },
  reviewInterval: {
    type: Number, // in days
    default: 1
  },
  nextReview: {
    type: Date
  },
  masteryLevel: {
    type: Number, // 0-100
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Formula', formulaSchema);