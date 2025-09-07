const { json } = require("express")
const City = require("../../models/city.model")
const Discount = require("../../models/discount.model")
const Tour = require("../../models/tour.model")
const moment = require('moment')
module.exports.cart = (req, res) => {
  res.render('client/pages/cart.pug', {
    pageTitle: "Giỏ hàng"
  })
}

module.exports.detail = async (req, res) => {
  let {cart, discount}= req.body
  for(const item of cart) {
    const tourInfo = await Tour.findOne({
      _id: item.tourId,
      status: "active",
      deleted: false
    })
    if(tourInfo) {
      item.avatar = tourInfo.avatar;
      item.name = tourInfo.name;
      item.slug = tourInfo.slug;
      item.departureDateFormat = moment(tourInfo.departureDate).format("DD/MM/YYYY");
      item.priceNewAdult = tourInfo.priceNewAdult;
      item.priceNewChildren = tourInfo.priceNewChildren;
      item.priceNewBaby = tourInfo.priceNewBaby;

      const city = await City.findOne({
        _id: item.locationFrom
      });
      item.locationFromName = city.name;
    } else {
      // Nếu không lấy được tour thì xóa tour khỏi giỏ hàng
      const indexItem = cart.findIndex(tour => tour.tourId == item.tourId);
      cart.splice(indexItem, 1);
    }
  }
  res.json({
    code: "success",
    cart: cart,
    discount: discount
  })
}


module.exports.couponPost = async(req, res) => {
  const {coupon} = req.body
  const couponDetail = await Discount.findOne({
    name: coupon,
    deleted: false,
    status: 'active'
  })
  if(couponDetail) {
    if(Date.now() > couponDetail.endDate) {
      res.json({
        code:"error",
        message: "Mã giảm giá đã hết hạn!"
      })
      return
    }
    res.json({
      code:"success",
      discount: couponDetail
    })
    return
  }
  res.json({
    code:"error",
    message: "Mã giảm giá không hợp lệ!"
  })
}