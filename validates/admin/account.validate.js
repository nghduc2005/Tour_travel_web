const Joi = require('joi')
module.exports.loginPost = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required().trim().strict().email({tlds: {allow: ['com', 'net']}})
    .messages({
      'string.empty': "Vui lòng nhập email đăng nhập!",
      'string.email': "Vui lòng nhập email có đuôi .net hoặc .com!"
    }),
    password: Joi.string().required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$"))
    .messages({
      'string.empty': "Vui lòng nhập mật khẩu đăng nhập!",
      'string.pattern.base': "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
    }),
    rememberPassword: Joi.boolean()
  })
  
  const {error} = schema.validate(req.body)
  if(error) {
    const errorMessage = error.details[0].message
    console.log(error)
    res.json({
      code: "error",
      message: errorMessage
    })
    return
  }
  next()
}

module.exports.forgotPasswordPost = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required().trim().strict().email({tlds: {allow: ['net', 'com']}})
    .messages({
      "string.empty": "Vui lòng nhập email đăng nhập!",
      "string.email": "Vui lòng nhập email có đuôi .net hoặc .com!"
    })
  })
  const {error} = schema.validate(req.body)
  if(error) {
    console.log(error)
    const errorMessage = error.details[0].message
    res.json({
      code:"error",
      message: errorMessage
    })
    return
  }
  next()
}

module.exports.otpPasswordPost = (req, res, next) => {
  const schema = Joi.object({
    otp: Joi.string().required().length(6).trim().strict().pattern(new RegExp('^[0-9]+$')).messages({
      "string.empty": "Vui lòng nhập mã OTP!",
      "string.pattern.base": "Mã OTP chỉ chứa các số!",
      "string.length": "Mã OTP chỉ chứa 6 số!"
    }),
    email: Joi.string()
  })
  const {error} = schema.validate(req.body)
  if(error) {
    console.log(error)
    const errorMessage = error.details[0].message
    res.json({
      code:"error",
      message: errorMessage
    })
    return
  }
  next()
}

module.exports.resetPasswordPost = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$"))
    .messages({
      'string.empty': "Vui lòng nhập mật khẩu đăng nhập!",
      'string.pattern.base': "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
    }),
  })
  const {error} = schema.validate(req.body)
  if(error) {
    console.log(error)
    const errorMessage = error.details[0].message
    res.json({
      code:"error",
      message: errorMessage
    })
    return
  }
  next()
}

module.exports.registerPost = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().required().max(256).messages({
      "string.max": "Tên có độ dài tối đa 256 ký tự!",
      "string.empty": "Vui lòng điền họ và tên!",
    }),
    email: Joi.string().required().trim().strict().email({tlds: {allow: ['net', 'com']}}).messages({
      "string.empty": "Vui lòng nhập email đăng ký!",
      "string.email": "Vui lòng nhập email có đuôi .net hoặc .com!"
    }),
    password: Joi.string().required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$"))
    .messages({
      'string.empty': "Vui lòng nhập mật khẩu!",
      'string.pattern.base': "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
    })
  })
  const {error} = schema.validate(req.body)
  if(error) {
    console.log(error)
    const errorMessage = error.details[0].message
    res.json({
      code: "error",
      message: errorMessage
    })
    return
  }
  next()
}