const mongoose = require('mongoose')
const schema = mongoose.Schema({
  websiteName: String,
  phone: String,
  email: String,
  address: String,
  logo: String,
  favicon: String,
})

const WebsiteInfo = mongoose.model('WebsiteInfo', schema, 'website-info')
module.exports = WebsiteInfo