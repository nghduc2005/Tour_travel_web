module.exports.list = (req, res) => {
  res.render(`client/pages/tour-list.pug`, {
    pageTitle: "Danh sách tour"
  })
}

