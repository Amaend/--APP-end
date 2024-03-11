// 导入 express
const express = require('express')

// 使用 express 中的router路由对象
const router = express.Router()

// 导入处理函数模块
const recover = require('../router_handler/recover.js')

// 用户认领模块
router.post('/user/recover',recover.userRecoverGoods)

// 向外共享 router 路由对象
module.exports = router