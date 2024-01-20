// 好友模块
const express = require('express')

const router = express.Router()

const friend = require('../router_handler/friend.js')

// 搜索好友
router.get('/search', friend.searchFriend)

// 好友申请
router.post('/apply/friend', friend.applyFriend)

// 同意好友申请
router.post('/apply/agree', friend.agreeFriend)

// 拒绝好友申请
router.post('/apply/refuse', friend.refuseFriend)

// 好友列表
router.post('/get/list', friend.getFriendListInfo)

// 好友申请列表
router.post('/get/apply/list', friend.getApplyFriendList)

// 更新一对一消息状态
router.post('/update/message/status', friend.updateOneMessageState)

// 获取一对一消息队列
router.post('/get/message/queue', friend.getOneMessageByPage)
module.exports = router