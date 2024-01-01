// 失物模块

const express = require('express')

const router = express.Router()

const lost = require('../router_handler/lost.js')

const upload = require('../utils/multer.js')

// 获取失物数据
router.get('/api/lost', lost.lostData)

// 管理员删除失物数据
router.delete('/dtlost', lost.dtLost)

// 用户添加失物信息处理函数(带有图片)
router.post('/user/addlost', upload.single('img'), lost.addLost)

// 用户添加失物信息处理函数（未上传图片）
router.post('/user/addlostnoimg', lost.addLostNotImg)

// 获取当前用户发布的失物信息
router.get('/user/userlostinfo', lost.userLostInfo)

// 用户删除发布的失物信息
router.delete('/user/dtlost', lost.userLostdt)

// 用户更新失物状态
router.post('/user/lost/updatestate', lost.updateState)

// 管理员更新失物状态
router.post('/user/lost/adminupdatestate', lost.adminUpdateState)

// 获取全部发布的物品数据
router.get('/api/wholedata', lost.wholeData)

// 获取用户搜索物品的数据
router.post('/api/searchdata', lost.searchData)

// 用户更新失物数据
router.post('/user/lost/update', lost.updateLost)

// 用户更新失物图片
router.post('/user/lost/updateimg', upload.single('img'), lost.updateLostImg)

// 根据id值获取失物信息
router.get('/api/lost/id', lost.getLostItemInfo)
module.exports = router