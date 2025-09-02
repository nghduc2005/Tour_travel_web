const Contact = require("../../models/contact.model")
const Message = require("../../models/messages.model")

module.exports.contact = (req, res) => {
  res.render('client/pages/contact-us.pug', {
    pageTitle: "Thông tin liên hệ"
  })
}

module.exports.createPost = async (req, res) => {
  const { email } = req.body
  const existEmail = await Contact.findOne({
    email: email
  })
  if(existEmail) {
    res.json({
      code: "error",
      message: "Email của bạn đã được đăng ký!"
    })
    return
  }
  const newRecord = new Contact(req.body)
  await newRecord.save()
  res.json({
    code: "success"
  });

}

module.exports.contentPost = async (req, res) => {
  if(req.body) {
    const newRecord = new Message(req.body)
    await newRecord.save()
  }
  res.json( {
    code: "success",
  })
}