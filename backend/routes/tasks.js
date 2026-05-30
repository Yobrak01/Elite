const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET api/tasks
// @desc    Get all tasks for the logged-in user
// @access  Private
router.get('/', protect, taskController.getTasks);

// @route   POST api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', protect, taskController.createTask);

// @route   PUT api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', protect, taskController.updateTask);

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', protect, taskController.deleteTask);

// @route   PUT api/tasks/:id/complete
// @desc    Mark task as completed
// @access  Private
router.put('/:id/complete', protect, taskController.completeTask);

module.exports = router;