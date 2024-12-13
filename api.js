const express = require('express');
const dbConnect = require('./mongodb');
const app = express();

app.get('/', async (req, resp) => {
    let data = await dbConnect();
    data = await data.find().toArray();
  
    resp.send(data);
});

app.post('/', async (req, resp) => {
    let data = await dbConnect();
    let result = await data.insert(req,body)
    resp.send(result)
});

app.put('/',(req, resp)=>{
    resp.send({result: 'update'})
})

app.listen(5000)

