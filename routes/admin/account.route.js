const router = require('express').Router()
const accountController = require(`../../controllers/admin/account.controller`)

router.get('/register', accountController.register)
router.get('/register-initial', accountController.registerInitial)
router.post('/register', accountController.registerPost)

router.get('/login', accountController.login)
router.post('/login', accountController.loginPost)

router.post('/logout', accountController.logoutPost);
module.exports = router