/*
 * 此处是 info 路由对象的处理函数
 */

const db = require('../db/index.js')

// 导入 bcryptjs
const bcrypt = require('bcryptjs')

const path = require('path')

// 管理员个人信息
exports.adminInfo_handler = (req, res) => {
  const sql = 'select * from admin where id=?'
  db.query(sql, req.auth.id, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    if (results.length !== 1) {
      return res.cc('获取个人信息失败！')
    }
    res.send({
      state: 200,
      message: '获取个人信息成功！',
      data: results[0]
    })
  })
}

// 修改管理员头像
exports.updateAdminImg = (req, res) => {
  const body = {
    img: path.join('/public/images', req.file.filename),
    id: req.auth.id
  }
  const sql = 'update admin set ? where id=?'
  db.query(sql, [body, req.auth.id], (err, results) => {
    if (err) {
      return res.ss(err)
    }
    if (results.affectedRows !== 1) {
      return res.ss('修改失败，请稍后重试！')
    }
    res.ss('修改成功！', 200)
  })
}

// 修改管理员用户手机号和密码
exports.updateAdmin = (req, res) => {
  const body = req.body
  const sql = 'update admin set ? where id=?'
  if (!body.phone || !body.password) {
    return res.ss('手机号码或密码不能为空')
  }
  body.password = bcrypt.hashSync(body.password, 10)
  db.query(sql, [body, req.auth.id], (err, results) => {
    if (err) {
      return res.ss(err)
    }
    if (results.affectedRows !== 1) {
      return res.ss('修改失败，请稍后再试！')
    }
    res.ss('修改成功！', 200)
  })
}
