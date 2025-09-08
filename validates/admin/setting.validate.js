const Joi = require('joi')
module.exports.websiteInfoPost = (req, res, next) => {
  const schema = Joi.object({
    websiteName: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập tên website"
    }),
    phone: Joi.string().required().pattern('^(0[3|5|7|8|9])[0-9]{8}$').trim().strict().messages({
      "string.empty": "Vui lòng nhập số điện thoại!",
      "string.pattern.base": "Vui lòng nhập số điện thoại đúng định dạng!"
    }),
    email: Joi.string().required().trim().strict().email({tlds: {allow: ['net', 'com']}})
    .messages({
      "string.empty": "Vui lòng nhập email!",
      "string.email": "Vui lòng nhập email có đuôi .net hoặc .com!"
    }),
    address: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập địa chỉ!"
    }),
    logo: Joi.string(),
    favicon: Joi.string()
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
      'string.empty': "Vui lòng nhập mật khẩu đăng nhập!",
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

module.exports.accountAdminPost = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().required().trim().strict().messages({
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
    role: Joi.string(),
    positionCompany: Joi.string(),
    status: Joi.string(),
    password: Joi.string().required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$"))
    .messages({
      'string.empty': "Vui lòng nhập mật khẩu đăng nhập!",
      'string.pattern.base': "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
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
module.exports.rolePost = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().trim().strict().messages({
      "string.empty": "Vui lòng nhập họ và tên!"
    }),
    description: Joi.string(),
    permissions: Joi.array().items(Joi.string()).required().min(1).messages({
      "array.min": "Vui lòng chọn ít nhất một quyền!",
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