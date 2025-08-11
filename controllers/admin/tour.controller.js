const categoryHelper = require('../../helpers/category.helper')
const AccountAdmin = require('../../models/account-admin.model')
const Category = require('../../models/category.model')
const City = require('../../models/city.model')
const Tour = require('../../models/tour.model')
const moment = require('moment')
module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  }
  const tourList = await Tour
  .find(find)
  .sort({position: 'desc'})

  for(const item of tourList) {
    if(item.createdBy) {
      const infoCreatedBy = await AccountAdmin.findOne({
        _id: item.createdBy
      })
      item.createdByFullName = infoCreatedBy.fullName
    }
    if(item.updatedBy) {
      const infoUpdatedBy = await AccountAdmin.findOne({
        _id: item.updatedBy
      })
      item.updatedByFullName = infoUpdatedBy.fullName
    }
    item.createdAtFormat = moment(item.createdAt).format('HH:mm - DD/MM/YYYY')
    item.updatedAtFormat = moment(item.updatedAt).format('HH:mm - DD/MM/YYYY')
  }
  res.render('admin/pages/tour-list.pug' , {
    pageTitle: "Danh sách tour",
    tourList: tourList
  })
}

module.exports.create = async(req, res) => {
  const categoryList = await Category.find({
    deleted: false
  })
  const categoryTree = categoryHelper.buildCategoryTree(categoryList)
  const cityList = await City.find({})
  res.render('admin/pages/tour-create.pug', {
    pageTitle: "Tạo tour",
    categoryTree: categoryTree,
    cityList: cityList
  })
}

module.exports.createPost = async(req, res) => {
  if(!req.body.position) {
    const totalRecord = await Tour.countDocuments({})
    req.body.position = totalRecord + 1
  } else {
    req.body.position = parseInt(req.body.position)
  }
  req.body.avatar = req.file ? req.file.path : ""
  req.body.createdBy = req.account.id
  req.body.updatedBy = req.account.id

  req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0
  req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0
  req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0
  req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult
  req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren
  req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby
  req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0
  req.body.stockChildren = req.body.stockChildren ? parseInt(req.body.stockChildren) : 0
  req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0
  
  req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : []
  req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null
  req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : []
  const newRecord = new Tour(req.body)
  newRecord.save()
  res.json({
    code:"success",
    message: "Tạo tour thành công!"
  })
}

module.exports.edit = async(req, res) => {
  try {
    const id = req.params.id
    const tourDetail = await Tour.findOne({
      _id: id
    })
    tourDetail.departureDateFormat = moment(tourDetail.departureDate).format('YYYY-MM-DD')

    const categoryList = await Category.find({
      deleted: false
    })
    const categoryTree = categoryHelper.buildCategoryTree(categoryList)
    const cityList = await City.find({})
    res.render('admin/pages/tour-edit.pug', {
      pageTitle: "Chỉnh sửa tour",
      tourDetail: tourDetail,
      cityList: cityList,
      categoryTree: categoryTree
    })
  } catch (error) {
    res.redirect(`/${pathAdmin}/tour/list`)
  }
}

module.exports.editPatch = async(req, res) => {
  try {
    const id = req.params.id
    if(!req.body.position) {
      const totalRecord = await Tour.countDocuments({})
      req.body.position = totalRecord + 1
    } else {
      req.body.position = parseInt(req.body.position)
    }
    req.body.updatedBy = req.account.id

    if(req.file) {
      req.body.avatar = req.file.path
    } else {
      delete req.body.avatar
    }

    req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
    req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
    req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
    req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
    req.body.stockChildren = req.body.stockAdult ? parseInt(req.body.stockChildren) : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
    req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
    req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
    req.body.schedules = req.body.locations ? JSON.parse(req.body.schedules) : [];

    await Tour.updateOne({
      _id: id,
      deleted: false
    }, req.body)

    res.json({
      code:"success"
    })
  } catch (error) {
    res.json({
      code:'error',
      message: "Id không hợp lệ!"
    })
  }
}