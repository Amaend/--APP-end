// 用户信息

const express = require('express')

const router = express.Router()

const userinfo = require('../router_handler/userinfo.js')
const upload =require('../utils/multer.js')

// 获取当前登录用户的信息
router.get('/loginuserinfo', userinfo.loginUserInfo)

// 修改当前用户头像
router.post('/updateimg',upload.single("img"), userinfo.updateImg)

// 修改当前用户信息
router.post('/updateinfo', userinfo.updateInfo)

// 修改当前用户手机号和密码
router.post('/dtpassword', userinfo.dtPassword)

module.exports = router
