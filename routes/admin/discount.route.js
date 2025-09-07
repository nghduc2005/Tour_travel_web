const router = require('express').Router()
const discountController = require('../../controllers/admin/discount.controller')
router.get('/list', discountController.list)
router.get('/create', discountController.create)
router.post('/create', discountController.createPost)
router.get('/edit/:id', discountController.edit)
router.patch('/edit/:id', discountController.editPatch)
router.patch('/change-multi', discountController.changeMultiPatch)
router.patch('/delete/:id', discountController.deletePatch)

module.exports = router