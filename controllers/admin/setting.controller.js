const AccountAdmin = require("../../models/account-admin.model");
const WebsiteInfo = require("../../models/website-info.model")
const permissionConfig = require('../../config/permissions.config')
const Role = require('../../models/role.model');
const slugify = require('slugify');
const moment = require('moment')
const { genSalt, hash } = require("bcryptjs");
module.exports.list = (req, res) => {
  res.render('admin/pages/setting-list.pug', {
    pageTitle: "Danh sách cài đặt"
  })
}

module.exports.accountAdminChangeMulti = async (req, res) => {
  if(!req.permissions.includes('account-view')) {
    res.json({
      code:"error",
      message: "Bạn không có quyền truy cập nội dung này!"
    })
    return
  }
  try {
    const {option, ids} = req.body
    switch(option) {
      case 'active':
      case 'inactive':
        await AccountAdmin.updateMany({
          _id: {
            $in: ids
          }
        }, {
          status: option,
          updatedBy: req.account.id
        })
      break;
      case 'delete':
        await AccountAdmin.updateMany({
          _id: {
            $in: ids
          }
        }, {
          deleted: true,
          deletedBy: req.account.id,
          deletedAt: Date.now()
        })
      break;
    }
    res.json({
      code:"success"
    })
  } catch (error) {
    console.log(error)
    res.json({
      code: "Id không hợp lệ!"
    })
  }
}

module.exports.roleChangeMulti = async (req, res) => {
  if(!req.permissions.includes('role-view')) {
    res.json({
      code:"error",
      message: "Bạn không có quyền truy cập nội dung này!"
    })
    return
  }
  try {
    if(req.body.ids.length > 0) {
      await Role.updateMany({
        _id: {
          $in: req.body.ids
        }
      }, {
        deleted: true,
        deletedAt: Date.now(),
        deletedBy: req.account.id
      })
      res.json({
        code: "Success",
      })
    } else {
      res.json({
        code: "error",
        message: "Vui lòng chọn nhóm quyền!"
      })
    }
  } catch (error) {
    console.log(error)
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}

module.exports.websiteInfo = async(req, res) => {
  if(!req.permissions.includes('website-info-view')) {
    res.redirect(`/${pathAdmin}/dashboard`)
    return
  }
  const websiteInfo = await WebsiteInfo.findOne({});
  res.render('admin/pages/setting-website-info.pug', {
    pageTitle: "Thông tin website",
    websiteInfo: websiteInfo
  })
}

module.exports.websiteInfoPatch = async (req, res) => {
  if(!req.permissions.includes('website-info-view')) {
    res.json({
      code:"error",
      message: "Bạn không có quyền truy cập nội dung này!"
    })
    return
  }
  if(!req.permissions.includes('website-info-view')) {
    res.json({
      code:"error",
      message: "Bạn không có quyền truy cập nội dung này!"
    })
    return
  }
  if(req.files && req.files.logo) {
    req.body.logo = req.files.logo[0].path
  } else {
    delete req.body.logo
  }

  if(req.files && req.files.favicon) {
    req.body.favicon = req.files.favicon[0].path
  } else {
    delete req.body.favicon
  }
  const websiteInfo = await WebsiteInfo.findOne({})
  if(websiteInfo) {
    await WebsiteInfo.updateOne({
      _id: websiteInfo.id
    }, req.body)
  } else {
    const newWebsiteInfo = new WebsiteInfo(req.body)
    await newWebsiteInfo.save()
  }
  res.json({
    code: "success"
  })
}

module.exports.accountAdmin = async (req, res) => {
  if(!req.permissions.includes('account-view')) {
    res.redirect(`/${pathAdmin}/dashboard`)
    return
  }
  const find = {}
  // Pagination
  const limitItem = 2
  const totalRecord = await AccountAdmin.countDocuments({
    deleted: false
  })
  const totalPage = Math.ceil(totalRecord/limitItem)
  let page = 1;
  if(req.query.page) {
    const currentPage = parseInt(req.query.page)
    if(currentPage<=totalPage) {
      page = currentPage
    } else {
      page = totalPage
    }
  }
  if(page<=0) {
    page = 1;
  }
  const pagination = {
    skip: limitItem*(page-1),
    totalPage: totalPage,
    totalRecord: totalRecord
  }
  // Hết pagination
  // Lọc trạngt thái
  if(req.query.status) {
    find.status = req.query.status
  }
  // Hết Lọc trạngt thái
  // Lọc ngày tạo
  const date = {}
  if(req.query.startDate) {
    const startDate = moment(req.query.startDate).startOf('date').toDate();
    date.$gte = startDate
  }
  if(req.query.endDate) {
    const endDate = moment(req.query.endDate).endOf('date').toDate()
    date.$lte = endDate
  }
  if(Object.keys(date).length>0) {
    find.createdAt = date
  }
  // Hết lọc ngày tạo
  // Lọc nhóm quyền
  if(req.query.role) {
    find.role = req.query.role
  }
  // Hết lọc nhóm quyền
  // Search
  if(req.query.keyword) {
    const keywordRegex = new RegExp(req.query.keyword)
    find.fullName = keywordRegex
  }
  // Hết Search
  const accountAdminList = await AccountAdmin
  .find(find)
  .sort('desc')
  .skip(pagination.skip)
  .limit(limitItem)
  .select('fullName email status phone role positionCompany _id avatar')
  .lean()

  for(const item of accountAdminList) {
    if(item.role) {
      const roleDetail = await Role.findOne({
        _id: item.role
      })
      item.roleName = roleDetail.name
    }
  }

  const roleList = await Role.find({
    deleted: false
  })
  res.render('admin/pages/setting-account-admin-list.pug', {
    pageTitle: "Danh sách tài khoản quản trị",
    accountAdminList: accountAdminList,
    pagination: pagination,
    roleList: roleList
  })
}

module.exports.accountAdminEdit = async (req, res) => {
  if(!req.permissions.includes('account-view')) {
    res.redirect(`/${pathAdmin}/dashboard`)
    return
  }
  const id = req.params.id
  const accountAdminDetail = await AccountAdmin.findOne({
    _id: id
  })
  const roleList = await Role.find({
    deleted: false
  })
  res.render('admin/pages/setting-account-admin-edit.pug', {
    pageTitle: "Chỉnh sửa tài khoản quản trị",
    accountAdminDetail: accountAdminDetail,
    roleList: roleList
  })
}

module.exports.roleList = async (req, res) => {
  if(!req.permissions.includes('role-view')) {
    res.redirect(`/${pathAdmin}/dashboard`)
    return
  }
  const find = {
    deleted: false
  }
  if(req.query.keyword) {
    const keyword = slugify(req.query.keyword, {
      lower: true
    })
    const keywordRegex = new RegExp(keyword)
    find.slug = keywordRegex 
  }
  const roleList = await Role.find(find)
  res.render('admin/pages/setting-role-list.pug', {
    pageTitle: "Danh sách nhóm quyền",
    roleList: roleList
  })
}

module.exports.roleCreate = async (req, res) => {
  if(!req.permissions.includes('role-view')) {
    res.redirect(`/${pathAdmin}/dashboard`)
    return
  }
  res.render('admin/pages/setting-role-create.pug', {
    pageTitle: "Tạo nhóm quyền",
    permissionList: permissionConfig.permissionList
  })
}

module.exports.roleCreatePost = async (req, res) => {
  if(!req.permissions.includes('role-view')) {
    res.json({
      code:"error",
      message: "Bạn không có quyền truy cập nội dung này!"
    })
    return
  }
  req.createdBy = req.account.id
  req.updatedBy = req.account.id

  const newRecord = new Role(req.body)
  await newRecord.save()

  res.json({
    code: "success"
  })
}

module.exports.roleEdit = async (req, res) => {
  if(!req.permissions.includes('account-view')) {
    res.redirect(`/${pathAdmin}/dashboard`)
    return
  }
  try {
    
    const id = req.params.id
    const roleDetail = await Role.findOne({
      _id: id
    })
    if(roleDetail) {
      res.render('admin/pages/setting-role-edit', {
        pageTitle: 'Chỉnh sửa nhóm quyền',
        permissionList: permissionConfig.permissionList,
        roleDetail: roleDetail
      })
    } else {
      res.redirect(`/${pathAdmin}/setting/role/list`)
    }
  } catch (error) {
    res.redirect(`/${pathAdmin}/setting/role/list`)
  }
}

module.exports.roleEditPatch = async (req, res) => {
  if(!req.permissions.includes('role-view')) {
    res.json({
      code:"error",
      message: "Bạn không có quyền truy cập nội dung này!"
    })
    return
  }
  try {
    const id = req.params.id
    await Role.updateOne({
      _id: id,
      deleted: false
    }, req.body)
    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code:"error",
      message: "Id không tồn tại trong hệ thống!"
    })
  }
}

