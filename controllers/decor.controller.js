const EventFlowDecor = require('../models/EventFlow-decor.model');

// Controller to create a new decor
exports.createDecor = async (req, res) => {
    try {
        const { name, description, price, status } = req.body;
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
