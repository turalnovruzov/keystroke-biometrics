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
    let subject = await Subject.findOne({email: req.params.userEmail});

    if (subject) {
        res.json({_id: subject._id})
    } else {
        res.sendStatus(404);
    }
});

app.post('/firstSession', async (req, res) => {
    let subject = new Subject({
        email: req.body.email,
        firstname: req.body.email,
        lastname: req.body.lastname,
        age: req.body.age,
        gender: req.body.gender,
        occupation: req.body.occupation,
        sessions: [{
            passwordKeystrokes: req.body.passwordKeystrokes,
            messageKeystrokes: req.body.messageKeystrokes
        }]
    });

    try {
        const savedSubject = await subject.save();
        console.log(JSON.stringify(savedSubject, null, 2));
        res.sendStatus(204);
    } catch (err) {
        console.log(JSON.stringify(err, null, 2));
        res.sendStatus(500);
    }
})

app.listen(3000);