// server/routes/paymentRoutes.js
const express = require('express');
const { createOrder, verifyPayment, GenerateDownloadInvoice } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware'); 
const router = express.Router();

// POST /api/create-order
router.post('/create-order', authMiddleware ,createOrder);

// POST /api/verify-payment
router.post('/verify-payment', verifyPayment);

// GET /api/download-invoice
router.get('/download-invoice/:id', GenerateDownloadInvoice);

module.exports = router;
