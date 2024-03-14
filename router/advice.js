// 建议模块
const express = require('express')

const router = express.Router()

const advice = require('../router_handler/advice.js')

// 用户添加建议
router.post('/add/advice', advice.userAddAdvice)

// 管理员查看建议列表
router.get('/admin/list/advice', advice.adminGetAdviceList)

// 管理员删除建议
router.delete('/admin/delete/advice', advice.adminDeleteAdvice)

module.exports = router