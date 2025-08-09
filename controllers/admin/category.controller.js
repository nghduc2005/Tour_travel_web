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

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const categoryList = await Category.find({
      deleted: false,
    })
    const categoryDetail = await Category.findOne({
      _id: id,
      deleted: false
    })
    const categoryTree = categoryHelper.buildCategoryTree(categoryList, '')
    res.render(`admin/pages/category-edit.pug`, {
      pageTitle: "Sửa danh mục",
      categoryTree: categoryTree,
      categoryDetail: categoryDetail
    })
  } catch (error) {
    res.redirect(`/${pathAdmin}/category/list`)
  }
}

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id
    if(req.body.position) {
      req.body.position = parseInt(req.body.position)
    } else {
      const totalRecord = await Category.countDocuments({})
      req.body.position = totalRecord+1
    }
    req.body.updatedBy = req.account.id
    if(req.file) {
      req.body.avatar = req.file.path
    } else {
      delete req.body.avatar
    }
    await Category.updateOne({
      _id: id,
      deleted: false
    }, req.body)
    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}