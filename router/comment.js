const express = require('express')

const router = express.Router()

const comment = require('../router_handler/comment.js')

// 用户添加评论
router.post('/add/comment', comment.addComment)

// 获取用户评论数据
router.get('/get/commentlist', comment.getComment)

// 根据用户id获取用户的评论数据
router.get('/get/commencountbyuserid', comment.getUserCommentsCount)

// 获取用户回复消息
router.get('/get/replylist', comment.getReplyComment)

module.exports = router