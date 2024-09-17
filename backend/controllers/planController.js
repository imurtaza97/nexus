const Plan = require('../models/Plan');

const planController = {
  // Add a new plan
  async addPlan(req, res) {
    try {
      const { name, description, price, duration, features, isActive } = req.body;

      // Create a new plan
      const newPlan = new Plan({
        name,
        description,
        price,
        duration,
        features,
        isActive,
      });

      // Save the plan to the database
      await newPlan.save();

      // Respond with the created plan
      res.status(201).json(newPlan);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Get all plans to show it in Front End
  async getPlans(req, res) {
    try {
      const plans = await Plan.find();
      res.status(200).json(plans);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get a single plan by ID, this will work when user have selected any plan and it will fatch details of that plan.
  async getPlanById(req, res) {
    try {
      const plan = await Plan.findById(req.params.id);
      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      res.status(200).json(plan);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Update a plan by ID
  async updatePlan(req, res) {
    try {
      const { name, description, price, duration, features, isActive } = req.body;
      const updatedPlan = await Plan.findByIdAndUpdate(
        req.params.id,
        { name, description, price, duration, features, isActive },
        { new: true }
      );

      if (!updatedPlan) {
        return res.status(404).json({ message: 'Plan not found' });
      }

      res.status(200).json(updatedPlan);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Delete a plan by ID
  async deletePlan(req, res) {
    try {
      const plan = await Plan.findByIdAndDelete(req.params.id);
      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = planController;
