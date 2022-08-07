const mongoose = require('mongoose')

const Schema = mongoose.Schema

const todoSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Todo', todoSchema)