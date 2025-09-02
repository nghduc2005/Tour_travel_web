const mongoose = require('mongoose')

const schema = mongoose.Schema({
  fullName: String,
  email: String,
  content: String,
  deleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
})

const Message = mongoose.model('Message', schema, 'messages')
module.exports = Message