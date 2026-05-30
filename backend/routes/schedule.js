const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET api/schedule
// @desc    Get all schedules for the logged-in user
// @access  Private
router.get('/', protect, scheduleController.getSchedules);

// @route   POST api/schedule
// @desc    Create a new schedule
// @access  Private
router.post('/', protect, scheduleController.createSchedule);

// @route   PUT api/schedule/:id
// @desc    Update a schedule
// @access  Private
router.put('/:id', protect, scheduleController.updateSchedule);

// @route   DELETE api/schedule/:id
// @desc    Delete a schedule
// @access  Private
router.delete('/:id', protect, scheduleController.deleteSchedule);

module.exports = router;