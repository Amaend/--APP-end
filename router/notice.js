// 好友模块
const express = require('express')

const router = express.Router()

const notice = require('../router_handler/notice.js')

// 获取系统公告
router.get('/get/notice', notice.getNotices)

// 根据id获取未读公告
router.get('/get/unreadnotice', notice.getUnreadNoticesById)

// 标记已读
router.get('/mark/read', notice.markAllNoticesAsRead)

// 获取最新的公告
router.get('/get/api/newnotice', notice.getLatestNotice)

module.exports = router