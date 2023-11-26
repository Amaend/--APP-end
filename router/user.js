// 用户注册登录路由模块
const express = require('express')

const router = express.Router()

const user = require('../router_handler/user.js')

// const multer = require('multer')

// const path = require('path')

// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
// const upload = multer({ dest: path.join(__dirname, '../upload/image') })

// 注册用户
router.post('/reg', user.regUser)

// 登录用户
router.post('/login', user.loginUser)
// 获取短信验证码
router.post('/sendMessage', user.sendMessage)
// 用户找回密码
router.post('/retrievepassword', user.retrievePassword)

module.exports = router