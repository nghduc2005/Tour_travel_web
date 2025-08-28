const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)
const schema = mongoose.Schema({
  name: String,
  slug: {
    type: String,
    slug: 'name',
    unique: true
  }
})

const City = mongoose.model('City', schema, 'cities')

module.exports = City