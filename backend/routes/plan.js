const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');

// POST /api/plans
router.post('/', planController.addPlan);

// GET /api/plans
router.get('/', planController.getPlans);

// GET /api/plans/:id
router.get('/:id', planController.getPlanById);

// PUT /api/plans/:id
router.put('/:id', planController.updatePlan);

// DELETE /api/plans/:id
router.delete('/:id', planController.deletePlan);

module.exports = router;
