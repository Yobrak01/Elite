const mongoose = require('mongoose');

const weakTopicSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    trim: true
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  weaknessLevel: {
    type: Number, // 0-100, higher means weaker
    min: 0,
    max: 100,
    default: 50
  },
  // Last time this topic was assessed or reviewed
  lastAssessed: {
    type: Date,
    default: Date.now
  },
  // Notes or resources for improvement
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WeakTopic', weakTopicSchema);