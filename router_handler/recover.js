// 物品找回处理函数模块

const db = require("../db");

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
