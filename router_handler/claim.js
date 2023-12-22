// 招领处理函数模块

const db = require("../db");

const path = require("path");
const getLocalIP = require("../utils/getLocalIp");
// 获取IP地址
let localIP = getLocalIP();
// 获取招领数据信息
exports.claimList = (req, res) => {
  const sql = "select * from claim";
  db.query(sql, (err, results) => {
    if (err) {
      return res.ss(err);
    }
    if (results.length <= 0) {
      return res.ss("获取招领数据失败！");
    }
    res.send({
      state: 200,
      message: "获取招领数据成功！",
      data: results,
    });
  });
};

// 管理员删除招领信息
exports.dtClaim = (req, res) => {
  const id = req.query.id;
  const sql = "delete from claim where id=?";
  db.query(sql, id, (err, results) => {
    if (err) {
      return res.ss(err);
    }
    if (results.affectedRows !== 1) {
      return res.ss("删除失败！");
    }
    res.ss("删除成功！", 200);
  });
};

// 用户添加招领信息处理函数
exports.addClaim = (req, res) => {
  const img =
    `http://${localIP}:3000/images/${req.body.url}/` + req.file.filename;
  const body = {
    ...JSON.parse(req.body.info),
    image: img,
    date: new Date(),
    userid: req.auth.id,
  };
  if (!req.file || req.file.mimetype !== "image/jpeg") {
    return res.send({
      state: 400,
      message: "请上传图片！",
    });
  }

  const sql = "insert into claim set ?";
  db.query(sql, body, (err, results) => {
    if (err) {
      return res.send(err);
    }
    if (results.affectedRows !== 1) {
      return res.send({
        state: 400,
        message: "发布失败！",
      });
    }
    res.send({
      state: 200,
      message: "发布成功！",
      data:{
        id: results.insertId
      }
    });
  });
};
// 用户设置验证消息
exports.setMessage = (req, res) => {
    // 获取消息验证
    let message = {
      ...req.body,
    };
    // 判断消息的完整性
    if (message.question && message.answer) {
      // 编写插入语句
      const sql = "insert into validation set ?";
      db.query(sql, message, (err, results) => {
        if (err) {
          return res.send(err);
        }
        if (results.affectedRows !== 1) {
          return res.send({
            state: 400,
            message: "添加失败！",
          });
        }
        res.send({
          state: 200,
          message: "添加成功！",
        });
      });
    } else {
      // 若不完整则返回前端编写完整
      return res.send({
        state: 400,
        message: "请填写完整！",
      });
    }
  }
// 获取当前用户发布的招领信息
exports.userClaimInfo = (req, res) => {
  const sql = "select * from claim where userid=?";

  db.query(sql, req.auth.id, (err, results) => {
    if (err) {
      return res.ss(err);
    }
    if (results.length <= 0) {
      return res.ss("当前用户未发布招领信息!");
    }
    res.send({
      state: 200,
      message: "获取用户发布招领信息成功！",
      data: results,
    });
  });
};

// 用户删除招领信息处理函数
exports.userClaimdt = (req, res) => {
  const sql = "delete from claim where id=? and userid=?";
  db.query(sql, [req.query.id, req.auth.id], (err, results) => {
    if (err) {
      return res.ss(err);
    }
    if (results.affectedRows !== 1) {
      return res.ss("删除失物信息失败！");
    }
    res.ss("删除失物信息成功！", 200);
  });
};

// 用户更新招领状态
exports.updateState = (req, res) => {
  const body = req.body;
  const sql = "select * from claim where id=? and userid=?";
  db.query(sql, [body.id, req.auth.id], (err, results1) => {
    if (err) {
      return res.ss(err);
    }
    if (results1.lengt <= 0) {
      return res.ss("获取数据失败");
    }
    const sql = "update claim set state=? where id=? and userid=?";
    const state = !results1[0].state;
    db.query(sql, [state, body.id, req.auth.id], (err, results2) => {
      if (err) {
        return res.ss(err);
      }
      if (results2.affectedRows !== 1) {
        return res.ss("更新状态失败！");
      }
      res.ss("更新状态成功！", 200);
    });
  });
};

// 管理员更新招领状态
exports.adminUpdateState = (req, res) => {
  const body = req.body;
  const sql = "select * from claim where id=?";
  db.query(sql, body.id, (err, results1) => {
    if (err) {
      return res.ss(err);
    }
    if (results1.lengt <= 0) {
      return res.ss("获取数据失败！");
    }
    const sql = "update claim set state=? where id=?";
    const state = !results1[0].state;
    db.query(sql, [state, body.id], (err, results2) => {
      if (err) {
        return res.ss(err);
      }
      if (results2.affectedRows !== 1) {
        return res.ss("更改状态失败！");
      }
      res.ss("更改状态成功！", 200);
    });
  });
};
// 获取单个招领详细信息
/**
 *
 * @param {id,user_id} req
 * @param {*} res
 */
exports.getClaimItemInfo = (req, res) => {
  const { id, user_id } = req.query;
  const sql = "select * from claim where id=?";
  db.query(sql, id, (err, results) => {
    if (err) {
      return res.status(500).send({
        state: 500,
        message: "获取数据失败！",
      });
    } else if (results.length !== 1) {
      return res.status(201).send({
        state: 201,
        message: "获取数据失败！",
      });
    }
    const { userid, lost_found } = results[0];
    const userSql = "select * from user where id=?";
    db.query(userSql, userid, (err, userResult) => {
      if (err) {
        reject(err);
      } else if (userResult.length !== 1) {
        reject({
          state: 201,
          message: "用户信息获取失败！",
        });
      }
      const collectsql =
        "select * from collection where goods_id=? and lost_found=? and user_id=?";
      db.query(collectsql, [id, lost_found, user_id], (err, collectResult) => {
        if (err) {
          reject(err);
        }
        results[0].collectInfo = collectResult[0] ? collectResult[0] : [];
        results[0].userInfo = userResult[0];
        res.send({
          state:200,
          message:"获取数据成功！",
          data:results[0]
        })
      });
    });
  });
};
