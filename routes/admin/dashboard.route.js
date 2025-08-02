const router = require('express').Router();
const dashboardController = require('../../controllers/admin/dashboard.controller')
const auth = require('../../middleware/admin/auth.middleware')

router.get('/', auth.verifyToken ,dashboardController.dashboard)

module.exports = router