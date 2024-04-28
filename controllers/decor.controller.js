const EventFlowDecor = require('../models/EventFlow-decor.model');

// Controller to create a new decor
exports.createDecor = async (req, res) => {
    try {
        const { name, description, price, status } = req.body;
        const existingVenue = await EventFlowDecor.findOne({ name: req.body.name });
        if (existingVenue) {
          return res.status(400).json({ error: 'Decor with this name already exists' });
        }
        const decor = new EventFlowDecor({ name, description, price, status });
        await decor.save();
        res.status(201).json(decor);
    } catch (error) {
        console.error('Error creating decor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to update an existing decor
exports.updateDecor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, status } = req.body;

        
        const existingVenue = await EventFlowDecor.findOne({ name, _id: { $ne: id } });

        if (existingVenue) {
            return res.status(400).json({ error: 'Decor with this name already exists' });
        }

        const decor = await EventFlowDecor.findByIdAndUpdate(id, { name, description, price, status }, { new: true });
        if (!decor) {
            return res.status(404).json({ error: 'Decor not found' });
        }
        res.json(decor);
    } catch (error) {
        console.error('Error updating decor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to delete a decor
exports.deleteDecor = async (req, res) => {
    try {
        const { id } = req.params;
        const decor = await EventFlowDecor.findByIdAndDelete(id);
        if (!decor) {
            return res.status(404).json({ error: 'Decor not found' });
        }
        res.json({ message: 'Decor deleted successfully' });
    } catch (error) {
        console.error('Error deleting decor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



exports.getDecors = async (req, res) => {
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

      const decor = await EventFlowDecor.find(query).sort({ name: 1 });
      res.status(200).json(decor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };