const router = require('express').Router()
const contactController = require('../../controllers/admin/contact.controller')

router.get('/list', contactController.list)
router.patch('/delete/:id', contactController.delete)
router.patch('/change-multi', contactController.changeMulti)

module.exports = router