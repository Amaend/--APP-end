// 分类管理模块

const express = require('express')

const router = express.Router()

// 导入处理函数模块
const classHandel = require('../router_handler/class')

// 获取分类信息
router.get('/api/classlist', classHandel.classList)

// 新增分类
router.post('/my/addclass', classHandel.addClass)

// 删除分类
router.delete('/my/dtclass', classHandel.deleteClass)

// 根据分类获取对应分类的失物和招领信息数据
router.get('/api/lostclasslist', classHandel.lostClassList)

router.get('/api/foundclasslist', classHandel.foundClassList)

// 修改分类信息
router.post('/my/updclass', classHandel.updateClass)

module.exports = router