const express = require('express');
const Admin = require('./models/admin');
const Appointment = require('./models/appointment');
const Doctor = require('./models/doctor');
const User = require('./models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyAdminToken } = require('./middleware/admin-auth');

router.post('/login', async (req, resp) => {
    const {email, password } = req.body;

    const admin = await findAdminByEmail(email);
    if(!admin){
        return resp.status(401).json({message: 'this email is not registered'});
    }

    const passwordMatch = await bcrypt.compare(password,admin.password);
    if(!passwordMatch){
        return resp.status(401).json({message: 'please provide correct password'});
    }
    const token = await jwt.sign({id:admin._id,email:admin.email,name:admin.name},'admin-secrets',{expiresIn:'7h'});
    return resp.status(200).json({token}); 
})

router.get('/profile', verifyAdminToken, async(req,resp) => {
    const _id = req.admin.id;
    const result = await Admin.findById(_id);
    return resp.status(200).json(result);
})

router.get('/appointments/list/:status', verifyAdminToken, async(req,resp) => {
    const status = req.params.status;
    if (status == 'all') {
        const result = await Appointment.find().populate({path: 'doctor', select: 'name email'}).populate({path: 'user', select: 'name email'});
        return resp.status(200).json(result);
    } else {
        const result = await Appointment.find({status}).populate({path: 'doctor', select: 'name email'}).populate({path: 'user', select: 'name email'});
        return resp.status(200).json(result);
    }
})

router.get('/doctor/:_id/activate', verifyAdminToken, async(req,resp) => {
    const _id = req.params._id;
    await Doctor.updateOne({_id}, {status: 1});
    return resp.status(200).json({message:"Doctor Activated successfully"});
})

router.get('/doctor/:_id/deactivate', verifyAdminToken, async(req,resp) => {
    const _id = req.params._id;
    await Doctor.updateOne({_id}, {status: 0})
    return resp.status(200).json({message:"Doctor deactivated successfully"});
})

async function findAdminByEmail(email){
    const admin = await Admin.findOne({email});
    return admin;
}

module.exports = router;