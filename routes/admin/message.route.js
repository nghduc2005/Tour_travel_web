const router = require('express').Router()
const messagesController = require('../../controllers/admin/message.controller')

router.get('/list', messagesController.messagesList)
router.get('/read/:id', messagesController.messagesRead)
router.post('/read/:id', messagesController.messagesReadPost)
router.patch('/delete/:id', messagesController.messagesReadPatch)
router.patch('/change-multi', messagesController.messagesChangeMulti)

module.exports = router