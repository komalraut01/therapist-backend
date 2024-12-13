const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const userAuth = require('./middleware/user-auth');

const secretKey = 'secretkey';
const User = require('./models/user');
const bcrypt = require('bcrypt');

async function findUserByEmail(email){
    const user = await User.findOne({email});
    return user;
}

BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

router.post('/register', async (req, resp) => {
    const { name, email, password } = req.body;
    const existingUser = await findUserByEmail(email);
    if(existingUser){
        return resp.status(401).send({message: 'email already registered'});
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = hashPassword;
    user.save();
    return resp.status(200).json({ message: 'user created successfully' })
})
router.post('/login', async (req, resp) => {
    const {email, password } = req.body;

    const user = await findUserByEmail(email);
    if(!user){
        return resp.status(401).json({message: 'this email is not registered'});
    }

    const passwordMatch = await bcrypt.compare(password,user.password);
    if(!passwordMatch){
        return resp.status(401).json({message: 'please provide correct password'});
    }
    const token = await jwt.sign({id:user._id,email:user.email,name:user.name},'user-secrets',{expiresIn:'7h'});
    return resp.status(200).json({token}); 
})


router.get('/profile', userAuth.verifyUserToken, async (req, resp) => {
    const _id = req.user.id;
    const result = await User.findById(_id);
    return resp.status(200).json(result);
    
})

router.put('/profile', userAuth.verifyUserToken, async (req,resp) => {
    const _id = req.user.id;
    const result = await User.updateOne({_id},req.body);
    resp.status(200).json({message:"Profile updated successfully"});
})

router.get('/list', async (req, resp) => {
    const result = await User.find();
    return resp.status(200).json(result);
    
})

module.exports = router;

