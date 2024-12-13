const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://komalraut1209:gi9fC76UouFze6t2@cluster0.ab40p.mongodb.net/';

mongoose.connect(mongoURI).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.error('Connection error:', error);
});
