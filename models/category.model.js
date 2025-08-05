const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)

const schema = mongoose.Schema({
  name: String,
  position: Number,
  parent: String,
  description: String,
  status: String,
  avatar: String,
  slug: {
    type: String,
    slug: 'name',
    unique: true
  },
  deleted: {
    type: Boolean,
    default: false
  },
  createdBy: String,
  updatedBy: String,
  deletedBy: String,
  deletedAt: Date,
}, {
  timestamps: true
})

const Category = mongoose.model('Category', schema, 'categories')
module.exports = Category