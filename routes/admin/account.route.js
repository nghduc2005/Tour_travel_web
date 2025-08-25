const router = require('express').Router()
const accountController = require(`../../controllers/admin/account.controller`)
const auth = require('../../middleware/admin/auth.middleware')
const accountValidate = require('../../validates/admin/account.validate')

router.get('/register', accountController.register)
router.get('/register-initial', accountController.registerInitial)
router.post(
  '/register', 
  accountValidate.registerPost,
  accountController.registerPost)

router.get('/login', accountController.login)
router.post(
  '/login', 
  accountValidate.loginPost, 
  accountController.loginPost)

router.post('/logout', accountController.logoutPost);

router.get('/forgot-password', accountController.forgotPassword)
router.post(
  '/forgot-password', 
  accountValidate.forgotPasswordPost,
  accountController.forgotPasswordPost)

router.get('/otp-password', accountController.otpPassword)
router.post(
  '/otp-password',
  accountValidate.otpPasswordPost,
  accountController.otpPasswordPost)

router.get(`/reset-password`, accountController.resetPassword)
router.post(
  `/reset-password`, 
  accountValidate.resetPasswordPost,
  auth.verifyToken, 
  accountController.resetPasswordPost)
module.exports = router