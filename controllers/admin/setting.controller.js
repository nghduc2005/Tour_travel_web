const WebsiteInfo = require("../../models/website-info.model")

module.exports.list = (req, res) => {
  res.render('admin/pages/setting-list.pug', {
    pageTitle: "Danh sách cài đặt"
  })
}

module.exports.websiteInfo = async(req, res) => {
  const websiteInfo = await WebsiteInfo.findOne({});
  console.log(websiteInfo)
  res.render('admin/pages/setting-website-info.pug', {
    pageTitle: "Thông tin website",
    websiteInfo: websiteInfo
  })
}

module.exports.websiteInfoPatch = async (req, res) => {
  if(req.files && req.files.logo) {
    req.body.logo = req.files.logo[0].path
  } else {
    delete req.body.logo
  }

  if(req.files && req.files.favicon) {
    req.body.favicon = req.files.favicon[0].path
  } else {
    delete req.body.favicon
  }
  const websiteInfo = await WebsiteInfo.findOne({})
  if(websiteInfo) {
    await WebsiteInfo.updateOne({
      _id: websiteInfo.id
    }, req.body)
  } else {
    const newWebsiteInfo = new WebsiteInfo(req.body)
    await newWebsiteInfo.save()
  }
  res.json({
    code: "success"
  })
}

module.exports.accountAdmin = (req, res) => {
  res.render('admin/pages/setting-account-admin-list.pug', {
    pageTitle: "Danh sách tài khoản quản trị"
  })
}
module.exports.roleList = (req, res) => {
  res.render('admin/pages/setting-role-list.pug', {
    pageTitle: "Danh sách nhóm quyền"
  })
}