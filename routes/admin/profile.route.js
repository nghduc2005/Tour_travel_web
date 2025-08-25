const router = require('express').Router()
const profileController = require('../../controllers/admin/profile.controller')
const cloudinaryHelper = require('../../helpers/cloudinary.helper')
const profileValidate = require('../../validates/admin/profile.validate')
const multer = require('multer')
const upload = multer({storage: cloudinaryHelper.storage})

router.get('/edit', profileController.edit)
router.patch(
  '/edit', 
  upload.single('avatar'),
  profileValidate.editPost,
  profileController.editPatch)

router.get('/change-password', profileController.changePassword)
router.patch(
  '/change-password', 
  profileValidate.changePasswordPost,
  profileController.changePasswordPatch)
module.exports = router