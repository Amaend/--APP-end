// 建议模块
const express = require('express')

const router = express.Router()

const advice = require('../router_handler/advice.js')

// 用户添加评论
router.post('/add/advice', advice.userAddAdvice)

module.exports = router