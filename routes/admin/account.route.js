const router = require('express').Router()
const accountController = require(`../../controllers/admin/account.controller`)
const auth = require('../../middleware/admin/auth.middleware')

router.get('/register', accountController.register)
router.get('/register-initial', accountController.registerInitial)
router.post('/register', accountController.registerPost)

router.get('/login', accountController.login)
router.post('/login', accountController.loginPost)

router.post('/logout', accountController.logoutPost);

router.get('/forgot-password', accountController.forgotPassword)
router.post('/forgot-password', accountController.forgotPasswordPost)

router.get('/otp-password', accountController.otpPassword)
router.post('/otp-password', accountController.otpPasswordPost)

router.get(`/reset-password`, accountController.resetPassword)
router.post(`/reset-password`, auth.verifyToken, accountController.resetPasswordPost)
module.exports = router