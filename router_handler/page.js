const db = require("../db");

// 失物分页功能
exports.pageLost = (req, res) => {
  console.log(req.query);
  const page_num = req.query.page_num; //当前的num
  const page_size = req.query.page_size; //当前页的数量
  const state = req.query.state;
  const params = [
    (parseInt(page_num) - 1) * parseInt(page_size),
    parseInt(page_size),
  ];
  let countSql = `SELECT COUNT(*) AS total FROM lost where state =${state}`;
  const sql = `select * from lost Where state = ${state} ORDER BY date DESC limit ?,?`;
  db.query(countSql, (err, countResult) => {
    if (err) {
      return res.status(500).send(err);
    }
    const total = countResult[0].total;
    const total_pages = Math.ceil(total / parseInt(page_size));
    db.query(sql, params, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.length <= 0) {
        return res.status(404).send({
          state: 201,
          message: "获取数据失败！",
        });
      }

      const getUserInfoPromises = results.map((item) => {
        return new Promise((resolve, reject) => {
          const userSql = "select * from user where id=?";
          db.query(userSql, item.userid, (err, userResult) => {
            if (err) {
              reject(err);
            } else if (userResult.length !== 1) {
              reject({
                state: 201,
                message: "用户信息获取失败！",
              });
            } else {
              item.userInfo = userResult[0];
              resolve(item);
            }
          });
        });
      });

      Promise.all(getUserInfoPromises)
        .then((finalResults) => {
          return res.status(200).send({
            state: 200,
            message: "获取数据成功！",
            data: finalResults,
            paging: {
              page_num: parseInt(page_num),
              page_size: parseInt(page_size),
              total: total,
              total_pages: total_pages,
            },
          });
        })
        .catch((error) => {
          return res.status(500).send(error);
        });
    });
  });
};

// 招领分页功能
exports.pageFound = (req, res) => {
  const page_num = req.query.page_num; //当前的num
  const page_size = req.query.page_size; //当前页的数量
  const state = req.query.state;
  const params = [
    (parseInt(page_num) - 1) * parseInt(page_size),
    parseInt(page_size),
  ];
  console.log(params);
  const sql = `select * from claim Where state=${state} ORDER BY date DESC limit ?,?`;
  let countSql = `SELECT COUNT(*) AS total FROM claim where state=${state}`;
  db.query(countSql, (err, countResult) => {
    if (err) {
      return res.status(500).send(err);
    }
    const total = countResult[0].total;
    const total_pages = Math.ceil(total / parseInt(page_size));
    db.query(sql, params, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.length <= 0) {
        return res.status(404).send({
          state: 201,
          message: "获取数据失败！",
        });
      }

      const getUserInfoPromises = results.map((item) => {
        return new Promise((resolve, reject) => {
          const userSql = "select * from user where id=?";
          db.query(userSql, item.userid, (err, userResult) => {
            if (err) {
              reject(err);
            } else if (userResult.length !== 1) {
              reject({
                state: 201,
                message: "用户信息获取失败！",
              });
            } else {
              item.userInfo = userResult[0];
              resolve(item);
            }
          });
        });
      });

      Promise.all(getUserInfoPromises)
        .then((finalResults) => {
          return res.status(200).send({
            state: 200,
            message: "获取数据成功！",
            data: finalResults,
            paging: {
              page_num: parseInt(page_num),
              page_size: parseInt(page_size),
              total: total,
              total_pages: total_pages,
            },
          });
        })
        .catch((error) => {
          return res.status(500).send(error);
        });
    });
  });
};

// 用户管理分页功能
exports.pageUserAdmin = (req, res) => {
  const page_num = req.query.page_num;
  const page_size = req.query.page_size;
  const params = [
    (parseInt(page_num) - 1) * parseInt(page_size),
    parseInt(page_size),
  ];
  const sql = "select * from user limit ?,?";
  db.query(sql, params, (err, results1) => {
    if (err) {
      return res.send(err);
    }
    if (results1.lengt <= 0) {
      return res.send("查询失败！");
    }
    const sql = "select * from user";
    db.query(sql, (err, results2) => {
      if (err) {
        return res.send(err);
      }
      if (results2.length <= 0) {
        return res.send("查询失败！");
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
