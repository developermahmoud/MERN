const Todo = require('../models/todo')
const mongoose = require('mongoose')

module.exports = {
    async index(req, res) {
        const todos = await Todo.find({}).sort({
            createdAt: -1
        })
        res.status(200).json(todos)
    },
    async store(req, res) {
        const {
            content
        } = req.body
        try {
            const todo = await Todo.create({
                content,
                status: false
            })
            res.status(201).json(todo)
        } catch (error) {
            res.status(400).json({
                error: error.message
            })
        }
    },
    async show(req, res) {
        const {
            id
        } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                msg: "Todo not found"
            })
        }
        const todo = await Todo.findById(id)
        if (!todo) {
            return res.status(404).json({
                msg: "Todo not found"
            })
        }
        res.status(200).json(todo)
    },
    async update(req, res) {
        const {
            id
        } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                msg: "Todo not found"
            })
        }
        const todo = await Todo.findOneAndUpdate({_id:id}, {
            status: true
        })
        if (!todo) {
            return res.status(404).json({
                msg: "Todo not found"
            })
        }
        res.status(202).json(todo)
    },
    async delete(req, res) {
        const {
            id
        } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                msg: "Todo not found"
            })
        }
        const todo = await Todo.findOneAndDelete({
            _id: id
        })
        if (!todo) {
            return res.status(404).json({
                msg: "Todo not found"
            })
        }
        res.status(202).json({
            msg: "deleted"
        })
    }
}