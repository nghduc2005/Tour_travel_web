const AccountAdmin = require('../../models/account-admin.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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