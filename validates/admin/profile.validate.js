const Joi = require('joi')
module.exports.editPost = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().required.trim().strict().messages({
      "string.empty": "Vui lòng nhập họ và tên!"
    }),
    email: Joi.string().required().trim().strict().email({tlds: {allow: ['net', 'com']}})
    .messages({
      "string.empty": "Vui lòng nhập email!",
      "string.email": "Vui lòng nhập email có đuôi .net hoặc .com!"
    }),
    phone: Joi.string().required().pattern('^(0[3|5|7|8|9])[0-9]{8}$').trim().strict().messages({
      "string.empty": "Vui lòng nhập số điện thoại!",
      "string.pattern.base": "Vui lòng nhập số điện thoại đúng định dạng!"
    }),
    avatar: Joi.string()
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

module.exports.changePasswordPost = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$"))
    .messages({
      'string.empty': "Vui lòng nhập mật khẩu mới!",
      'string.pattern.base': "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
    }) 
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
