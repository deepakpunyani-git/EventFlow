const Client = require('../models/EventFlow-clients');
const { validationResult } = require('express-validator');

// Create a new client
exports.createClient = async (req, res) => {
    try {
        const { clientName, email, phoneNumber, address, createdBy } = req.body;

        // Check if client with the provided phone number already exists
        const existingClient = await Client.findOne({ phoneNumber });
        if (existingClient) {
            return res.status(400).json({ error: 'Client with this phone number already exists' });
        }

        const newClient = new Client({
            clientName,
            email,
            phoneNumber,
            address,
            createdBy
        });

        const savedClient = await newClient.save();
        res.status(201).json(savedClient);
    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update an existing client
exports.updateClient = async (req, res) => {
    try {
        const clientId = req.params.id;
        const { clientName, email, phoneNumber, address, updatedBy } = req.body;

        // Find the existing client
        const existingClient = await Client.findById(clientId);
        if (!existingClient) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // If the phone number is being updated, check for uniqueness
        if (phoneNumber !== existingClient.phoneNumber) {
            const isPhoneNumberTaken = await Client.exists({ phoneNumber });
            if (isPhoneNumberTaken) {
                return res.status(400).json({ error: 'Phone number already exists' });
            }
        }

        // Update the client
        const updatedClient = await Client.findByIdAndUpdate(clientId, {
            clientName,
            email,
            phoneNumber,
            address,
            updatedBy,
            dateUpdated: Date.now()
        }, { new: true });

        res.json(updatedClient);
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a client
exports.deleteClient = async (req, res) => {
    try {
        const clientId = req.params.id;

        const deletedClient = await Client.findByIdAndDelete(clientId);

        if (!deletedClient) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
