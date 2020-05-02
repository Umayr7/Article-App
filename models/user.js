const mongoose = require('mongoose')

//User Schema
const UserSchema = mongoose.Schema({
    name:{
        type: String,
        reqiured: true
    },
    email:{
        type: String,
        reqiured: true
    },
    username:{
        type: String,
        reqiured: true
    },
    password:{
        type: String,
        reqiured: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema)