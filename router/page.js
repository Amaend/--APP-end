const express = require('express')

const router = express.Router()

const page = require('../router_handler/page.js')

// 失物分页功能
router.get('/api/page/lost', page.pageLost)

// 招领分页功能
router.get('/api/page/found', page.pageFound)

// 用户管理分页功能
router.get('/my/page/useradmin', page.pageUserAdmin)

module.exports = router