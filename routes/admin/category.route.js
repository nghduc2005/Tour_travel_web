const router = require('express').Router()
const categoryController = require('../../controllers/admin/category.controller')
const cloudinaryHelper = require('../../helpers/cloudinary.helper')
const multer = require('multer')
const upload = multer({storage: cloudinaryHelper.storage})

router.get('/list', categoryController.list)
router.get('/create', categoryController.create)
router.post('/create', upload.single('avatar'),categoryController.createPost)

module.exports = router