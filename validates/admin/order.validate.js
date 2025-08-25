const Joi = require('joi')
module.exports.editPost = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().required().trim().strict().messages({
      "string.empty": "Vui lòng nhập tên khách hàng!"
    }),
    phone: Joi.string().required().pattern('^(0[3|5|7|8|9])[0-9]{8}$').trim().strict().messages({
      "string.empty": "Vui lòng nhập số điện thoại!",
      "string.pattern.base": "Vui lòng nhập số điện thoại đúng định dạng!"
    }),
    note: Joi.string(),
    paymentMethod: Joi.string(),
    paymentStatus: Joi.string(),
    status: Joi.string(),
  })
  const {error} = schema.validate(req.body)
  if(error) {
    const errorMessage = error.details[0].message
    res.json({
      code:"error",
      message: errorMessage
    })
    return
  }
  next()
}