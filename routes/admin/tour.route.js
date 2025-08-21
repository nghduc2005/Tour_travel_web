const router = require('express').Router()
const tourController = require('../../controllers/admin/tour.controller')
const cloudinaryHelper = require('../../helpers/cloudinary.helper')
const multer = require('multer')
const upload = multer({storage: cloudinaryHelper.storage})

router.get('/list', tourController.list)

router.get('/create', tourController.create)
router.post('/create', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), tourController.createPost)

router.get('/edit/:id', tourController.edit)
router.patch('/edit/:id', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]),
tourController.editPatch)

router.patch('/delete/:id', tourController.deletePatch)

router.patch('/change-multi', tourController.changeMultỉPatch)

router.get('/trash', tourController.trash)
router.patch('/trash/undo/:id', tourController.trashUndoPatch)
router.delete('/trash/permanent-delete/:id', tourController.trashPermanentDelete)
module.exports = router