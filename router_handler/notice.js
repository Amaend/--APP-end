// 系统公告模块
const db = require("../db");

// 获取系统公告
exports.getNotices = (req, res) => {
  const sql = "SELECT * FROM notice ORDER BY time desc";
  db.query(sql, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({
        message: "服务器错误",
      });
    }
    if (results.length === 0) {
      return res.send({
        state: 200,
        message: "暂无公告",
      });
    }
    if (results.length > 0) {
      return res.send({
        state: 200,
        message: "获取成功",
        data: results,
      });
    }
  });
};
// 根据用户id查找未读的系统公告内容
exports.getUnreadNoticesById = (req, res) => {
  let unreadResults = [];
  db.query("SELECT * FROM notice ORDER BY time desc", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "服务器错误",
      });
    }
    if (results.length === 0) {
      return res.send({
        state: 200,
        message: "暂无公告",
      });
    }
    for (let i = 0; i < results.length; i++) {
      if (
        !results[i].user_confir ||
        !results[i].user_confir.includes(req.auth.id)
      ) {
        // 如果 user_confir 不存在或不包含用户id，则将该公告加入未读列表
        unreadResults.push(results[i]);
      } else {
        // 其他情况（已读等），可以在此处进行处理，比如标记已读状态
        console.log("已读");
      }
    }
    res.send({
      state: 200,
      message: "获取成功",
      data: unreadResults.length ? unreadResults : [results[0]],
      unReadCount: unreadResults.length,
    });
  });
};
// 添加已读user_confir
exports.markAllNoticesAsRead = (req, res) => {
  const userId = req.auth.id;
  // 查询所有的公告
  db.query("SELECT * FROM notice ORDER BY time desc", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "服务器错误",
      });
    }
    if (results.length === 0) {
      return res.status(404).json({
        message: "暂无公告",
      });
    }
    // 对每个公告进行处理
    results.forEach((notice) => {
      // 检查 user_confir 是否存在，如果不存在，初始化为一个空数组
      const userConfir = notice.user_confir
        ? JSON.parse(notice.user_confir)
        : [];
      // 检查用户是否已读过该公告，如果没有，则将用户ID添加到 user_confir 中
      if (!userConfir.includes(userId)) {
        userConfir.push(userId);
        // 更新数据库中的 user_confir 字段
        db.query(
          "UPDATE notice SET user_confir = ? WHERE id = ?",
          [JSON.stringify(userConfir), notice.id],
          (updateErr, updateResults) => {
            if (updateErr) {
              console.error(updateErr);
              return res.status(500).json({
                message: "服务器错误",
              });
            }
          }
        );
      }
    });
    res.status(200).send({
      state: 200,
    });
  });
};
// 获取最新系统公告
exports.getLatestNotice = (req, res) => {
  db.query("SELECT * FROM notice ORDER BY time desc LIMIT 1", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "服务器错误",
      });
    }
    if (results.length === 0) {
      return res.status(404).json({
        message: "暂无公告",
      });
    }
    if(results.length>0){
        res.send({
            state: 200,
            data: results[0],
        })
    }
  });
};
