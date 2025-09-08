const Discount = require("../../models/discount.model")
const moment = require('moment')
module.exports.list = async (req, res) => {
  if(!req.permissions.includes('discount-view')) {
    res.redirect(`/${pathAdmin}/dashboard`)
    return
  }
  const find = {
    deleted: false
  }

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
  const limitItem = 2
  let page = 1
  if(req.query.page) {
    const currentPage = req.query.page
    if(currentPage > 0) {
      page = currentPage
    }
  }
  const totalRecord = await Discount.countDocuments(find)
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
  const discountList = await Discount.find(find)
  for(let item of discountList) {
    item.createdAtFormat = moment(item.createdAt).format('DD/MM/YYYY')
    item.startDateFormat = moment(item.startDate).format('DD/MM/YYYY')
    item.endDateFormat = moment(item.endDate).format('DD/MM/YYYY')
  }
  res.render(`admin/pages/discount-list.pug`, {
    pageTitle:"Danh sách mã giảm giá",
    discountList: discountList,
    pagination: pagination
  })
}

module.exports.create = (req, res) => {
  if(!req.permissions.includes('discount-view')) {
    res.redirect(`/${pathAdmin}/dashboard`)
    return
  }
  res.render(`admin/pages/discount-create.pug`, {
    pageTitle:"Tạo mã giảm giá"
  })
}

module.exports.createPost = async (req, res) => {
  if(!req.permissions.includes('discount-view')) {
    res.json({
      code:"error",
      message: "Bạn không có quyền truy cập nội dung này!"
    })
    return
  }
  if(req.body) {
    req.body.percent = parseInt(req.body.percent)
    req.body.maximum = parseInt(req.body.maximum) 
    req.body.createdBy = req.account.id
    req.body.updatedBy = req.account.id
    req.body.startDate = new Date(req.body.startDate)
    req.body.endDate = new Date(req.body.endDate)
    const newRecord = new Discount(req.body)
    await newRecord.save()
    res.json({
      code: "success",
      message: "Tạo mã giảm giá thành công!"
    })
    return
  }
  res.json({
    code: "error",
    message: "Dữ liệu gửi lên không hợp lệ!"
  })
}
module.exports.edit = async (req, res) => {
  if(!req.permissions.includes('discount-view')) {
    res.redirect(`/${pathAdmin}/dashboard`)
    return
  }
    try {
      const discountDetail = await Discount.findOne({
        _id: req.params.id,
        deleted: false
      })
      if(!discountDetail) {
        res.redirect(`/${pathAdmin}/discount/list`)
      }
      discountDetail.startDateFormat = moment(discountDetail.startDate).format('YYYY-MM-DD')
      discountDetail.endDateFormat = moment(discountDetail.endDate).format('YYYY-MM-DD')
      res.render(`admin/pages/discount-edit.pug`, {
        pageTitle:"Sửa mã giảm giá",
        discountDetail: discountDetail
      })
    } catch (error) {
      res.redirect(`/${pathAdmin}/discount/list`)
    }
}
module.exports.editPatch = async (req, res) => {
  if(!req.permissions.includes('discount-view')) {
    res.json({
      code:"error",
      message: "Bạn không có quyền truy cập nội dung này!"
    })
    return
  }
  try {
    req.body.percent = parseInt(req.body.percent)
    req.body.maximum = parseInt(req.body.maximum) 
    req.body.updatedBy = req.account.id
    
    await Discount.updateOne({
      _id: req.params.id,
      deleted: false
    }, req.body)
  } catch (error) {
    res.json({
      code: "error",
      message: "Dữ liệu gửi lên không hợp lệ!"
    })
  }
}

module.exports.deletePatch = async (req, res) => {
  if(!req.permissions.includes('discount-view')) {
    res.json({
      code:"error",
      message: "Bạn không có quyền truy cập nội dung này!"
    })
    return
  }
  try {
    const id = req.params.id
    await Discount.updateOne({
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
  if(!req.permissions.includes('discount-view')) {
    res.json({
      code:"error",
      message: "Bạn không có quyền truy cập nội dung này!"
    })
    return
  }
  try {
    const {option, ids}  = req.body
    switch (option) {
      case "active":
      case "inactive":
        await Discount.updateMany({
          _id: {$in : ids}
        }, {
          status: option
        })
        break;
      case "delete":
        await Discount.updateMany({
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