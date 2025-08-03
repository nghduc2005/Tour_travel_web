module.exports.list = (req, res) => {
  res.render('admin/pages/tour-list.pug' , {
    pageTitle: "Danh sách tour"
  })
}