module.exports.list = (req, res) => {
  res.render('admin/pages/user-list.pug', {
    pageTitle: "Danh sách người dùng"
  })
}