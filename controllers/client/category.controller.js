const Tour = require("../../models/tour.model")
const Category = require('../../models/category.model')
const categoryHelper = require('../../helpers/category.helper')
const City = require("../../models/city.model")
const priceList = require('../../config/price.config')
const slugify = require("slugify")
module.exports.list = async (req, res) => {
  const slug = req.params.slug
  const categoryDetail = await Category.findOne({
    slug: slug,
    deleted: false
  })
  if(categoryDetail) {
    const breadcrumb = {
      title: categoryDetail.name,
      avatar: categoryDetail.avatar,
      list: [
        {
          title: "Trang chủ",
          link: "/"
        }
      ]
    }
    if(categoryDetail.parent) {
      const parent = await Category.findOne({
        _id: categoryDetail.parent,
        deleted: false,
        status: 'active'
      })
      if(parent) {
        breadcrumb.list.push({
          title: parent.name,
          link: `/category/${parent.slug}`
        })
      }
    }
  breadcrumb.list.push({
    title: categoryDetail.name,
        link: `/category/${categoryDetail.slug}`
  })
  const categoryIdsList = await categoryHelper.getAllSubcategoryIds(categoryDetail._id)
  const find = {
    category: {
      $in: categoryIdsList
    },
    deleted: false,
    status: "active"
  }
  if(req.query.locations) {
    const location = await City.findOne({
      slug: req.query.locations
    })
    find.locations = location.id
  }
  if(req.query.departure) {
    const location = await City.findOne({
      slug: req.query.locations
    })
    find.departure = location.id
  }
  if(req.query.departureDate) {
    find.departureDate = new Date(req.query.departureDate)
  }
  if(req.query.stockAdult) {
    find.stockAdult = {
      $gte: parseInt(req.query.stockAdult)
    }
  }
  if(req.query.stockChildren) {
    find.stockChildren = {
      $gte: parseInt(req.query.stockChildren)
    }
  }
  if(req.query.stockBaby) {
    find.stockBaby = {
      $gte: parseInt(req.query.stockBaby)
    }
  }
  if(req.query.price) {
    let [minimum, maximum] = req.query.price.split('-')
    minimum = parseInt(minimum)
    maximum = parseInt(maximum)
    find.priceNewAdult = {
      $gte: minimum,
      $lte: maximum
    }
  }
  let typeSort;
  if(req.query.sort) {
    const sort = req.query.sort
    if(sort=='sort=high-discount') {
      
    } else if(sort=='increasing-price') {
      typeSort = {
        priceNewAdult: 'asc'
      }
    } else if(sort=='decreasing-price') {
      typeSort = {
        priceNewAdult: 'desc'
      }
    } else if(sort=='most-viewed') {

    }
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
  const totalRecord = await Tour.countDocuments(find)
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
    const tourList = await Tour
    .find(find)
    .sort(typeSort)
    const cityList = await City.find({})
    for(let item of cityList) {
      item.slug = slugify(item.name.toLowerCase())
    }
    res.render(`client/pages/tour-list.pug`, {
      pageTitle: "Danh sách tour",
      breadcrumb: breadcrumb,
      tourList: tourList,
      categoryDetail: categoryDetail,
      cityList: cityList,
      priceList: priceList,
      pagination: pagination
    })
  } else {
    res.redirect('/')
  }
}

