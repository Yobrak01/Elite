const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  // Engineering student specific fields
  gpa: {
    type: Number,
    min: 0,
    max: 4.0,
    default: 0.0
  },
  currentSemester: {
    type: Number,
    default: 1
  },
  major: {
    type: String,
    trim: true
  },
  // Profile settings
  focusScore: {
    type: Number,
    default: 0
  },
  burnoutRisk: {
    type: String,
    enum: ['Low', 'Moderate', 'High'],
    default: 'Low'
  },
  streak: {
    type: Number,
    default: 0
  },
  totalStudyHours: {
    type: Number,
    default: 0
  },
  // Modes
  currentMode: {
    type: String,
    enum: ['Normal', 'CAT Preparation', 'Exam Preparation', 'Recovery', 'Unexpected Event'],
    default: 'Normal'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);