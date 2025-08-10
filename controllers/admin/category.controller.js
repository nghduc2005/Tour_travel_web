const categoryHelper = require("../../helpers/category.helper")
const AccountAdmin = require("../../models/account-admin.model")
const Category = require("../../models/category.model")
const moment = require('moment')
const slugify = require('slugify')

module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  }
  // Lọc trạng thái
  if(req.query.status) {
    find.status = req.query.status
  }
  // Hết lọc trạng thái

  // Lọc người tạo
  if(req.query.createdBy) {
    find.createdBy = req.query.createdBy
  }
  // Hết Lọc người tạo

  // Lọc ngày tạo
  const dateFilter = {}
  if(req.query.startDate) {
    const startDate = moment(req.query.startDate).startOf("date").toDate();
    dateFilter.$gte = startDate;
  }
  if(req.query.endDate) {
    const endDate = moment(req.query.endDate).endOf('date').toDate()
    dateFilter.$lte = endDate
  }
  if(Object.keys(dateFilter).length > 0) {
    find.createdAt = dateFilter;
  }
  //Hết Lọc ngày tạo

  // Tìm kiếm
  if(req.query.keyword) {
    const keyword = slugify(req.query.keyword, {
      lower: true
    })
    const keywordRegex = new RegExp(keyword)
    find.slug = keywordRegex
  }
  // Hết tìm kiếm

  // Phân trang
  const limitItem = 5
  let page = 1
  if(req.query.page) {
    const currentPage = req.query.page
    if(currentPage > 0) {
      page = currentPage
    }
  }
  const totalRecord = await Category.countDocuments(find)
  const totalPage = Math.ceil(totalRecord/limitItem)
  if(page>totalPage) {
    page = totalPage
  }
  if(page<=0) {
    page = 1
  }
  const pagination = {
    skip: (page-1)*limitItem,
    totalPage: totalPage,
    totalRecord: totalRecord
  }
  // Kết thúc phân trang
  const categoryList = await Category
  .find(find)
  .sort({
    position: 'desc'
  })
  .limit(limitItem)
  .skip(pagination.skip)

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
   // Danh sách tài khoản quản trị
   const accountAdminList = await AccountAdmin
   .find({})
   .select("id fullName");
 // Hết Danh sách tài khoản quản trị
  res.render('admin/pages/category-list.pug', {
    pageTitle: "Danh sách danh mục",
    categoryList: categoryList,
    pagination: pagination,
    accountAdminList: accountAdminList
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

module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id
    await Category.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    })
    res.json({
      code: "success",
      message: "Danh mục đã được đưa vào thùng rác!"
    })
  } catch (error) {
    res.json({
      code:"error",
      message: "Id không hợp lệ!"
    })
  }
}

module.exports.changeMultiPatch = async (req, res) => {
  try {
    const {option, ids}  = req.body
    switch (option) {
      case "active":
      case "inactive":
        await Category.updateMany({
          _id: {$in : ids}
        }, {
          status: option
        })
        break;
      case "delete":
        await Category.updateMany({
          _id: { $in: ids }
        }, {
          deleted: true,
          deletedBy: req.account.id,
          deletedAt: Date.now()
        });
      break;
    }
    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không tồn tại trong hệ thông!"
    })
  }
}