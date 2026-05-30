const Schedule = require('../models/Schedule');
const User = require('../models/User');

// @desc    Get all schedules for the logged-in user
// @route   GET /api/schedule
// @access  Private
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ user: req.user.id }).sort({ startTime: 1 });
    res.json(schedules);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new schedule
// @route   POST /api/schedule
// @access  Private
exports.createSchedule = async (req, res) => {
  try {
    const { title, description, startTime, endTime, isRecurring, recurrencePattern, daysOfWeek, startDate, endDate, type, color } = req.body;

    const newSchedule = new Schedule({
      user: req.user.id,
      title,
      description,
      startTime,
      endTime,
      isRecurring,
      recurrencePattern,
      daysOfWeek,
      startDate,
      endDate,
      type,
      color
    });

    const schedule = await newSchedule.save();
    res.json(schedule);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a schedule
// @route   PUT /api/schedule/:id
// @access  Private
exports.updateSchedule = async (req, res) => {
  try {
    let schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ msg: 'Schedule not found' });
    }

    // Make sure user owns schedule
    if (schedule.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { title, description, startTime, endTime, isRecurring, recurrencePattern, daysOfWeek, startDate, endDate, type, color, isActive } = req.body;

    // Build schedule object
    const scheduleFields = {};
    if (title) scheduleFields.title = title;
    if (description) scheduleFields.description = description;
    if (startTime) scheduleFields.startTime = startTime;
    if (endTime) scheduleFields.endTime = endTime;
    if (isRecurring !== undefined) scheduleFields.isRecurring = isRecurring;
    if (recurrencePattern) scheduleFields.recurrencePattern = recurrencePattern;
    if (daysOfWeek) scheduleFields.daysOfWeek = daysOfWeek;
    if (startDate) scheduleFields.startDate = startDate;
    if (endDate) scheduleFields.endDate = endDate;
    if (type) scheduleFields.type = type;
    if (color) scheduleFields.color = color;
    if (isActive !== undefined) scheduleFields.isActive = isActive;

    schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { $set: scheduleFields },
      { new: true }
    );

    res.json(schedule);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a schedule
// @route   DELETE /api/schedule/:id
// @access  Private
exports.deleteSchedule = async (req, res) => {
  try {
    let schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ msg: 'Schedule not found' });
    }

    // Make sure user owns schedule
    if (schedule.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Schedule.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Schedule removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};