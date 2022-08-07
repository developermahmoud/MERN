const express = require('express')
const router = express.Router()
const controller = require('../controllers/todo-controller')


router.get('/', controller.index)
router.post('/', controller.store)
router.get('/:id', controller.show)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

module.exports = router