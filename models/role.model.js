const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)
const schema = mongoose.Schema({
  name: String,
  description: String,
  permissions: Array,
  createdBy: String,
  updatedBy: String,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedBy: String,
  deletedAt: Date,
  slug: {
    slug: 'name',
    type: String,
    unique: true
  }
}, {
  timestamps: true
})

const Role = mongoose.model('Role', schema, 'roles')
module.exports = Role