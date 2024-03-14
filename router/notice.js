// 好友模块
const express = require('express')

const router = express.Router()

const notice = require('../router_handler/notice.js')

// 获取系统公告
router.get('/get/notice', notice.adminGetNoticeList)

// 根据id获取未读公告
router.get('/get/unreadnotice', notice.getUnreadNoticesById)

// 标记已读
router.get('/mark/read', notice.markAllNoticesAsRead)

// 获取最新的公告
router.get('/get/api/newnotice', notice.getLatestNotice)

// 管理员添加公告
router.post('/admin/add/notice', notice.addNotice)

// 管理员删除公告信息
router.delete('/admin/delete/notice', notice.deleteNotice)

// 管理员编辑公告信息
router.post('/admin/edit/notice', notice.updateNotice)

module.exports = router