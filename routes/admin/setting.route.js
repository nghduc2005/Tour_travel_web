const router = require('express').Router()
const settingController = require('../../controllers/admin/setting.controller')

router.get('/list', settingController.list)

module.exports = router