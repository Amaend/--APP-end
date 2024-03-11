/* 
  * 此处是 admin 路由对象的处理函数
*/

// 导入 mysql 配置模块
const db = require('../db/index.js')
// 导入 bcryptjs
const bcrypt = require('bcryptjs')
// 导入 jsonwebtoken
const jwt = require('jsonwebtoken')
// 导入config.js
const config = require('../config.js')

// 管理员注册处理函数
exports.regAdmin_handler = (req, res) => {
  const body = req.body
  if (!body.phone || !body.password) {
    return res.ss('手机号码或密码不能为空！')
  }
  const sql = 'select * from admin where phone=?'
  db.query(sql, [body.phone], (err, results) => {
    if (err) {
      return res.ss(err)
    }
    if (results.length > 0) {
      return res.ss('该手机号已被注册！')
    }
    const sql = 'insert into admin set ?'
    // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
    body.password = bcrypt.hashSync(body.password, 10)
    db.query(sql, body, (err, results) => {
      if (err) {
        return res.ss(err)
      }
      if (results.affectedRows !== 1) {
        return res.ss('注册用户失败！')
      }
      res.ss('注册用户成功！', 200)
    })
  })
}

// 管理员登录处理函数
exports.adminLogin_handler = (req, res) => {
  const body = req.body
  if (!body.phone || !body.password) {
    return res.ss('手机号或密码不能为空！')
  }
  const sql = 'select * from admin where phone=?'
  db.query(sql, body.phone, (err, results) => {
    if (err) {
      return res.ss(err)
    }
    if (results.length !== 1) {
      return res.ss('手机号码不存在！')
    }
    // TODO：判断用户输入的登录密码是否和数据库中的密码一致
    // 拿着用户输入的密码,和数据库中存储的密码进行对比
    const compareResult = bcrypt.compareSync(body.password, results[0].password)
    if (!compareResult) {
      return res.ss('密码不正确，登录失败！')
    }
    // 保障用户账号的安全性，剔除密码
    const admin = { ...results[0], password: '' }
    // 生成 token 字符串
    const token = jwt.sign(admin, config.jwtSecretKey, {expiresIn: '24h'})
    res.send({
      state: 200,
      message: '登陆成功！',
      data: results[0],
      token: 'Bearer ' + token
    })
  })
}

// 管理员个人信息
exports.adminInfo_handler = (req, res) => {
  res.send('ok.')
}
