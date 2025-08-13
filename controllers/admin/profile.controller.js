const bcrypt = require('bcryptjs')
const AccountAdmin = require('../../models/account-admin.model')
module.exports.edit = async (req, res) => {
  const accountDetail = await AccountAdmin.findOne({
    _id: req.account.id
  })
  res.render(`admin/pages/profile-edit.pug`, {
    pageTitle: "Thông tin cá nhân",
    accountDetail: accountDetail
  })
}

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.account.id
    req.body.updatedBy = id
    if(req.file) {
      req.body.avatar = req.file.path
    } else {
      delete req.body.avatar
    }

    await AccountAdmin.updateOne({
      _id: id,
    }, req.body)
    res.json({
      code: "success",
      message: "Cập nhật thành công!"
    })
  } catch (error) {
    console.log(error)
    res.json({
      code: "error",
      message: "Lỗi hệ thống!"
    })
  }
}

module.exports.changePassword = (req, res) => {
  res.render('admin/pages/profile-change-password.pug', {
    pageTitle: "Đổi mật khẩu"
  })
}

module.exports.changePasswordPatch = async (req, res) => {
  if(!req.body.password) {
    res.json({
      code: "error",
      message: "Đổi mật khẩu thất bại!"
    })
  }
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(req.body.password, salt)
  await AccountAdmin.updateOne({
    _id: req.account.id
  }, {
    password: hashPassword
  })
  res.json({
    code: "success",
    message: "Đổi mật khẩu thành công!"
  })
}