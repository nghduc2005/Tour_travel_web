const Joi = require('joi')
module.exports.createPost = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().trim().strict().messages({
      "string.empty": "Vui lòng nhập tên tour!"
    }),
    category: Joi.string().required().message({
      "string.empty": "Vui lòng chọn danh mục!"
    }),
    position: Joi.string(),
    status: Joi.string(),
    avatar: Joi.string(),
    priceAdult: Joi.string(),
    priceChildren: Joi.string(),
    priceBaby: Joi.string(),
    priceNewAdult: Joi.string(),
    priceNewChildren: Joi.string(),
    priceNewBaby: Joi.string(),
    stockAdult: Joi.string(),
    stockChildren: Joi.string(),
    stockBaby: Joi.string(),
    locations: Joi.array().items(Joi.string()),
    time: Joi.string(),
    vehicle: Joi.string(),
    departureDate: Joi.string(),
    information: Joi.string(),
    schedules: Joi.array().items(Joi.object({
      title: Joi.string().required().trim().strict().message({
        "string.empty": "Vui lòng nhập tiêu đề lịch trình"
      }),
      description: Joi.string()
    })),
    images: Joi.array().items(Joi.string())
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