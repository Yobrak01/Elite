const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, major, currentSemester, gpa } = req.body;

    // Build user object
    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;
    if (major) userFields.major = major;
    if (currentSemester) userFields.currentSemester = currentSemester;
    if (gpa) userFields.gpa = gpa;

    let user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update user mode (Normal, CAT Preparation, etc.)
// @route   PUT /api/user/mode
// @access  Private
exports.updateMode = async (req, res) => {
  try {
    const { currentMode } = req.body;

    // Validate mode
    const validModes = ['Normal', 'CAT Preparation', 'Exam Preparation', 'Recovery', 'Unexpected Event'];
    if (!validModes.includes(currentMode)) {
      return res.status(400).json({ msg: 'Invalid mode' });
    }

    let user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { currentMode } },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update user's focus score and burnout risk (usually done via analytics)
// @route   PUT /api/user/metrics
// @access  Private
exports.updateMetrics = async (req, res) => {
  try {
    const { focusScore, burnoutRisk, streak, totalStudyHours } = req.body;

    let user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          focusScore, 
          burnoutRisk, 
          streak, 
          totalStudyHours 
        } 
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};