// 用户评论模块
const db = require("../db");

// 用户添加评论信息
exports.addComment = (req, res) => {
  console.log(req.body);
  const body = {
    ...req.body,
    comtime: new Date(),
  };
  const sql = "insert into comment set ?";
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
      data: {
        id: results.insertId,
      },
    });
  });
};

// 获取评论信息
function getThreeLevelComments(comment) {
  return new Promise((resolve, reject) => {
    const threeCom = [];
    function getThreeCom(comment) {
      const threeComSql = "SELECT * FROM comment WHERE comid = ?";
      db.query(threeComSql, comment.id, (err, threeComResult) => {
        if (err) {
          reject(err);
        } else {
          if (threeComResult.length > 0) {
            threeComResult.forEach((threeItem) => {
              threeCom.push(threeItem);
              getThreeCom(threeItem); // 递归调用以获取三级评论
            });
          }
        }
      });
    }
    getThreeCom(comment);
    // 假设在此设置一个延迟模拟异步操作完成
    setTimeout(() => {
      comment.threeCom = threeCom;
      resolve(comment);
    }, 100); // 这里设置一个延迟，模拟异步操作
  });
}

exports.getComment = (req, res) => {
  const lost_found = req.query.lost_found;
  const goods_id = req.query.goods_id;
  const sql = `SELECT * FROM comment WHERE lost_found = ? AND goods_id = ? ORDER BY comtime`;
  db.query(sql, [lost_found, goods_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length <= 0) {
      return res.send({
        state: 201,
        message: "暂无评论数据！",
      });
    }
    const getUserInfoPromises = results.map((item) => {
      return new Promise((resolve, reject) => {
        const secondComSql = "SELECT * FROM comment WHERE comid = ?";
        db.query(secondComSql, item.id, (err, secondComResult) => {
          if (err) {
            reject(err);
          } else {
            item.secondCom = secondComResult || [];
            const promises = item.secondCom.map((secondComment) => {
              return getThreeLevelComments(secondComment);
            });
            Promise.all(promises)
              .then((commentsWithThreeCom) => {
                item.secondCom = commentsWithThreeCom;
                resolve(item);
              })
              .catch((error) => {
                reject(error);
              });
          }
        });
      });
    });
    Promise.all(getUserInfoPromises)
      .then((finalResults) => {
        return res.status(200).send({
          state: 200,
          message: "获取评论数据成功！",
          data: finalResults,
        });
      })
      .catch((error) => {
        return res.status(500).send(error);
      });
  });
};

// 根据用户id获取用户的评论数
exports.getUserCommentsCount = (req, res) => {
  const userid = req.query.userid;
  const sql = "SELECT COUNT(*) AS count FROM comment WHERE comuser_id = ?";
  db.query(sql, userid, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send({
        state: 200,
        message: "获取评论数成功！",
        data: result[0].count,
      });
    }
  });
};
// 用户通过自己id来判断是否可以删除该评论信息
exports.deleteCommentById = (req, res) => {
  const id = req.query.id;
  const userid = req.query.userid;
  const sql = "SELECT comuser_id FROM comment WHERE id = ?";
  db.query(sql, id, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      if (result[0].comuser_id == userid) {
        const sql = "DELETE FROM comment WHERE id = ?";
        db.query(sql, id, (err, result) => {
          if (err) {
            return res.status(500).send(err);
          } else {
            return res.status(200).send({
              state: 200,
              message: "删除评论成功！",
            });
          }
        });
      } else {
        return res.status(200).send({
          state: 200,
          message: "您没有权限删除该评论！",
        });
      }
    }
  });
};
// 获取用户回复评论消息
exports.getReplyComment = (req, res) => {
  const id = req.auth.id;
  const sql = "SELECT * FROM comment WHERE replyuser_id = ? ORDER BY comtime DESC";
  db.query(sql, id, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length == 0) {
      return res.send({
        state: 201,
        message: "暂无回复评论信息！",
      });
    }
    return res.send({
      state: 200,
      message: "获取回复评论信息成功！",
      data: result,
    });
  });
};