const router = require('express').Router()
const cartController = require('../../controllers/client/cart.controller')
router.get('/', cartController.cart)
router.post('/detail', cartController.detail)
router.post('/coupon', cartController.couponPost)

module.exports = router