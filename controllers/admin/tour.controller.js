const categoryHelper = require('../../helpers/category.helper')
const AccountAdmin = require('../../models/account-admin.model')
const Category = require('../../models/category.model')
const City = require('../../models/city.model')
const Tour = require('../../models/tour.model')
const moment = require('moment')
const slugify = require('slugify')
const priceList = require('../../config/price.config')
module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  }
  // Filter-status
  if(req.query.status) {
    find.status = req.query.status
  }
  // Hết Filter-status
  // Filter created by
  if(req.query.createdBy) {
    find.createdBy = req.query.createdBy
  }
  // Hết filter created by
  // Filter created date
  const dateFilter = {}
  if(req.query.startDate) {
    const startDate = moment(req.query.startDate).startOf('date ').toDate()
    dateFilter.$gte = startDate
  }
  if(req.query.endDate) {
    const endDate = moment(req.query.endDate).endOf('date').toDate()
    dateFilter.$lte = endDate
  }
  if(Object.keys(dateFilter).length > 0) {
    find.createdAt = dateFilter;
  }
  // Hết filter created date
  // Filter category
  if(req.query.category) {
    find.category = req.query.category
  }
  // Hết Filter category
  // Filter price
  if(req.query.price) {
    const [minimum, maximum] = req.query.price.split('-')
    const priceRange = {}
    priceRange.$gte = parseInt(minimum)
    priceRange.$lte = parseInt(maximum)
    find.priceNewAdult = priceRange
  }
  // Hết filter price
  // Pagination
  const limitItem = 1
  const totalRecord = await Tour.countDocuments(find)
  let page = 1
  if(req.query.page) {
    const currentPage = parseInt(req.query.page)
    if(currentPage > 0) {
      page = currentPage
    }
  }
  const totalPage = Math.ceil(totalRecord/limitItem)
  if(page> totalPage) {
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
  // Hết Pagination
  // Tìm kiếm
  if(req.query.keyword) {
    const keyword = slugify(req.query.keyword, {
      lower: true
    })
    const keywordRegex = new RegExp(keyword)
    find.slug = keywordRegex
  }
  // Hết tìm kiếm
  const tourList = await Tour
  .find(find)
  .sort({position: 'desc'})
  .limit(limitItem)
  .skip(pagination.skip)

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

  const accountAdminList = await AccountAdmin
  .find({})
  .select("id fullName")

  const categoryList = await Category
  .find({})
  .select("id parent name")
  const categoryTree = categoryHelper.buildCategoryTree(categoryList)

  res.render('admin/pages/tour-list.pug' , {
    pageTitle: "Danh sách tour",
    tourList: tourList,
    accountAdminList: accountAdminList,
    categoryTree: categoryTree,
    priceList: priceList,
    pagination: pagination
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
  if(req.files && req.files.avatar) {
    req.body.avatar = req.files.avatar[0].path;
  } else {
    delete req.body.avatar;
  }
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
  if(req.files && req.files.images && req.files.images.length > 0) {
    req.body.images = req.files.images.map(file => file.path);
  } else {
    delete req.body.images;
  }

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

    if(req.files && req.files.avatar) {
      req.body.avatar = req.files.avatar[0].path;
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

    if(req.files && req.files.images && req.files.images.length > 0) {
      req.body.images = req.files.images.map(file => file.path);
    } else {
      delete req.body.images;
    }
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

module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id
    await Tour.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    })
    res.json({
      code: "success",
      message: "Xóa tour thành công!"
    })
  } catch (error) {
    res.json({
      code:"error",
      message: "Id không hợp lệ!"
    })
  }
}

module.exports.changeMultỉPatch = async (req, res) => {
  try {
    const {option, ids} = req.body
    switch(option) {
      case 'active':
      case 'inactive':
        await Tour.updateMany({
          _id: {
            $in: ids
          }
        }, {
          status: option
        })
      break
      case 'delete':
        await Tour.updateMany({
          _id: {
            $in: ids
          }
        }, {
          deleted: true,
          deletedBy: req.account.id,
          deletedAt: Date.now()
        })
      break
      case 'undo':
        await Tour.updateMany({
          _id: {
            $in: ids
          }
        }, {
          updatedBy: req.account.id,
          deleted: false
        })
      case 'permanent-delete':
        await Tour.deleteMany({
          _id: {
            $in: ids
          },
          deleted: true
        })
      break;
    }
    res.json({
      code: "success",
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không tồn tại trong hệ thông!"
    })
  }
}

module.exports.trash = async (req, res) => {
  const find = {
    deleted: true
  }
  // Pagination
  const limitItem = 1
  const totalRecord = await Tour.countDocuments(find)
  let page = 1
  if(req.query.page) {
    const currentPage = parseInt(req.query.page)
    if(currentPage > 0) {
      page = currentPage
    }
  }
  const totalPage = Math.ceil(totalRecord/limitItem)
  if(page> totalPage) {
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
  // Hết Pagination
  // Tìm kiếm
  if(req.query.keyword) {
    const keyword = slugify(req.query.keyword, {
      lower: true
    })
    const keywordRegex = new RegExp(keyword)
    find.slug = keywordRegex
  }
  // Hết tìm kiếm
  const tourList = await Tour
  .find(find)
  .sort({position: 'desc'})
  .limit(limitItem)
  .skip(pagination.skip)

  for(const item of tourList) {
    if(item.createdBy) {
      const infoCreatedBy = await AccountAdmin.findOne({
        _id: item.createdBy
      })
      item.createdByFullName = infoCreatedBy.fullName
    }
    if(item.deletedBy) {
      const infoDeletedBy = await AccountAdmin.findOne({
        _id: item.deletedBy
      })
      item.deletedByFullName = infoDeletedBy.fullName
    }
    item.createdAtFormat = moment(item.createdAt).format('HH:mm - DD/MM/YYYY')
    item.deletedAtFormat = moment(item.deletedAt).format('HH:mm - DD/MM/YYYY')
  }

  const accountAdminList = await AccountAdmin
  .find({})
  .select("id fullName")

  const categoryList = await Category
  .find({})
  .select("id parent name")
  const categoryTree = categoryHelper.buildCategoryTree(categoryList)

  res.render('admin/pages/tour-trash.pug' , {
    pageTitle: "Danh sách tour",
    tourList: tourList,
    pagination: pagination
  })
}

module.exports.trashUndoPatch = async (req, res) => {
  try {
    const id = req.params.id
    await Tour.updateOne({
      _id: id
    }, {
      deleted: false
    })
    res.json({
      code: "success",
      message: "Khôi phục tour thành công!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không tồn tại trong hệ thống!"
    })
  }
}

module.exports.trashPermanentDelete = async (req, res) => {
  try {
    const id = req.params.id
    await Tour.deleteOne({
      _id: id,
      deleted: true
    })
    res.json({
      code:"success",
      message: "Xóa vĩnh viễn tour thành công!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không tồn tại trong hệ thống!"
    })
  }
}