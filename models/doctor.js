const mongoose = require('mongoose');
const doctorsSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    specialist : String,
    address : String,
    working_time : String,
    status : Boolean,
    profile_pic : String,
});

module.exports = mongoose.model('Doctors', doctorsSchema);
