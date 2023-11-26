const express = require('express')

// 导入处理函数模块
const info = require('../router_handler/adminInfo.js')
// 导入 multer
const multer = require('multer')
// 导入 path
const path = require('path')

// 创建 multer 的实例
const upload = multer({dest: path.join(__dirname, '../upload/image')})


const router = express.Router()

// 管理员个人信息路由
router.get('/admininfo', info.adminInfo_handler)

// 修改管理员头像
router.post('/adminimg', upload.single('img'), info.updateAdminImg)

// 修改管理员用户手机号和密码
router.post('/updateadmin', info.updateAdmin)


module.exports = router