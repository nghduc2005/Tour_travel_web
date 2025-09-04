const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)
const schema = mongoose.Schema({
  title: String,
  author: String,
  updatedBy: String,
  createdBy: String,
  content: String,
  cover: String,
  deleted: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    slug: 'title',
    unique: true
  }
}, {
  timestamps: true
})

const Article = mongoose.model('Article', schema, 'articles')

module.exports = Article