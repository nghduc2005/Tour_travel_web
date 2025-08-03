module.exports.list = (req, res) => {
  res.render('admin/pages/order-list.pug', {
    pageTitle: "Danh sách đơn hàng"
  })
}