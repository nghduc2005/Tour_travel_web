const router = require('express').Router()
const contactController = require('../../controllers/client/contact.controller')

router.get('/', contactController.contact)
router.post('/create', contactController.createPost)
router.post('/content', contactController.contentPost)

module.exports = router