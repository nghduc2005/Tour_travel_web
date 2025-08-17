const Category = require('../../models/category.model')
const Tour = require('../../models/tour.model')
const moment = require('moment')
const categoryHelper = require('../../helpers/category.helper')
module.exports.home = async (req, res) => {
  const tourListSection2 = await Tour.find({
    deleted: false,
    status: 'active'
  })
  .limit(6)
  for(const item of tourListSection2) {
    item.departureDateFormat = moment(item.departureDate).format('DD/MM/YYYY')
    item.discount = parseInt((1-item.priceNewAdult/item.priceAdult)*100)
  }

  const categorySection4 = '68921a1baf10b719010fe1da'
  const listCategorySection4 = await categoryHelper.getAllSubcategoryIds(categorySection4)
  const tourListSection4 = await Tour.find({
    category: {
      $in: listCategorySection4,
    },
    deleted: false,
    status: 'active'
  })
  .limit(8)

  for(const item of tourListSection4) {
    item.departureDateFormat = moment(item.departureDate).format('DD/MM/YYYY')
    item.discount = parseInt((1-item.priceNewAdult/item.priceAdult)*100)
  }

  const categorySection6 = '68921a5be9d3b75f765564f4'
  const listCategorySection6 = await categoryHelper.getAllSubcategoryIds(categorySection6)
  const tourListSection6 = await Tour.find({
    category: {
      $in: listCategorySection6,
    },
    deleted: false,
    status: 'active'
  })
  .limit(8)
  for(const item of tourListSection6) {
    item.departureDateFormat = moment(item.departureDate).format('DD/MM/YYYY')
    item.discount = parseInt((1-item.priceNewAdult/item.priceAdult)*100)
  }
  res.render(`client/pages/home.pug`, {
    pageTitle: "Trang chủ",
    tourListSection2: tourListSection2,
    tourListSection4: tourListSection4,
    tourListSection6: tourListSection6,
  })
}

