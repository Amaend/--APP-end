// 分类管理模块处理函数

const db = require("../db");

// 获取分类信息
exports.classList = (req, res) => {
  const sql = "select * from class";

  db.query(sql, (err, results) => {
    if (err) {
      return res.ss(err);
    }
    if (results.length <= 0) {
      return res.send({
        state: 201,
        message: "获取分类数据失败！",
      });
    }
    res.send({
      state: 200,
      message: "获取分类信息成功！",
      data: results,
      date: new Date(),
    });
  });
};

// 新增分类
exports.addClass = (req, res) => {
  const body = req.body;
  const sql = "select * from class where name=?";

  db.query(sql, body.name, (err, results) => {
    if (err) {
      return res.ss(err);
    }
    if (results.length === 1) {
      return res.ss("分类已存在，无法新增！");
    }

    const sql = "insert into class set ?";
    db.query(sql, body, (err, results) => {
      if (err) {
        return res.ss(err);
      }
      if (results.affectedRows !== 1) {
        return res.ss("新增分类失败！");
      }
      res.ss("新增分类成功！", 200);
    });
  });
};

// 删除分类
exports.deleteClass = (req, res) => {
  const id = req.query.id;
  const sql = "delete from class where id=?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.ss(err);
    }
    if (results.affectedRows !== 1) {
      return res.ss("删除分类失败！");
    }
    res.ss("删除分类成功！", 200);
  });
};

// 根据分类获取对应分类的失物和招领信息数据
exports.lostClassList = (req, res) => {
  const id = req.query.id;
  const sql = "select * from lost where class=?";
  db.query(sql, id, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length <= 0) {
      return res.status(404).send({
        state: 201,
        message: "获取数据失败！",
      });
    }

    const getUserInfoPromises = results.map(item => {
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
      .then(finalResults => {
        return res.status(200).send({
          state: 200,
          message: "获取数据成功！",
          data: finalResults,
        });
      })
      .catch(error => {
        return res.status(500).send(error);
      });
  });
};


exports.foundClassList = (req, res) => {
  const id = req.query.id;
  const sql = "select * from claim where class=?";
  db.query(sql, id, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length <= 0) {
      return res.status(404).send({
        state: 201,
        message: "获取数据失败！",
      });
    }

    const getUserInfoPromises = results.map(item => {
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
      .then(finalResults => {
        return res.status(200).send({
          state: 200,
          message: "获取数据成功！",
          data: finalResults,
        });
      })
      .catch(error => {
        return res.status(500).send(error);
      });
  });
};
