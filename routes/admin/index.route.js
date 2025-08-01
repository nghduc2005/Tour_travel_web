const router = require('express').Router()
const dashboardRoutes = require('./dashboard.route')
const accountRoutes = require('./account.route')

router.use('/account', accountRoutes)
router.use('/dashboard', dashboardRoutes)

module.exports = router