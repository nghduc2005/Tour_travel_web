const Article = require('../../models/article.model')
const moment = require('moment')
module.exports.list = async(req, res) => {
  const find = {
    deleted: false
  }
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
  const articleList = await Article.find(find)
  .sort({
    createdAt:  'desc'
  }
  )
  .skip(pagination.skip)
  .limit(limitItem)
  if(articleList) {
    for(const item of articleList) {
      item.createdAtFormat = moment(item.createdAt).format('DD/MM/YYYY')
    }
  }
  res.render('client/pages/article.pug', {
    pageTitle: "Danh sách bài viết",
    articleList: articleList,
    pagination: pagination
  })
}

module.exports.detail = async (req, res) => {
  const articleDetail = await Article.findOne({
    slug: req.params.slug,
    deleted: false
  })
  const articleSlugList = await Article.find({
    deleted: false
  })
  .select('slug title')
  .limit(3)
  .sort({
    createdAt: "desc"
  })
  articleDetail.createdAtFormat = moment(articleDetail.createdAt).format("DD/MM/YYYY")
  res.render('client/pages/article-detail.pug', {
    pageTitle: articleDetail.title,
    articleDetail: articleDetail,
    articleSlugList: articleSlugList
  })
}