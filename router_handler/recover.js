// 物品找回处理函数模块

const db = require("../db");

// 创建this指向
let that = this;

// 创建用户找回数据
exports.userRecoverGoods = (req, res) => {
  const body = req.body;
  body.rl_date = new Date();
  const selectQuery =
    "SELECT * FROM renling WHERE rl_goodId=? AND rl_lostFound=?";
  db.query(selectQuery, [body.rl_goodId, body.rl_lostFound], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length >= 1) {
      return res.send({
        state: 201,
        message: "该物品已找回！",
      });
    }
    const insertQuery = "INSERT INTO renling SET ?";
    db.query(insertQuery, req.body, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.affectedRows === 1) {
        return res.send({
          state: 200,
          message: "认领成功",
        });
      }
    });
  });
};

// 获取认领数据
exports.getRecoverInfo = async (req, res) => {
  try {
    const page_num = parseInt(req.query.page_num) || 1;
    const page_size = parseInt(req.query.page_size) || 10;
    const offset = (page_num - 1) * page_size;
    const params = [offset, page_size];
    const sql = "SELECT * FROM renling LIMIT ?, ?";
    const results1 = await that.queryAsync(sql, params);
    if (results1.length <= 0) {
      return res.status(404).send("查询失败！");
    }
    const totalResults = await that.queryAsync(
      "SELECT COUNT(*) as total FROM renling"
    );
    const total = totalResults[0].total;
    for (let i = 0; i < results1.length; i++) {
      const recoverUserInfo = await that.getUserInfo(results1[i].rl_uid);
      const userInfo = await that.getUserInfo(results1[i].u_id);
      if (results1[i].rl_lostFound === 1) {
        const lostInfo = await that.getLostInfo(results1[i].rl_goodId);
        results1[i].goodsInfo = lostInfo;
      } else {
        const foundInfo = await that.getClaimInfo(results1[i].rl_goodId);
        results1[i].goodsInfo = foundInfo;
      }
      results1[i].recoverUserInfo = recoverUserInfo;
      results1[i].userInfo = userInfo;
    }
    res.send({
      state: 200,
      message: "查询成功！",
      data: results1,
      paging: {
        page_num: page_num,
        page_size: page_size,
        total: total,
      },
    });
  } catch (error) {
    console.error("getRecoverInfo 出错:", error);
    res.status(500).send("查询失败！发生了错误。");
  }
};

// 获取用户信息
exports.getUserInfo = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM user WHERE id = ?", [id], (err, results) => {
      if (err) {
        reject(`Database error: ${err.message}`);
      } else {
        if (results.length <= 0) {
          reject("查询失败！用户不存在。");
        } else {
          resolve(results[0]);
        }
      }
    });
  });
};

// 获取失物lost信息
exports.getLostInfo = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM lost WHERE id = ?", [id], (err, results) => {
      if (err) {
        reject(`Database error: ${err.message}`);
      } else {
        if (results.length <= 0) {
          reject("查询失败！lost信息不存在。");
        } else {
          resolve(results[0]);
        }
      }
    });
  });
};

// 获取招领claim信息
exports.getClaimInfo = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM claim WHERE id = ?", [id], (err, results) => {
      if (err) {
        reject(`Database error: ${err.message}`);
      } else {
        if (results.length <= 0) {
          reject("查询失败！cliam信息不存在。");
        } else {
          resolve(results[0]);
        }
      }
    });
  });
};

// 异步查询queryAsync 函数
exports.queryAsync = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// 管理员删除认领信息
exports.deleteRecoverInfo = (req, res) => {
  const id = req.query.id;
  db.query("DELETE FROM renling WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.send(err);
    } else {
      if (results.length <= 0) {
        return res.send({
          state: 201,
          message: "删除失败",
        });
      } else {
        return res.send({
          state: 200,
          message: "删除成功",
        });
      }
    }
  });
};

// 管理员更新认领状态
exports.updateRecoverInfo = (req, res) => {
  const id = req.query.id;
  const sql = 'select * from renling where id=?'
  db.query(sql, id,  (err, results1) => {
    if (err) {
      return res.send(err)
    }
    if (results1.lengt <= 0) {
      return res.send({
        state: 201,
        message: "查询失败！认领信息不存在。",
      })
    }
    const sql = 'update renling set check_state=? where id=?'
    const check_state = !results1[0].check_state
    db.query(sql, [check_state, id], (err, results2) => {
      if (err) {
        return res.send(err)
      }
      if (results2.affectedRows !== 1) {
        return res.send({
          state: 201,
          message: "更新失败！"
        })
      }
      res.send({
        state: 200,
        message: "更新成功！"
      })
    })
  })
}