const Tour = require("../../models/tour.model")
const Category = require('../../models/category.model')
const City = require('../../models/city.model')
const moment = require('moment')
module.exports.detail = async (req, res) => {
    const tourDetail = await Tour.findOne({
      slug: req.params.slug,
      status: 'active',
      deleted: false
    })
    if(tourDetail) {
      tourDetail.departureDateFormat = moment(tourDetail.departureDate).format('DD/MM/YYYY')
      const cityList = await City.find({
        _id: {
          $in: tourDetail.locations
        }
      })
      const breadcrumb = {
        image: tourDetail.avatar,
        title: tourDetail.name,
        list: [
          {
            link: '/',
            title: "Trang chủ"
          }
        ]
      }
      const category = await Category.findOne({
        _id: tourDetail.category,
        deleted: false,
        status: 'active'
      })
      if(category) {
        if(category.parent) {
          const parentCategory = await Category.findOne({
            _id: category.parent,
            deleted: false,
            status: "active"
          })
  
          if(parentCategory) {
            breadcrumb.list.push({
              link: `/category/${parentCategory.slug}`,
              title: parentCategory.name
            })
          }  
        }
         // Thêm danh mục hiện tại
        breadcrumb.list.push({
          link: `/category/${category.slug}`,
          title: category.name,
        })
      }
      res.render(`client/pages/tour-detail`, {
        pageTitle: "Chi tiết tour",
        breadcrumb: breadcrumb, 
        tourDetail: tourDetail,
        cityList: cityList
      })
    } else {
      res.redirect('/')
    }
} 