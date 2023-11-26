// 用户注册登录处理函数模块

const db = require('../db')

// const path = require('path')

const bcrypt = require('bcryptjs')

const JWT = require('jsonwebtoken')

const sms = require("../utils/message");

const config = require('../config.js')
const getLocalIP = require('../utils/getLocalIp')
let localIP = getLocalIP()

let codeMessage
// 用户注册处理函数
exports.regUser = (req, res) => {

  const sql = 'select * from user where phone=?'
  const body = {
    ...req.body,
    img: `http://${localIP}:3000/images/img_1660464010198.jpg`,
    school:'四川大学锦江学院',
    brith_data:'2023-01-01'
  }
  body.password = bcrypt.hashSync(body.password, 10)
  db.query(sql, body.phone, (err, results) => {
    if (!body.phone) {
      return res.send({
        msg: '手机号不能为空！',
        state: 201
      })
    }
    if (results.length >= 1) {
      return res.send({
        msg: '手机号已注册！',
        state: 201
      })
    }
    const sql = 'insert into user set ?'
    db.query(sql, body, (err, results) => {
      if (err) {
        return res.send(err)
      }
      if (results.affectedRows !== 1) {
        return res.send({
          msg: '注册失败！',
          state: 201
        })
      }
      res.send({
        msg: '注册成功！',
        state: 200
      })
    })
  })
}

// 登录用户处理函数
exports.loginUser = (req, res) => {
  const body = req.body
  const sql = 'select * from user where phone=?'
  if (!body.phone || !body.password) {
    return res.send({
      state: 201,
      message: '无手机号码或密码不能为空！！',
    })
  }
  db.query(sql, body.phone, (err, results) => {
    if (err) {
      return res.send(err)
    }
    if (results.length !== 1) {
      return res.send({
        state: 201,
        message: '无此用户！',
      })
    }
    const compareResult = bcrypt.compareSync(body.password, results[0].password)
    if (!compareResult) { 
      return res.send({
        state: 201,
        message: '密码不正确',
      })
    }
    // 将对象展开，并设置 password 属性值为空字符串
    const user = {
      ...results[0],
      password: ''
    }
    const token = JWT.sign(user, config.jwtSecretKey, {
      expiresIn: '24h'
    })
    res.send({
      state: 200,
      message: '登录用户成功！',
      data: results[0],
      token: 'Bearer ' + token
    })
  })
}
// 用户短信验证的接口函数
exports.sendMessage = (req, res) => {
  const sql = "select * from user where phone=?";

  db.query(sql, req.body.phone, (err, results) => {
    if (err) {
      return res.send(err);
    }
    if (results.length !== 1) {
      return res.send({
        state: 201,
        msg: "手机号码不正确或无该用户！"
      });
    } else {
      codeMessage = sms(req.body.phone)
      // 60秒后清空验证码，之前的验证码过期
      setTimeout(() => {
        codeMessage = ''
      }, 60000)
      res.send({
        state: 200,
        msg: '发送成功',
      })
    }

  });

}
// 找回用户密码处理函数
exports.retrievePassword = (req, res) => {
  const body = req.body
  const code = req.body.code
  const sql = 'select * from user where phone=?'
  body.password = bcrypt.hashSync(body.password, 10)
  db.query(sql, body.phone, (err, results) => {
    if (err) {
      return res.send(err)
    }
    if (results.length <= 0) {
      return res.send({
        state: 201,
        msg: '手机号码不正确或无该用户！'
      })
    } else if (code !== codeMessage) {
      return res.send({
        state: 201,
        msg: '验证码错误！'
      })
    } else {
      const sql = 'update user set password=? where phone=?'
      db.query(sql, [body.password, body.phone], (err, results) => {
        if (err) {
          return res.send(err)
        }
        if (results.affectedRows !== 1) {
          return res.send({
            state: 201,
            msg: '修改密码失败！'
          })
        }
        res.send({
          state: 200,
          msg: '修改密码成功！'
        })
      })
    }

  })
}