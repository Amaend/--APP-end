// 导入 express
const express = require('express')

// 使用 express 中的router路由对象
const router = express.Router()

// 导入处理函数模块
const recover = require('../router_handler/recover.js')

// 用户认领模块
router.post('/user/recover',recover.userRecoverGoods)

// 管理员获取认领数据
router.get('/admin/recover',recover.getRecoverInfo)

// 管理员删除认领信息
router.delete('/admin/dltrecover',recover.deleteRecoverInfo)

//管理员更新认领状态
router.get('/admin/updaterecover',recover.updateRecoverInfo)

// 向外共享 router 路由对象
module.exports = router