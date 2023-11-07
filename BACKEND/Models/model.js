const mongoose = require('mongoose')

// Task Schema
const taskSchema = new mongoose.Schema({
    task: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: String, required: true}
})

module.exports = mongoose.model('tasks', taskSchema)
