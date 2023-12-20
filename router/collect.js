const express = require('express')

const router = express.Router()

const collect = require('../router_handler/collect.js')

// 用户添加收藏
router.post('/add/collet',collect.addCollect)

// 获取用户收藏
router.get('/get/collet',collect.getCollect)

// 删除用户收藏
router.delete('/del/collet',collect.delCollect)


module.exports = router