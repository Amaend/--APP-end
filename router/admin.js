// 导入 express
const express = require('express')

// 使用 express 中的router路由对象
const router = express.Router()

// 导入处理函数模块
const admin = require('../router_handler/admin.js')

// 管理员注册
router.post('/regadmin', admin.regAdmin_handler)

// 管理员登录
router.post('/adminlogin', admin.adminLogin_handler)

// 向外共享 router 路由对象
module.exports = router