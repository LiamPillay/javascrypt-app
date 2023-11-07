const mongoose = require('mongoose')

// User Schema
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true}
})

module.exports = mongoose.model('users', userSchema)