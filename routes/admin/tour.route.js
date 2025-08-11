const router = require('express').Router()
const tourController = require('../../controllers/admin/tour.controller')
const cloudinaryHelper = require('../../helpers/cloudinary.helper')
const multer = require('multer')
const upload = multer({storage: cloudinaryHelper.storage})

router.get('/list', tourController.list)

router.get('/create', tourController.create)
router.post('/create', upload.single('avatar'), tourController.createPost)

router.get('/edit/:id', tourController.edit)
router.patch('/edit/:id', upload.single('avatar'),tourController.editPatch)
module.exports = router