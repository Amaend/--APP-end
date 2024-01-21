// 管理用户路由处理函数模块

const db = require('../db')

const bcrypt = require('bcryptjs')
const getLocalIP = require('../utils/getLocalIp')
let localIP = getLocalIP()
// 获取所有用户列表
exports.usersList = (req, res) => {
  const sql = 'select * from user'
  db.query(sql, (err, results) => {
    if (err) {
      return res.ss(err)
    }
    if (results.length <= 0) {
      return res.ss('获取用户列表失败！')
    }
    res.send({
      state: 200,
      message: '获取用户列表成功！',
      data: results
    })
  })
}

// 新增用户
exports.addUsers = (req, res) => {
  let body = req.body
  const sql = 'select * from user where phone=?'
  body = {...req.body, img: `/images/img_1660464010198.jpg`}
  // 加密密码
  body.password = bcrypt.hashSync(body.password, 10)

  db.query(sql, body.phone, (err, results) => {
    if (err) {
      return res.ss(err)
    }
    if (results.length === 1) {
      return res.ss('该手机号码已被注册！')
    }
    const sql = 'insert into user set ?'
    db.query(sql, body, (err, results) => {
      if (err) {
        return res.ss(err)
      }
      if (results.affectedRows !== 1) {
        return res.ss('新增用户失败！')
      }
      res.ss('新增用户成功！', 200)
    })
  })
}

// 修改用户信息
exports.modifyUser = (req, res) => {
  const body = req.body
  const sql = 'select * from user where id=?'
  body.password = bcrypt.hashSync(body.password, 10)
  db.query(sql, body.id, (err, results) => {
    if (err) {
      return res.ss(err)
    }
    if (results.lengt <= 0) {
      return res.ss('修改的用户不存在！')
    }
    const sql = 'update user set ? where id=?'
    db.query(sql, [body, body.id], (err, results) => {
      if (err) {
        return res.ss(err)
      }
      if (results.affectedRows !== 1) {
        return res.ss('修改用户信息失败！')
      }
      res.ss('修改用户成功！', 200)
    })
  })
}

// 删除用户
exports.deleteUsers = (req, res) => {
  const sql = 'delete from user where id=?'

  db.query(sql, req.query.id, (err, results) => {
    if (err) {
      return res.ss(err)
    }
    if (results.affectedRows !== 1) {
      return res.ss('删除用户失败！')
    }
    res.ss('删除用户成功！', 200)
  })
}
