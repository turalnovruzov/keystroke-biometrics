const mongoose = require('mongoose');

const SubjectSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 1,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nameMsg: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },

    sessions: [{
        passwordKeystrokes: [[{
            time: {
                type: Date,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            key: {
                type: String,
                required: true
            }
        }]],
        nameKeystrokes: [{
            time: {
                type: Date,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            key: {
                type: String,
                required: true
            }
        }],
    }]
});

module.exports = mongoose.model('subjects', SubjectSchema);