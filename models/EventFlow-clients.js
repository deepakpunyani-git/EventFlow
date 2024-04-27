const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    email: { type: String },
    phoneNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFlow-users' },
    dateCreated: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFlow-users' },
    dateUpdated: { type: Date }
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
