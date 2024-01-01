const express = require('express')

const router = express.Router()

const collect = require('../router_handler/collect.js')

// 用户添加收藏
router.post('/add/collet',collect.addCollect)

router.get('/get/lost/collet',collect.getLostCollect)

// 获取用户收藏
router.get('/get/claim/collet',collect.getClaimCollect)

// 用户取消收藏
router.post('/cancel/collet',collect.cancelCollect)

// 获取用户收藏数量
router.get('/get/collet/count',collect.getCollectCount)

module.exports = router