const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Doctor = require('./models/doctor');
const TimeSlot = require('./models/time-slot');
const bcrypt = require('bcrypt');

const doctorAuth = require('./middleware/doctor-auth');
const multer = require('multer');

async function findUserByEmail(email){
    const doctor = await Doctor.findOne({email});
    return doctor;
}
router.post('/register', async (req, resp) => {
    const { name, email, password, specialist,address,working_time} = req.body;
    const existingDoctor = await findUserByEmail(email);
    if(existingDoctor){
        resp.status(400).json({message: 'email already registered'});
    }
    
    const hashPassword = await bcrypt.hash(password, 10);
    const doctor = new Doctor();
    doctor.name = name;
    doctor.email = email;
    doctor.password = hashPassword;
    doctor.specialist = specialist;
    doctor.address = address;
    doctor.working_time = working_time;
    doctor.status = 1;
    doctor.save();
    resp.status(200).json({ message: 'doctor created successfully' })
})
router.post('/login', async (req, resp) => {
    const {email, password} = req.body;

    const doctor = await findUserByEmail(email);
    if(!doctor){
        return resp.status(401).json({message: 'this email is not registered'});
    } else if (!doctor.status) {
        return resp.status(401).json({message: 'this doctor is deactivated'});
    }

    const passwordMatch = await bcrypt.compare(password,doctor.password);
    if(!passwordMatch){
        return resp.status(401).json({message: 'please provide correct password'});
    }
    const token = await jwt.sign({id:doctor._id,email:doctor.email,name:doctor.name},'doctor-secrets',{expiresIn:'7h'});
    resp.status(200).json({token}); 
})

router.get('/list',async(req,resp) => {
    const result = await Doctor.find();
    resp.status(200).json(result)
})

router.get('/id/:id',async (req, resp)=> {
    try {
        const _id = req.params.id;
        const result = await Doctor.findById(_id);
        if (!result){
            resp.status(401).json({message: "doctor with this id not found"});
        }
        resp.status(200).json(result);   
    } catch (error) {
       resp.status(401).json({message: error.message});
    }
   
})

router.get('/profile', doctorAuth.verifyDoctorToken, async (req, resp) => {
    const _id = req.doctor.id;
    const result = await Doctor.findById(_id);
    resp.status(200).json(result);
})

router.put('/profile', doctorAuth.verifyDoctorToken, async (req,resp) => {
    const _id = req.doctor.id;
    const result = await Doctor.updateOne({_id},req.body);
    resp.status(200).json({message:"Profile updated successfully"});
})

router.post('/time-slot', doctorAuth.verifyDoctorToken, async (req,resp) => {
    const doctor = req.doctor.id;
    const timeSlot = new TimeSlot();

    timeSlot.doctor = doctor;
    timeSlot.from_time = req.body.from_time;
    timeSlot.to_time = req.body.to_time;
    timeSlot.days = req.body.days;
    timeSlot.save();

    return resp.status(200).json({message:"Time slot created successfully"});
})

router.put('/time-slot/:id', doctorAuth.verifyDoctorToken, async (req,resp) => {
    const _id = req.params.id;
    await TimeSlot.findOneAndUpdate({_id}, {from_time: req.body.from_time, to_time: req.body.to_time, days: req.body.days});
    
    return resp.status(200).json({message:"Time slot updated successfully"});
})

router.delete('/time-slot/:id', doctorAuth.verifyDoctorToken, async (req,resp) => {
    const doctor = req.doctor.id;
    const _id = req.params.id;
    await TimeSlot.findOneAndDelete({doctor: doctor, _id });
    
    resp.status(200).json({message:"Time slot deleted successfully"});
})

router.get('/time-slot', doctorAuth.verifyDoctorToken, async (req,resp) => {
    const doctor = req.doctor.id;
    const result = await TimeSlot.find({doctor});
    resp.status(200).json(result);
})

router.get('/:_id/time-slot/:day', async (req,resp) => {
    const doctor = req.params._id;
    const day = req.params.day;
    const result = await TimeSlot.find({doctor});
    const slot = [];
    for (let index = 0; index < result.length; index++) {
        if(result[index].days.filter((slotDay) => ( slotDay == day ))) {
            for (let i = parseInt(result[index].from_time); i < parseInt(result[index].to_time); i++) {
                slot.push(i)
            }
            
        }
        
    }
    resp.status(200).json(slot);
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage });

router.put('/profile-pic', doctorAuth.verifyDoctorToken, upload.single('file'), async (req, res) => {
    const _id = req.doctor.id;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    await Doctor.updateOne({_id},{profile_pic: '/uploads/' + req.file.filename});
    res.json({ message: 'File uploaded successfully', filename: req.file.filename });
  });

module.exports = router;
