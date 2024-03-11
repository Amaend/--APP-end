const express = require('express')

const router = express.Router()

const page = require('../router_handler/page.js')

// 用户失物分页功能
router.get('/api/page/lost', page.pageLost)

// 用户招领分页功能
router.get('/api/page/found', page.pageFound)

// 管理员失物分页功能
router.get('/api/admin/page/lost', page.adminPageLost)

// 管理员招领分页功能
router.get('/api/admin/page/found', page.adminPageFound)


// 用户管理分页功能
router.get('/my/page/useradmin', page.pageUserAdmin)

module.exports = router