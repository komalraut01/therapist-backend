const express = require('express');
require('./config');
const adminRouter = require('./admins');
const userRouter = require('./users');
const doctorsRouter = require('./doctors');
const appointmentsRouter = require('./appointments');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/admins', adminRouter);
app.use('/users', userRouter);
app.use('/doctors',doctorsRouter);
app.use('/appointments',appointmentsRouter);
app.use('/uploads', express.static('uploads'));


app.listen(3001);