const mongoose = require("mongoose");
const schema = mongoose.Schema(
  {
    email: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedBy: String,
    deletedAt: Date
  },
  {
    timestamps: true,
  }
)

const Contact = mongoose.model('Contact', schema, 'contacts')

module.exports = Contact