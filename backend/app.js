require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Subject = require('./models/Subject');

const app = express();

mongoose.connect(process.env.DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }, () => console.log('Connected to the database.'));

app.use(cors());
app.use(express.json());

app.get('/user/:userEmail', async (req, res) => {
    let subject = await Subject.findOne({email: req.params.userEmail});

    if (subject) {
        res.json({
            _id: subject._id,
            password: subject.password,
            nameMsg: subject.nameMsg
        })
    } else {
        res.sendStatus(404);
    }
});

app.post('/firstSession', async (req, res) => {
    let subject = new Subject({
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age,
        gender: req.body.gender,
        occupation: req.body.occupation,
        password: req.body.password,
        nameMsg: req.body.nameMsg,
        sessions: [{
            passwordKeystrokes: req.body.passwordKeystrokes,
            nameKeystrokes: req.body.nameKeystrokes
        }]
    });

    try {
        await subject.save();
        res.sendStatus(204);
    } catch (err) {
        res.sendStatus(500);
    }
});

app.put('/addSession', async (req, res) => {
    try {
        await Subject.findOneAndUpdate({ 
                _id: req.body._id
            }, {
                $push: {
                    sessions: {
                        passwordKeystrokes: req.body.passwordKeystrokes,
                        nameKeystrokes: req.body.nameKeystrokes
                    }
                }
            }
        );
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
})

app.listen(3000);