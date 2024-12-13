const { response } = require('express');
const {MongoClient} = require('mongodb');
const url = 'mongodb+srv://komalraut1209:gi9fC76UouFze6t2@cluster0.ab40p.mongodb.net/';
const database = 'Therapist'
const client = new MongoClient(url);

async function dbConnect()
{
    let result = await client.connect();
    db= result.db(database);
    return db.collection('Doctors');
}

module.exports= dbConnect;