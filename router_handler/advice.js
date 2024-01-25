// 建议模块
const db = require("../db");

// 用户添加建议
exports.userAddAdvice = function (req, res) {
  let data = req.body;
  db.query(`INSERT INTO advice SET ?`, data, (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send({
        state: 200,
        message: "提交成功",
      });
    } else {
      res.send({
        state: 200,
        message: "提交失败",
      });
    }
  });
};
