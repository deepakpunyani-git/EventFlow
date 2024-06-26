const Client = require('../models/EventFlow-clients');
const Booking = require('../models/EventFlow-booking');

const { validationResult } = require('express-validator');

// Create a new client
exports.createClient = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const clientId = req.params.id;
        const { clientName, email, phoneNumber, address, updatedBy } = req.body;

        const existingClient = await Client.findById(clientId);
        if (!existingClient) {
            return res.status(404).json({ error: 'Client not found' });
        }

        if (phoneNumber !== existingClient.phoneNumber) {
            const isPhoneNumberTaken = await Client.exists({ phoneNumber });
            if (isPhoneNumberTaken) {
                return res.status(400).json({ error: 'Phone number already exists' });
            }
        }

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

exports.getClients = async (req, res) => {
    try {
        const { query, page = 1, limit = 10, sort } = req.query;

        const filter = {};
        if (query && typeof query === 'string') {
            filter.$or = [
                { clientName: { $regex: query, $options: 'i' } },
                { phoneNumber: { $regex: query, $options: 'i' } }
            ];
        }

        const options = {
            sort: sort ? { clientName: sort } : {},
            limit: parseInt(limit),
            skip: (page - 1) * limit
        };

        const clients = await Client.find(filter, null, options);
        res.status(200).json({ success: true, data: clients });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        const bookings = await Booking.find({ client: req.params.id });

        if (client) {
            return res.status(200).json({client,bookings});
        } else {
            return res.status(404).json({ message: 'Client not found' });
        }



    } catch (error) {
        console.error('Error fetching client:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};