const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, estimatedHours, deadline, type, subject } = req.body;

    const newTask = new Task({
      user: req.user.id,
      title,
      description,
      priority,
      estimatedHours,
      deadline,
      type,
      subject
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { title, description, priority, estimatedHours, deadline, completed, type, subject } = req.body;

    // Build task object
    const taskFields = {};
    if (title) taskFields.title = title;
    if (description) taskFields.description = description;
    if (priority) taskFields.priority = priority;
    if (estimatedHours) taskFields.estimatedHours = estimatedHours;
    if (deadline) taskFields.deadline = deadline;
    if (completed !== undefined) taskFields.completed = completed;
    if (type) taskFields.type = type;
    if (subject) taskFields.subject = subject;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Task.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Mark task as completed
// @route   PUT /api/tasks/:id/complete
// @access  Private
exports.completeTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    task.completed = true;
    await task.save();

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};