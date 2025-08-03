module.exports.list = (req, res) => {
  res.render('admin/pages/contact-list.pug', {
    pageTitle: "Danh sách thông tin liên hệ"
  })
}