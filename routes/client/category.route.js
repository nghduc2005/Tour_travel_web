const router = require('express').Router()
const categoryController = require('../../controllers/client/category.controller')

router.get('/', categoryController.list)

module.exports = router