module.exports.roleDeletePatch = async (req, res) => {
  if(!req.permissions.includes('role-view')) {
    res.json({
      code:"error",
      message: "Bạn không có quyền truy cập nội dung này!"
    })
    return
  }
  try {
    const id = req.params.id
    await Role.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    })
    res.json({
      code:"success"
    })
  } catch (error) {
    res.json({
      code:"error",
      message: "Id không tồn tại trong hệ thống!"
    })
  }
}

module.exports.accountAdminEditPatch = async (req, res) => {
  if(!req.permissions.includes('account-view')) {
    res.json({
      code:"error",
      message: "Bạn không có quyền truy cập nội dung này!"
    })
    return
  }
  try {
    if(req.file) {
      req.body.avatar = req.file.path
    }
    const salt = await genSalt(10)
    const hashPassword = await hash(req.body.password, salt)
    req.body.password = hashPassword

    req.body.updatedBy = req.account.id
    await AccountAdmin.updateOne({
      _id: req.params.id,
    }, req.body)
    res.json({
      code: "success"
    })
  } catch (error) {
    console.log(error)
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}

module.exports.accountAdminCreate = async (req, res) => {
  if(!req.permissions.includes('account-view')) {
    res.redirect(`/${pathAdmin}/dashboard`)
    return
  }
  const roleList = await Role.find({
    deleted: false
  })
  res.render('admin/pages/setting-account-admin-create.pug', {
    pageTitle: "Tạo tài khoản quản trị",
    roleList: roleList
  })
}

module.exports.accountAdminCreatePost = async (req, res) => {
  if(!req.permissions.includes('account-view')) {
    res.json({
      code:"error",
      message: "Bạn không có quyền truy cập nội dung này!"
    })
    return
  }
  const existAccount = await AccountAdmin.findOne({
    email: req.body.email
  })
  if(existAccount) {
    res.json({
      code:"error",
      message: "Email đã tồn tại trong hệ thống!"
    })
    return;
  }
  if(req.file) {
    req.body.avatar = req.file.path
  }
  const salt = await genSalt(10)
  const hashPassword = await hash(req.body.password, salt)
  req.body.password = hashPassword
  req.body.createdBy = req.account.id
  req.body.updatedBy = req.account.id
  const newRecord = new AccountAdmin(req.body)
  await newRecord.save()
  res.json({
    code: "success"
  })
}