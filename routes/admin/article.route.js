const router = require('express').Router()
const articleController = require('../../controllers/admin/article.controller')
const cloudinaryHelper = require('../../helpers/cloudinary.helper')
const multer = require('multer')
const upload = multer({storage: cloudinaryHelper.storage})
router.get('/list', articleController.list)
router.get('/create', articleController.create)
router.post('/create', upload.single("cover") ,articleController.createPost)
router.get('/edit/:id' ,articleController.edit)
router.patch('/edit/:id', upload.single("cover") ,articleController.editPatch)
router.patch('/change-multi' ,articleController.articleChangeMulti)

module.exports = router