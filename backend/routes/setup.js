const express = require('express');
const router = express.Router();
const setupController = require('../controllers/setupController');
const authMiddleware = require('../middleware/authMiddleware'); 


router.post('/',authMiddleware ,setupController.setupAccount);

module.exports = router;
