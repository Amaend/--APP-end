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

// 管理员查看建议列表
exports.adminGetAdviceList = function (req, res) {
  const page_num = req.query.page_num; //当前的num
  const page_size = req.query.page_size; //当前页的数量
  const params = [
    (parseInt(page_num) - 1) * parseInt(page_size),
    parseInt(page_size),
  ];
  const sql = "select * from advice limit ?,?";
  db.query(sql, params, (err, results1) => {
    if (err) {
      return res.ss(err);
    }
    if (results1.lengt <= 0) {
      return res.ss("查询失败！");
    }
    const sql = "select * from advice";
    db.query(sql, (err, results2) => {
      if (err) {
        return res.ss(err);
      }
      if (results2.length <= 0) {
        return res.ss("查询失败！");
      }
      const total = results2.length;
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
    });
  });
};

// 管理员删除建议
exports.adminDeleteAdvice = function (req, res) {
  const id = req.query.id;
  const sql = "delete from advice where id = ?";
  db.query(sql, id, (err, results) => {
    if (err) {
      res.send({
        state: 500,
        message: err,
      });
    } else {
      if (results.affectedRows !== 1) {
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
