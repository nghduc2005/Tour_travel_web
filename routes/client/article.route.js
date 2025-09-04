const router = require('express').Router()
const articleController = require('../../controllers/client/article.controller')
router.get('/', articleController.list)
router.get('/:slug', articleController.detail)

module.exports  = router