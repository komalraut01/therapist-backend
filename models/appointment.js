const mongoose = require('mongoose');
const appointmentsSchema = new mongoose.Schema({
    date: String,
    time: String,
    text: String,
    status: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctors',
        required: true
    }
});

module.exports = mongoose.model('Appointments', appointmentsSchema);