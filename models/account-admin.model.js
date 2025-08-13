const mongoose = require('mongoose')

const schema = mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  phone: String,
  role: String,
  positionCompany: String,
  status: {
    type: String,
    default: 'initial'
  },
  avatar: String,
  createdBy: String,
  updatedBy: String,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedBy: String,
  deletedAt: Date
}, {
  timestamps: true
})

const AccountAdmin = mongoose.model('AccountAdmin', schema, 'accounts-admin')

module.exports = AccountAdmin