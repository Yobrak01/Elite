const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes middleware
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.user.id).select('-password');

      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ msg: 'Not authorized' });
    }
  }

  if (!token) {
    res.status(401).json({ msg: 'Not authorized, no token' });
  }
};