// 收藏处理函数模块

const db = require("../db");

//   用户添加新的收藏数据
exports.addCollect = (req, res) => {
  const body = {
    ...req.body,
    collect_state: 1,
  };
  const sql =
    "select * from collection where goods_id=? and lost_found=? and user_id=?";
  db.query(
    sql,
    [body.goods_id, body.lost_found, body.user_id],
    (err, results1) => {
      if (err) {
        return res.send(err);
      }
      if (results1.length <= 0) {
        const addsql = "insert into collection set ?";
        db.query(addsql, body, (err, results) => {
          if (err) {
            return res.send(err);
          }
          if (results.affectedRows !== 1) {
            return res.send({
              state: 201,
              msg: "添加收藏失败！",
            });
          }
          res.send({
            state: 200,
            msg: "添加收藏成功！",
          });
        });
      } else {
        const updatasql =
          "update collection set collect_state=? where goods_id=? and lost_found=? and user_id=?";
        const state = !results1[0].collect_state ? 1 : 0;
        db.query(
          updatasql,
          [state, body.goods_id, body.lost_found, body.user_id],
          (err, results2) => {
            if (err) {
              return res.send(err);
            }
            if (results2.affectedRows !== 1) {
              return res.send({
                state: 201,
                msg: "更新状态失败！",
              });
            }
            res.send({
              state: 200,
              msg: "更新状态成功！",
            });
          }
        );
      }
    }
  );
};
// 获取当前用户的收藏数据
exports.getClaimCollect = (req, res) => {
  const sql = "select * from collection where user_id=? and collect_state=1";
  db.query(sql, req.auth.id, (err, results) => {
    if (err) {
      return res.send(err);
    }
    if (results.length <= 0) {
      return res.send({
        state: 201,
        msg: "当前用户没有收藏数据！",
      });
    }
    const getGoodsInfoPromises = results.map((item) => {
      if (item.lost_found === 2) {
        return new Promise((resolve, reject) => {
          const goodsSql = "select * from claim where id=?";
          db.query(goodsSql, item.goods_id, (err, goodsResult) => {
            if (err) {
              reject(err);
            } else if (goodsResult.length <= 0) {
              reject({
                state: 201,
                message: "物品信息获取失败！",
              });
            } else {
              const userSql = "select * from user where id=?";
              db.query(userSql, goodsResult[0].userid, (err, userResult) => {
                if (err) {
                  reject(err);
                } else if (userResult.length <= 0) {
                  reject({
                    state: 201,
                    message: "用户信息获取失败！",
                  });
                } else {
                  goodsResult[0].userInfo = userResult[0];
                  resolve(goodsResult[0]);
                }
              });
            }
          });
        });
      }
    });

    Promise.all(getGoodsInfoPromises)
      .then((finalResults) => {
        return res.status(200).send({
          state: 200,
          message: "获取数据成功！",
          data: finalResults,
        });
      })
      .catch((error) => {
        return res.status(500).send(error);
      });
  });
};

// 获取当前用户的收藏数据
exports.getLostCollect = (req, res) => {
  const sql = "select * from collection where user_id=? and collect_state=1";
  db.query(sql, req.auth.id, (err, results) => {
    if (err) {
      return res.send(err);
    }
    if (results.length <= 0) {
      return res.send({
        state: 201,
        msg: "当前用户没有收藏数据！",
      });
    }
    const getGoodsInfoPromises = results.map((item) => {
      if (item.lost_found === 1) {
        return new Promise((resolve, reject) => {
          const goodsSql = "select * from lost where id=?";
          db.query(goodsSql, item.goods_id, (err, goodsResult) => {
            if (err) {
              reject(err);
            } else if (goodsResult.length <= 0) {
              reject({
                state: 201,
                message: "物品信息获取失败！",
              });
            } else {
              const userSql = "select * from user where id=?";
              db.query(userSql, goodsResult[0].userid, (err, userResult) => {
                if (err) {
                  reject(err);
                } else if (userResult.length <= 0) {
                  reject({
                    state: 201,
                    message: "用户信息获取失败！",
                  });
                } else {
                    goodsResult[0].userInfo = userResult[0];
                    resolve(goodsResult[0]);
                }
              });
            }
          });
        });
      }
    });

    Promise.all(getGoodsInfoPromises)
      .then((finalResults) => {
        return res.status(200).send({
          state: 200,
          message: "获取数据成功！",
          data: finalResults,
        });
      })
      .catch((error) => {
        return res.status(500).send(error);
      });
  });
};


// 用户取消收藏
exports.cancelCollect = (req, res) => {
    const body = req.body;
  const sql = "select * from collection where goods_id=? and lost_found=? and user_id=?";
  db.query(sql, [body.goods_id,body.lost_found,req.auth.id ], (err, results1) => {
    if (err) {
      return res.send(err);
    }
    if (results1.lengt <= 0) {
      return res.send("获取数据失败");
    }
    const sql = "update collection set collect_state=? where goods_id=? and lost_found=? and user_id=?";
    const state = !results1[0].collect_state;
    db.query(sql, [state, body.goods_id,body.lost_found,req.auth.id], (err, results2) => {
      if (err) {
        return res.send(err);
      }
      if (results2.affectedRows !== 1) {
        console.log(results2.affectedRows)
        return res.send({
            state:201,
            message:"更新数据失败"
        });
      }
      res.send({
        state:200,
        message:"更新数据成功"
      })
    });
  });
}
// 获取当前用户的收藏数量
exports.getCollectCount = (req, res) => {
  const sql = "select count(*) as count from collection where user_id=? and collect_state=?";
  db.query(sql, [req.auth.id, 1], (err, results) => {
    if (err) {
      return res.send(err);
    }
    if (results.length <= 0) {
      return res.send({
        state: 201,
        message: "获取数据失败",
      });
    }
    res.send({
      state: 200,
      message: "获取数据成功",
      data: results[0],
    });
  });
};