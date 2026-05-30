const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET api/analytics
// @desc    Get analytics for the logged-in user
// @access  Private
router.get('/', protect, analyticsController.getAnalytics);

// @route   GET api/analytics/weekly
// @desc    Get weekly analytics for charts
// @access  Private
router.get('/weekly', protect, analyticsController.getWeeklyAnalytics);

module.exports = router;