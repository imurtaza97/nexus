const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Example of a protected route
router.get('/dashboard', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Welcome to the dashboard', user: req.user });
});

module.exports = router;
