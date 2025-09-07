const mongoose = require("mongoose");
const schema = mongoose.Schema(
  {
    name: String,
    percent: Number,
    maximum: Number,
    startDate: Date,
    endDate: Date,
    status: String,
    deleted: {
      type: Boolean,
      default: false
    },
    createdBy: String,
    updatedBy: String,
    deletedBy: String,
    deletedAt: Date
  },
  {
    timestamps: true,
  }
)

const Discount = mongoose.model('Discount', schema, 'discounts')

module.exports = Discount