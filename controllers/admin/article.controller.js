const Article = require("../../models/article.model")
const moment = require('moment')
const slugify = require('slugify')
module.exports.list = async (req, res) => {
  if(!req.permissions.includes('article-view')) {
    res.redirect(`/${pathAdmin}/dashboard`)
    return
  }
  const find = {
    deleted: false
  }
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
  const limitItem = 1
  let page = 1
  if(req.query.page) {
    const currentPage = req.query.page
    if(currentPage > 0) {
      page = currentPage
    }
  }
  const totalRecord = await Article.countDocuments(find)
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
  const articleList = await Article
  .find(find)
  .limit(limitItem)
  .skip(pagination.skip)
  for(const item of articleList) {
    item.createdAtFormat = moment(item.createAt).format('DD/MM/YYYY')
  }
  res.render(`admin/pages/article-list.pug`, {
    pageTitle: "Danh sách bài viết",
    articleList: articleList,
    pagination: pagination
  })
}

module.exports.create = (req, res) => {
  if(!req.permissions.includes('article-view')) {
    res.redirect(`/${pathAdmin}/dashboard`)
    return
  }
  res.render(`admin/pages/article-create.pug`, {
    pageTitle: "Tạo bài viết"
  })
}

module.exports.createPost = async (req, res) => {
  if(!req.permissions.includes('article-view')) {
    res.json({
      code: "error",
      message: "Bạn không có quyền truy cập nội dung này!"
    })
    return
  }
  if(req.body) {
    const {title, author, content} = req.body
    const cover = req.file? req.file.path: ''
    const newRecord = new Article({
      title: title,
      author: author,
      content: content,
      cover: cover,
      createdBy: req.account.id,
    })
    await newRecord.save()
    res.json({
      code:"success",
      message: "Tạo bài viết thành công!"
    })
    return
  }
  res.json({
    code:"error",
    message: "Vui lòng nhập đúng yêu cầu!"
  })
}

module.exports.edit = async (req, res) => {
  if(!req.permissions.includes('article-view')) {
    res.redirect(`/${pathAdmin}/dashboard`)
    return
  }
  try {
    const id = req.params.id
    const articleDetail = await Article.findOne({
      _id: id
    })
    if(!articleDetail) {
      res.redirect(`/${pathAdmin}/article/list`)
    }
    res.render(`admin/pages/article-edit.pug`, {
      pageTitle: "Tạo bài viết",
      articleDetail: articleDetail
    })
  } catch (error) {
    res.redirect(`/${pathAdmin}/article/list`)
  }
}

module.exports.editPatch = async(req, res) => {
  if(!req.permissions.includes('article-view')) {
    res.json({
      code: "error",
      message: "Bạn không có quyền truy cập nội dung này!"
    })
    return
  }
  try {
    const id = req.params.id
    if(req.file) {
      req.body.cover = req.file.path;
    } else {
      delete req.body.cover
    }
    req.body.updatedBy = req.account.id
    await Article.updateOne({
      _id: id,
      deleted: false
    }, req.body)
    res.json({
      code:"success",
    })
  } catch (error) {
    res.json({
      code:"error",
      message: "Id không hợp lệ!"
    })
  }
}

module.exports.articleChangeMulti = async (req, res) => {
  if(!req.permissions.includes('article-view')) {
    res.json({
      code: "error",
      message: "Bạn không có quyền truy cập nội dung này!"
    })
    return
  }
  try {
    const {option, ids}  = req.body
    switch (option) {
      case "delete":
        await Article.updateMany({
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