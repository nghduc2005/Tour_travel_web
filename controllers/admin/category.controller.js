const categoryHelper = require("../../helpers/category.helper")
const AccountAdmin = require("../../models/account-admin.model")
const Category = require("../../models/category.model")
const moment = require('moment')

module.exports.list = async (req, res) => {
  const categoryList = await Category.find({
    deleted: false
  }).sort({
    position: 'desc'
  })

  for (const item of categoryList) {
    if(item.createdBy) {
      const infoAccountCreated = await AccountAdmin.findOne({
        _id: item.createdBy
      })
      item.createdByFullName = infoAccountCreated.fullName
    }
    if(item.updatedBy) {
      const infoAccountUpdated = await AccountAdmin.findOne({
        _id: item.updatedBy
      })
      item.updatedByFullName = infoAccountUpdated.fullName
    }
    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY")
    item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY")
  }
  res.render('admin/pages/category-list.pug', {
    pageTitle: "Danh sách danh mục",
    categoryList: categoryList
  })
}

module.exports.create = async (req, res) => {
  const categoryList = await Category.find({
    deleted: false,
  })
  const categoryTree = categoryHelper.buildCategoryTree(categoryList, '')
  res.render('admin/pages/category-create.pug', {
    pageTitle: "Tạo danh mục",
    categoryTree: categoryTree
  })
}

module.exports.createPost = async (req, res) => {
  if(req.body.position) {
    req.body.position = parseInt(req.body.position)
  } else {
    const totalRecord = await Category.countDocuments({})
    req.body.position = totalRecord+1
  }
  req.body.createdBy = req.account.id
  req.body.updatedBy = req.account.id
  req.body.avatar = req.file ? req.file.path : ''
  const newRecord = new Category(req.body)
  await newRecord.save()
  res.json({
    code:"success",
    message: "Tạo danh mục thành công!"
  })
}