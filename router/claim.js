// 招领模块

const express = require('express')

const router = express.Router()

const claim = require('../router_handler/claim.js')

const upload = require('../utils/multer.js')

// 获取招领数据信息
router.get('/api/claim', claim.claimList)

// 管理员删除招领信息
router.delete('/dtclaim', claim.dtClaim)

// 用户添加招领信息
router.post('/user/addclaim', upload.single('img'), claim.addClaim)

// 用户添加验证消息
router.post('/user/claim/addmsg', claim.setMessage)

// 获取当前用户发布的招领信息
router.get('/user/userclaiminfo', claim.userClaimInfo)

// 用户删除招领信息
router.delete('/user/dtclaim', claim.userClaimdt)

// 用户更新招领状态
router.post('/user/claim/updatestate', claim.updateState)
// 管理员更新招领状态
router.post('/user/claim/adminupdatestate', claim.adminUpdateState)

module.exports = router