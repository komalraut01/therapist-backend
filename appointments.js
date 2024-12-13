const express = require('express');
const Appointment = require('./models/appointment');
const router = express.Router();
const userAuth = require('./middleware/user-auth');
const doctorAuth = require('./middleware/doctor-auth');

router.post('/', userAuth.verifyUserToken, async (req, resp) => {
    const _id = req.user.id;
    const { doctor, date, time, text } = req.body;
    const appointment = new Appointment();
    appointment.user = _id;
    appointment.doctor = doctor;
    appointment.date = date;
    appointment.time = time;
    appointment.text = text;
    appointment.status = 'new';
    appointment.save();
    resp.status(200).json({ message: 'appointment created successfully' })
})

router.get('/users/list', userAuth.verifyUserToken, async (req, resp) => {
    const _id = req.user.id;
    const result = await Appointment.find({user: _id}).populate({path: 'doctor', select: 'name email'});
    resp.status(200).json(result);
})

router.get('/doctors/list/:status', doctorAuth.verifyDoctorToken, async (req, resp) => {
    const _id = req.doctor.id;
    const status = req.params.status;
    if (status == 'all') {
        const result = await Appointment.find({doctor: _id}).populate({path: 'user', select: 'name email'});
    
        return resp.status(200).json(result);
    } else {
        const result = await Appointment.find({doctor: _id, status}).populate({path: 'user', select: 'name email'});
    
        return resp.status(200).json(result);
    }
})

router.get('/accept/:id', doctorAuth.verifyDoctorToken, async (req, resp) => {
    const _id = req.params.id;
    await Appointment.updateOne({_id}, {status: 'accepted'});
    resp.status(200).json({message:"Appointment Accepted successfully"});
})

router.get('/reject/:id', doctorAuth.verifyDoctorToken, async (req, resp) => {
    const _id = req.params.id;
    await Appointment.updateOne({_id}, {status: 'rejected'})
    resp.status(200).json({message:"Appointment Rejected successfully"});
})

module.exports = router;
