require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Subject = require('./models/Subject');

const app = express();

mongoose.connect(process.env.DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }, () => console.log('Connected to the database.'));

app.use(express.json());

app.get('/user/:userEmail', async (req, res) => {
    let user = await Subject.findOne({email: req.params.userEmail});
    
    if (user) {
        res.json({_id: user._id})
    } else {
        res.sendStatus(404);
    }
})

app.listen(3000);