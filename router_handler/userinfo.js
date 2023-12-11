// 用户信息处理函数

const db = require("../db");
const bcrypt = require("bcryptjs");
const path = require("path");
const getLocalIP = require("../utils/getLocalIp");
let localIP = getLocalIP();

// 获取当前登录用户的信息
exports.loginUserInfo = (req, res) => {
  const sql = "select * from user where id=?";
  db.query(sql, req.auth.id, (err, results) => {
    if (err) {
      return res.send(err);
    }
    if (results.length !== 1) {
      return res.send({
        state: 201,
        message: "用户信息获取失败！",
      });
    }
    res.send({
      state: 200,
      message: "获取登录用户信息成功",
      data: results[0],
    });
  });
};

// 获取用户信息
exports.getUserInfo = (req, res) => {
  const sql = "select * from user where id=?";
  db.query(sql, req.query.id, (err, results) => {
    if (err) {
      return res.send(err);
    }
    if (results.length !== 1) {
      return res.send({
        state: 201,
        message: "用户信息获取失败！",
      });
    }
    res.send({
      state: 200,
      message: "获取用户信息成功",
      data: results[0],
    });
  });
};

// 修改当前用户头像
exports.updateImg = (req, res) => {
  const sql = "update user set img=? where id=?";
  const body = {
    img: `http://${localIP}:3000/images/${req.body.url}/` + req.file.filename,
  };
  db.query(sql, [body.img, req.auth.id], (err, results) => {
    if (err) {
      return res.send(err);
    }
    if (results.affectedRows !== 1) {
      return res.send({
        state: 201,
        message: "修改用户头像失败！",
      });
    }
    res.send({
      state: 200,
      message: "修改用户头像成功！",
    });
  });
};

// 修改用户信息
exports.updateInfo = (req, res) => {
  const body = req.body;
  const sql = "update user set ? where id=?";
  db.query(sql, [body, req.auth.id], (err, results) => {
    if (err) {
      return res.send(err);
    }
    if (results.affectedRows !== 1) {
      return res.send({
        state: 201,
        message: "修改用户信息失败！",
      });
    }
    res.send({
      state: 200,
      message: "修改用户信息成功！",
    });
  });
};

// 修改当前用户手机号和密码处理函数
exports.dtPassword = (req, res) => {
  // 根据id查询用户信息
  const sql = 'select * from user where id=?'
  // 执行sql语句
  db.query(sql, req.auth.id, (err, results) => {
      // 查询出错
      if (err) return res.send(err)
      // 查询成功 但条数不等于1
      if (results.length !== 1) return res.send({
        state: 201, 
        message: "用户不存在！"
      })
      // 判断用户输入的旧密码是否正确
      // 不能直接判断  数据库中存加密后的密码
      const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
      if (!compareResult) return res.send({
        state: 201,
        message: "旧密码输入错误！"
      })
      // 将新密码更新到数据库中
      // 更新密码sql语句
      const sql = 'update user set password=? where id=?'
      // 对新密码进行加密处理
      const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
      db.query(sql, [newPwd, req.body.id], (err, results) => {
          // 执行sql语句失败
          if (err) return res.send(err)
          // 执行成功 但修改的条数不为1，没有修改
          if (results.affectedRows !== 1) return res.send({
            state: 201,
            message: "修改密码失败！"
          })
          // 修改密码成功
          res.send({
            state: 200,
            message: "修改密码成功！"
          })
      })
  })
};
