const Joi = require('joi')
module.exports.createPost = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().trim().strict().messages({
      "string.empty": "Vui lòng nhập tên danh mục!"
    }),
    parent: Joi.string(),
    position: Joi.string(),
    status: Joi.string(),
    avatar: Joi.string(),
    description: Joi.string()
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