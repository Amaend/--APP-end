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
          const state = !results1[0].collect_state ?1 :0;
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
exports.getCollect = (req, res) => {
  const user_id = req.query.user_id;
  const sql = "select * from collection where user_id=?";
  db.query(sql, user_id, (err, results) => {
    if (err) {
      return res.send(err);
    }
    if (results.length <= 0) {
      return res.send({
        state: 201,
        msg: "当前用户没有收藏数据！",
      });
    }
    res.send({
      state: 200,
      msg: "获取收藏数据成功！",
      data: results,
    });
  });
};

// 删除收藏数据
exports.delCollect = (req, res) => {
  const body = req.body;
  const sql = "delete from collection where user_id=? and goods_id=? and lost_found=?";
  db.query(sql, [body.user_id, body.goods_id, body.lost_found], (err, results) => {
    if (err) {
      return res.send(err);
    }
    if (results.affectedRows !== 1) {
      return res.send({
        state: 201,
        msg: "删除收藏数据失败！",
      });
    }
    res.send({
      state: 200,
      msg: "删除收藏数据成功！",
    });
  });
};
