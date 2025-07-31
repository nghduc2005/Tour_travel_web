const router = require('express').Router()
const homeRoutes = require('./home.route')
const tourRoutes = require('./tour.route')
const categoryRoutes = require('./category.route')
const cartRoutes = require('./cart.route')

router.use('/', homeRoutes)
router.use('/cart', cartRoutes)
router.use('/tour', tourRoutes)
router.use('/category', categoryRoutes)

module.exports = router