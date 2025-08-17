const WebsiteInfo = require('../../models/website-info.model')
module.exports.websiteInfo = async (req, res, next) => {
  const settingWebsiteInfo = await WebsiteInfo.findOne({})
  res.locals.settingWebsiteInfo = settingWebsiteInfo
  next()
}