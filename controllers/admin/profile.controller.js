module.exports.edit = (req, res) => {
  res.render(`admin/pages/profile-edit.pug`, {
    pageTitle: "Thông tin cá nhân"
  })
}