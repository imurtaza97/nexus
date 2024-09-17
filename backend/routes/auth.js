const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); 

// POST /api/signup
router.post('/signup', authController.registerUser);

// POST /api/login
router.post('/login', authController.loginUser);

// GET /api/dashboard
router.get('/dashboard', authMiddleware, authController.dashboard); // Protect route with authMiddleware if needed

// GET /api/get-user-details
router.get('/user-details',authMiddleware , authController.getUserDetails);

module.exports = router;