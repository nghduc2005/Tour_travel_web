const slugify = require('slugify')
const moment = require('moment')
const Tour = require('../../models/tour.model')
module.exports.list = async (req, res) => {
  const find = {
    deleted: false,
    status: "active"
  }
  if(req.query.locationFrom) {
    find.locations = req.query.locationFrom
  }

  if(req.query.locationTo) {
    const keyword = slugify(req.query.locationTo, {
      lower: true
    })
    const keywordRegex = new RegExp(keyword)
    find.slug = keywordRegex
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
    const [priceMin, priceMax] = req.query.price.split('-').map(item => parseInt(item))
    find.priceNewAdult = {
      $gte: priceMin,
      $lte: priceMax
    };
  }
  const tourList = await Tour.find(find)
  for(const item of tourList) {
    item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
  }
  res.render("client/pages/search", {
    pageTitle: "Kết quả tìm kiếm",
    tourList: tourList
  });

}