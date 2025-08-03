const AccountAdmin = require('../../models/account-admin.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomGenerate } = require('../../helpers/random-generate.helper')
const { sendMail } = require('../../helpers/mail.helper')
const ForgotPassword = require('../../models/forgot-password.model')

module.exports.register = (req, res) => {
  res.render(`admin/pages/register.pug`, {
    pageTitle: "Đăng ký"
  })
}

module.exports.registerPost = async(req, res) => {
  const {fullName, email, password} = req.body
  const existAccount = await AccountAdmin.findOne({
    email: email
  })
  if(existAccount) {
    res.json({
      code: "error",
      message: "Email đã tồn tại trong hệ thống!"
    })
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const newAccount = new AccountAdmin({
    fullName,
    email,
    password: hashPassword
  })
  await newAccount.save()
  res.json({
    code: "success",
    message: "Đăng ký thành công!"
  })
}

module.exports.registerInitial = (req, res) => {
  res.render(`admin/pages/register-initial.pug`, {
    pageTitle: `Đăng ký thành công!`
  })
}

module.exports.login = (req, res) => {
  res.render(`admin/pages/login.pug`, {
    pageTitle: "Đăng nhập"
  })
}

module.exports.loginPost = async (req, res) => {
  const {email, password, rememberPassword} = req.body
  const existAccount = await AccountAdmin.findOne({
    email: email,
    status: "active"
  })
  if(!existAccount) {
    res.json({
      code:"error",
      message: "Tài khoản đăng nhập không tồn tại hoặc chưa được kích hoạt!"
    })
    return;
  }

  const verifyPassword = await bcrypt.compare(password, existAccount.password);
  if(!verifyPassword) {
    res.json({
      code:"error",
      message: "Mật khẩu không hợp lệ!"
    })
  }
  const token = jwt.sign({
    id: existAccount.id,
    email: existAccount.email
  }, process.env.JWT_SECRET, {
    expiresIn: rememberPassword ? '30d' : '1d'
  })
  res.cookie('token', token, {
    maxAge: rememberPassword? 30*24*60*60*1000 : 24*60*60*1000,
    httpOnly: true,
    sameSites: "strict"
  })
  res.json({
    code:"success",
    message: "Đăng nhập thành công!"
  })
}

module.exports.logoutPost = (req, res) => {
  res.clearCookie('token')
  res.json({
    code:"success",
    message: "Đăng xuất thành công!"
  })
}

module.exports.forgotPassword = (req, res) => {
  res.render(`admin/pages/forgot-password.pug`, {
    pageTitle: "Quên mật khẩu!"
  })
}

module.exports.forgotPasswordPost = async (req, res) => {
  console.log(req.body.email)
  const existAccount = await AccountAdmin.findOne({
    email: req.body.email,
    status: "active"
  })
  if(!existAccount) {
    res.json({
      code:"error",
      message: "Tài khoản không tồn tại hoặc chưa kích hoạt!"
    })
    return;
  }
  const existForgotPassword = await ForgotPassword.findOne({
    email: existAccount.email,
  })
  if(existForgotPassword) {
    res.json({
      code: "error",
      message: "Vui lòng thử lại sau 5 phút!"
    })
    return;
  }

  const otp = randomGenerate(6)
  const newRecord = new ForgotPassword({
    email: existAccount.email,
    otp: otp,
    expireAt: Date.now() + 3*60*1000
  })
  await newRecord.save()

  const subject = `Mã OTP lấy lại mật khẩu`;
  const content = `Mã OTP của bạn là <b style="color: green;">${otp}</b>. Mã OTP có hiệu lực trong 5 phút, vui lòng không cung cấp cho bất kỳ ai.`;
  sendMail(existAccount.email, subject, content);

  res.json({
    code: "success",
    message: "Mã OTP đang được gửi đến email của bạn!"
  })
}

module.exports.otpPassword = (req, res) => {
  res.render(`admin/pages/otp-password`, {
    pageTitle: "Nhập mã OTP"
  })
}

module.exports.otpPasswordPost = async (req, res) => {
  const {email, otp} = req.body
  const existAccount = await ForgotPassword.findOne({
    email: email,
  })
  if(!existAccount) {
    res.json({
      code: "error",
      message: "Email không hợp lệ!"
    })
  }
  if(existAccount.otp != otp) {
    res.json({
      code: "error",
      message: "Mã OTP không chính xác!"
    })
  }

  const account = await AccountAdmin.findOne({
    email: existAccount.email
  })

  const token = jwt.sign({
    id: account.id,
    email: account.email
  }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  })

  res.cookie("token", token, {
    maxAge: 24*60*60*1000,
    httpOnly: true,
    sameSites: "strict"
  })
  res.json({
    code: "success",
    message: "Xác thực OTP thành công!"
  })
}

module.exports.resetPassword = (req, res) => {
  res.render(`admin/pages/reset-password`, {
    pageTitle: "Đổi mật khẩu"
  })
}

module.exports.resetPasswordPost = async (req, res) => {
  const {password} = req.body

  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(password, salt)

  await AccountAdmin.updateOne({
    _id: req.account.id,
    email: req.account.email,
    status: "active"
  }, {
    password: hashPassword
  })

  res.json({
    code: "success",
    message: "Đổi mật khẩu thành công!"
  })
} 