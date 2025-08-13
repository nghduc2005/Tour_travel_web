const router = require('express').Router()
const settingController = require('../../controllers/admin/setting.controller')
const cloudinaryHelper = require('../../helpers/cloudinary.helper')
const multer = require('multer')
const upload = multer({storage: cloudinaryHelper.storage})

router.get('/list', settingController.list)
router.get('/website-info',settingController.websiteInfo)
router.patch('/website-info', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 }
]
), settingController.websiteInfoPatch)

router.get('/account-admin/list', settingController.accountAdmin)
router.get('/role/list', settingController.roleList)

module.exports = router