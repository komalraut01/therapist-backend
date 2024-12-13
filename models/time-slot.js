const mongoose = require('mongoose');
const timeSlotSchema = new mongoose.Schema({
    days: Array,
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctors',
        required: true
    },
    from_time: String,
    to_time: String,
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);