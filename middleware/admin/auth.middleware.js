const AccountAdmin = require("../../models/account-admin.model");
const jwt = require(`jsonwebtoken`);
const Role = require("../../models/role.model");
module.exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token
    if(!token) {
      res.redirect(`/${pathAdmin}/account/login`)
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const {id, email} = decoded
    const existAccount = await AccountAdmin.findOne({
      _id: id,
      email: email,
      status: "active"
    })
    if(!existAccount) {
      res.clearCookie('token')
      res.redirect(`/${pathAdmin}/account/login`)
      return;
    }
    const roleName = await Role.findOne({
      _id: existAccount.role
    })
    existAccount.roleName = roleName.name
    req.account = existAccount;
    res.locals.account = existAccount;
    next();
  } catch (error) {
    res.clearCookie('token')
    res.redirect(`/${pathAdmin}/account/login`)
  }
}

module.exports.roleAuth = async (req, res, next) => {
  try {
    if(req.account.role) {
      const roleDetail = await Role.findOne({
        _id: req.account.role
      })
      if(!roleDetail) {
        res.redirect(`/${pathAdmin}/account/login`)
      }
      req.permissions = roleDetail.permissions
      next()
    }
  } catch (error) {
    res.redirect(`/${pathAdmin}/account/login`)
  }
}