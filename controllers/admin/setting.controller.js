module.exports.list = (req, res) => {
  res.render('admin/pages/setting-list.pug', {
    pageTitle: "Danh sách cài đặt"
  })
}