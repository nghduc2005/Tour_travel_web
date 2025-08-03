module.exports.list = (req, res) => {
  res.render('admin/pages/category-list.pug', {
    pageTitle: "Danh sách danh mục"
  })
}