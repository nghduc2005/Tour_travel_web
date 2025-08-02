const mongoose = require('mongoose')

const schema = mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  status: {
    type: String,
    default: 'initial'
  }
}, {
  timestamps: true
})

const AccountAdmin = mongoose.model('AccountAdmin', schema, 'account-admin')

module.exports = AccountAdmin