// 管理用户模块

const express = require('express')

const router = express.Router()

// 导入处理函数模块
const manageUsers = require('../router_handler/manage_users.js')

// 展示所有用户列表
router.get('/userslist', manageUsers.usersList)

// 新增用户
router.post('/addusers', manageUsers.addUsers)

// 修改用户信息
router.post('/modifyuser', manageUsers.modifyUser)

// 删除用户
router.delete('/dtusers', manageUsers.deleteUsers)



module.exports = router