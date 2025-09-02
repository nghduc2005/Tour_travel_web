const { sendMail } = require("../../helpers/mail.helper")
const Message = require("../../models/messages.model")
const moment = require('moment')
module.exports.messagesList = async (req, res) => {
  const find = {
    deleted: false
  }
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
  const totalRecord = await Message.countDocuments(find)
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
  const messagesList = await Message
  .find(find)
  .limit(limitItem)
  .skip(pagination.skip)
  for (item of messagesList) {
    item.createdAtFormat = moment(item.createdAt).format('HH:mm DD/MM/YYYY')
  }
  res.render(`admin/pages/messages-list.pug`, {
    pageTitle: "Quản lý tin nhắn",
    messagesList: messagesList,
    pagination: pagination
  })
}

module.exports.messagesRead = async(req, res) => {
  try {
    const id = req.params.id
    const messagesDetail = await Message.findOne({
      _id: id
    })
    
    if(messagesDetail) {
      res.render(`admin/pages/messages-read.pug`, {
        pageTitle: "Chi tiết tin nhắn",
        messagesDetail: messagesDetail
      })
    }
    
  } catch (error) {
    res.redirect(`/${pathAdmin}/messages/list`)
  }
}

module.exports.messagesReadPost = async (req, res) => {
  try {
    const mailDetail = await Message.findOne({
      email: req.body.email
    })
    if(mailDetail) {
      sendMail(req.body.email, req.body.title, req.body.content)
      res.json({
        code:"success"
      })
    }
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}

module.exports.messagesReadPatch = async (req, res) => {
  try {
    const id = req.params.id
    if(id) {
      await Message.updateOne({
        _id: id
      }, {
        deleted: true
      })
      res.json({
        code: "success"
      })
      return
    }
    res.json({
      code: "error"
    })
  } catch (error) {
    console.log(error)
    res.json({
      code: "error"
    })
  }
}

module.exports.messagesChangeMulti = async (req, res) => {
  try {
    const {option, ids}  = req.body
    switch (option) {
      case "delete":
        await Message.updateMany({
          _id: { $in: ids }
        }, {
          deleted: true,
        });
      break;
    }
    res.json({
      code: "success"
    })
  } catch (error) {
    console.log(error)
    res.json({
      code: "error",
      message: "Id không tồn tại trong hệ thống!"
    })
  }
}