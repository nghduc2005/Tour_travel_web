const Order = require("../../models/order.model")
const variableConfig = require('../../config/variable.config')
const moment = require('moment')
const City = require("../../models/city.model")
const Category = require("../../models/category.model")
module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  }
  // Filter-status
  if(req.query.status) {
    find.status = req.query.status
  }
  // Hết Filter-status
  // Filter payment method
  if(req.query.paymentStatus) {
    find.paymentStatus = req.query.paymentStatus
  }
  // Filter payment method
  // Filter payment status
  if(req.query.paymentMethod) {
    find.paymentMethod = req.query.paymentMethod
  }
  // Filter payment status
  // Filter createdAt
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
  // End filter createdAt
  // Pagination
  const limitItem = 3
  let page = 1
  if(req.query.page) {
    const currentPage = req.query.page
    if(currentPage > 0) {
      page = currentPage
    }
  }
  const totalRecord = await Order.countDocuments(find)
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
  // End pagination
  const orderList = await Order
  .find(find)
  .skip(pagination.skip)
  .limit(limitItem)
  
  if(orderList) {
    for(const order of orderList) {
      order.statusName = variableConfig.orderStatus.find((status) => status.value==order.status).label
      order.paymentStatusName = variableConfig.paymentStatus.find((status) => status.value==order.paymentStatus).label
      order.paymentMethodName = variableConfig.paymentMethod.find((method) => method.value==order.paymentMethod).label
      order.hourCreatedFormat = moment(order.createdAt).format('HH:mm')
      order.dateCreatedFormat = moment(order.createdAt).format('DD/MM/YYYY')
    }
  }
  res.render('admin/pages/order-list.pug', {
    pageTitle: "Danh sách đơn hàng",
    orderList: orderList,
    pagination: pagination,
    variableConfig: variableConfig
  })
}

module.exports.edit = async (req, res) => {
  const id = req.params.id
  const orderDetail = await Order.findOne({
    _id: id,
    deleted: false
  })
  if(orderDetail) {
    orderDetail.orderDate = moment(orderDetail.createdAt).format('YYYY-MM-DDTHH:mm')
    for(const item of orderDetail.items) {
      const locationFrom = await City.findOne({
        _id: item.locationFrom
      })
      item.locationFromName = locationFrom.name
      item.departureDateFormat = moment(item.departureDate).format('DD/MM/YYYY')
    }
  }
  res.render(`admin/pages/order-edit.pug`, {
    pageTitle: "Chỉnh sửa đơn hàng",
    orderDetail: orderDetail,
    variableConfig: variableConfig
  })
}

module.exports.editPatch = async (req, res) => {
  try {
    req.body.updatedBy = req.account.id
    await Order.updateOne({
      _id: req.params.id
    }, req.body)
    res.json({
      code:"success",
      message: "Cập nhật đơn hàng thành công!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không tồn tại trong hệ thống!"
    })
  }
}

module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id
    await Order.updateOne({
      _id: id,
      deleted: false
    }, {
      deleted: true,
      updatedBy: req.account.id,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    })
    res.json({
      code: "success",
      message: "Xóa đơn hàng thành công!"
    })
  } catch (error) {
    res.json({
      code:"error",
      message: "Id không tồn tại trong hệ thống!"
    })
  }
}