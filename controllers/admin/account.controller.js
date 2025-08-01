module.exports.register = (req, res) => {
  res.render(`admin/pages/register.pug`, {
    pageTitle: "Đăng ký"
  })
}

module.exports.registerPost = (req, res) => {
  console.log(req.body)
  res.json({
    code: "success"
  })
}