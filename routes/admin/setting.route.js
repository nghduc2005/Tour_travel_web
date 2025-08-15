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
router.patch('/account-admin/change-multi', settingController.accountAdminChangeMulti)
router.get('/account-admin/create', settingController.accountAdminCreate)
router.post('/account-admin/create', upload.single('avatar'), settingController.accountAdminCreatePost)
router.get('/account-admin/edit/:id', settingController.accountAdminEdit)
router.patch('/account-admin/edit/:id', upload.single('avatar'),settingController.accountAdminEditPatch)

router.get('/role/list', settingController.roleList)
router.patch('/role/change-multi', settingController.roleChangeMulti)
router.get('/role/create', settingController.roleCreate)
router.get('/role/edit/:id', settingController.roleEdit)
router.patch('/role/edit/:id', settingController.roleEditPatch)
router.post('/role/create', settingController.roleCreatePost)
router.patch('/role/delete/:id', settingController.roleDeletePatch)

module.exports = router