const router = require('express').Router()
const homeRoutes = require('./home.route')
const tourRoutes = require('./tour.route')
const categoryRoutes = require('./category.route')
const cartRoutes = require('./cart.route')
const contactRoutes = require('./contact.route')
const settingMiddleware = require('../../middleware/client/setting.middleware')
const categoryMiddleware = require('../../middleware/client/category.middleware')

router.use(settingMiddleware.websiteInfo)
router.use(categoryMiddleware.list)
router.use('/', homeRoutes)
router.use('/cart', cartRoutes)
router.use('/tour', tourRoutes)
router.use('/category', categoryRoutes)


module.exports = router