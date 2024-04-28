const EventFlowCateringPlan = require('../models/EventFlow-cateringPlan.model');

// Controller to create a new catering plan
exports.createCateringPlan = async (req, res) => {
    try {
        const { name, description, price, status } = req.body;
        const existingVenue = await EventFlowCateringPlan.findOne({ name: req.body.name });
        if (existingVenue) {
          return res.status(400).json({ error: 'Catering Plan with this name already exists' });
        }
        const cateringPlan = new EventFlowCateringPlan({ name, description, price, status });
        await cateringPlan.save();
        res.status(201).json(cateringPlan);
    } catch (error) {
        console.error('Error creating catering plan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to update an existing catering plan
exports.updateCateringPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, status } = req.body;

        const existingVenue = await EventFlowCateringPlan.findOne({ name, _id: { $ne: id } });

        if (existingVenue) {
            return res.status(400).json({ error: 'Catering Plan with this name already exists' });
        }

        const cateringPlan = await EventFlowCateringPlan.findByIdAndUpdate(id, { name, description, price, status }, { new: true });
        if (!cateringPlan) {
            return res.status(404).json({ error: 'Catering plan not found' });
        }
        res.json(cateringPlan);
    } catch (error) {
        console.error('Error updating catering plan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to delete a catering plan
exports.deleteCateringPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const cateringPlan = await EventFlowCateringPlan.findByIdAndDelete(id);
        if (!cateringPlan) {
            return res.status(404).json({ error: 'Catering plan not found' });
        }
        res.json({ message: 'Catering plan deleted successfully' });
    } catch (error) {
        console.error('Error deleting catering plan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getCateringPlans = async (req, res) => {
    try {

        const isAdmin = req.user && req.user.usertype === 'admin';

        let query = { status: 'active' };
    
        if (isAdmin) {
          if(req.query.status !== undefined){
            query = {status: req.query.status};
          }else{
            query = {};
    
          }
        }

      const cateringPlans = await EventFlowCateringPlan.find(query).sort({ name: 1 });
      res.status(200).json(cateringPlans);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };