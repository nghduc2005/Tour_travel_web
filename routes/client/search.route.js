const router = require('express').Router()
const searchController = require("../../controllers/client/search.controller")

router.use('/', searchController.list)

module.exports = router