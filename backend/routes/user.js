const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, userController.getProfile);

// @route   PUT api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, userController.updateProfile);

// @route   PUT api/user/mode
// @desc    Update user mode
// @access  Private
router.put('/mode', protect, userController.updateMode);

// @route   PUT api/user/metrics
// @desc    Update user metrics (focus score, burnout risk, etc.)
// @access  Private
router.put('/metrics', protect, userController.updateMetrics);

module.exports = router;