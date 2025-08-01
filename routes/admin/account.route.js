const router = require('express').Router()
const accountController = require(`../../controllers/admin/account.controller`)

router.get('/register', accountController.register)
router.post('/register', accountController.registerPost)

module.exports = router