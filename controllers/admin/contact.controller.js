const Contact = require("../../models/contact.model")
const moment = require('moment')
module.exports.list = async (req, res) => {
  if(!req.permissions.includes('contact-view')) {
    res.redirect(`/${pathAdmin}/dashboard`)
    return
  }
  const find = {
    deleted: false
  }
  if(req.query.keyword) {
    const keyword = new RegExp(req.query.keyword)
    find.email = keyword
  }

  const dateFilter = {}
  if(req.query.startDate) {
    const startDate = moment(req.query.startDate).startOf('date').toDate()
    dateFilter.$gte = startDate
  }
  if(req.query.endDate) {
    const endDate = moment(req.query.endDate).endOf('date').toDate()
    dateFilter.$lte = endDate
  }
  if(Object.keys(dateFilter).length>0) {
    find.createdAt = dateFilter
  }
  const limitItem = 3
  let page = 1
  if(req.query.page) {
    const currentPage = req.query.page
    if(currentPage > 0) {
      page = currentPage
    }
  }
  const totalRecord = await Contact.countDocuments(find)
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
  const contactList = await Contact
  .find(find)
  .skip(pagination.skip)
  .limit(limitItem)

  for(const item of contactList) {
    item.createdAtFormat = moment(item.createdAt).format('HH:mm - DD/MM/YYYY')
  }
  res.render('admin/pages/contact-list.pug', {
    pageTitle: "Danh sách thông tin liên hệ",
    contactList: contactList,
    pagination: pagination
  })
}

module.exports.delete = async (req, res) => {
  if(!req.permissions.includes('contact-view')) {
    res.json({
      code:"error",
      message: "Bạn không có quyền truy cập nội dung này!"
    })
    return
  }
  const id = req.params.id
  await Contact.updateOne({
    _id: id
  }, {
    deleted: true,
    deletedBy: req.account.id,
    deletedAt: Date.now()
  })
  res.json({
    code: "success"
  })
}

module.exports.changeMulti = async (req, res) => {
  if(!req.permissions.includes('contact-view')) {
    res.json({
      code:"error",
      message: "Bạn không có quyền truy cập nội dung này!"
    })
    return
  }
  const {option, ids} = req.body
  if(option) {
    await Contact.updateMany({
      _id: {
        $in: ids
      }
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    })
  }
  res.json({
    code: "success"
  })
}