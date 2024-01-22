// 好友模块
const db = require("../db");
// 保存this指向
let that = this;
// 搜索好友
exports.searchFriend = function (req, res) {
  const friendId = req.query.id;
  db.query(
    `SELECT img,id,name,user_Signs,phone FROM user WHERE id = ?`,
    friendId,
    function (err, results) {
      if (err) return res.send(err);
      if (results.length == 0) {
        return res.send({
          state: 201,
          message: "该用户不存在",
        });
      }
      db.query(
        `SELECT * FROM friend WHERE user_id = ? AND friend_id = ? and state = 0`,
        [req.auth.id, friendId],
        function (err, friendResults) {
          if (err) return res.send(err);
          if (friendResults.length > 0) {
            results[0].isFriend = true;
          } else {
            results[0].isFriend = false;
          }
          return res.send({
            state: 200,
            data: results[0],
            message: "搜索成功",
          });
        }
      );
    }
  );
};

// 添加好友表
exports.addFriend = function (uid, fid, state) {
  let data = {
    user_id: uid,
    friend_id: fid,
    state: state,
    time: new Date().getTime(),
    last_time: new Date().getTime(),
  };
  db.query(`INSERT INTO friend SET ?`, data, function (err, results) {
    if (err) {
      console.log(err);
      console.log("添加好友表失败");
    } else {
      console.log("添加好友表成功");
    }
  });
};

// 添加一对一消息表
exports.addOneMsg = function (uid, fid, msg, type, res) {
  let data = {
    user_id: uid,
    friend_id: fid,
    message:type==0 ? msg : JSON.stringify(msg),
    types: type,
    time: new Date().getTime(),
    state: 1,
  };
  db.query(`INSERT INTO message SET ?`, data, function (err, results) {
    if (err){
      console.log(err)
    }
  });
};

// 好友最后通讯时间
exports.updateFriendLastTime = function (uid, fid) {
  db.query(
    `UPDATE friend SET last_time=? WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
    [new Date().getTime(), uid, fid, fid, uid],
    function (err, results) {
      if (err) {
        console.log("更新最后通信时间失败");
      } else {
        console.log("更新最后通信时间成功");
      }
    }
  );
};
// 好友申请
exports.applyFriend = function (req, res) {
  console.log(req.body);
  let data = req.body;
  // console.log(data)
  // 先去好友表查询是否存在这一条好友数据
  db.query(
    `SELECT * FROM friend WHERE user_id=? AND friend_id=?`,
    [data.user_id, data.friend_id],
    function (err, results) {
      // console.log(results)
      if (err) return res.send(err);
      if (results.length == 0) {
        that.addFriend(data.user_id, data.friend_id, 2);
        that.addFriend(data.friend_id, data.user_id, 1);
      } else {
        that.updateFriendLastTime(data.user_id, data.friend_id);
      }
      that.addOneMsg(data.user_id, data.friend_id, data.msg, 0, res);
    }
  );
};

// 同意好友申请
exports.agreeFriend = function (req, res) {
  let data = req.body;
  db.query(
    `UPDATE friend 
  SET state = ? 
  WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
    [0, data.user_id, data.friend_id, data.friend_id, data.user_id],
    function (err, results) {
      if (err) {
        console.error("Error updating friendship state:", err);
        return res.status(500).send({
          error: "Could not update friendship state",
        });
      }

      if (results.affectedRows > 0) {
        res.status(200).send({
          state: 200,
          message: "好友添加成功",
        });
      } else {
        res.status(404).send({
          state: 404,
          message: "未找到要更新的好友关系",
        });
      }
    }
  );
};

// 拒绝好友或者删除好友
exports.refuseFriend = function (req, res) {
  let data = req.body;
  db.query(
    `DELETE FROM friend 
  WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
    [data.user_id, data.friend_id, data.friend_id, data.user_id],
    function (err, results) {
      if (err) {
        console.error("Error deleting friendship:", err);
        return res.status(500).send({
          error: "Could not delete friendship",
        });
      }

      if (results.affectedRows > 0) {
        res.status(200).send({
          state: 200,
          message: "拒绝好友添加",
        });
      } else {
        res.status(404).send({
          state: 404,
          message: "未找到要删除的好友关系",
        });
      }
    }
  );
};

// 获取好友列表
function getFriendList(uid, state, res) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM friend WHERE user_id = ? and state=? ORDER BY last_time desc`,
      [uid, state],
      function (err, results) {
        if (err) {
          console.error("Error getting friend list:", err);
          return res.status(500).send({
            error: "Could not get friend list",
          });
        }
        if (results.length == 0) {
          return res.send({
            state: 201,
            message: "暂无好友",
          });
        }
        if (results.length > 0) {
          for (let i = 0; i < results.length; i++) {
            db.query(
              `select id,name,img,user_Signs from user where id=?`,
              results[i].friend_id,
              function (err, usreResult) {
                if (usreResult.length < 0) {
                  return res.status(500).send({
                    error: "Could not get friend list",
                  });
                } else {
                  results[i].friendInfo = usreResult[0];
                  // results[i].type = 0;
                }
              }
            );
          }
          resolve(results);
        }
      }
    );
  });
}

// 按要求获取最后一条消息数
function getOneMessage(uid, fid) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM message 
      WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?) 
      ORDER BY time DESC LIMIT 1`,
      [uid, fid, fid, uid],
      function (err, results) {
        if (err) {
          console.error("Error getting one message:", err);
          reject(err); // Reject promise on error
        }
        resolve(results[0]); // Resolve with the first (and only) result
      }
    );
  });
}

// 汇总一对一消息未读数
function getOneMessageUnread(uid, fid) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT COUNT(*) as unread FROM message WHERE friend_id = ? AND user_id = ? AND state = 1`,
      [uid, fid],
      function (err, results) {
        if (err) {
          console.error("Error getting one message unread:", err);
        }
        resolve(results[0]);
      }
    );
  });
}

// 汇总获取好友信息
exports.getFriendListInfo = async function (req, res) {
  try {
    let data = req.body;
    const friendResults = await getFriendList(data.user_id, data.state, res);

    for (let i = 0; i < friendResults.length; i++) {
      const oneMsgResults = await getOneMessage(
        data.user_id,
        friendResults[i].friend_id
      );

      if (oneMsgResults.types == 0) {
        // oneMsgResults.message = "[文字]";
      } else if (oneMsgResults.types == 1) {
        oneMsgResults.message = "[图片]";
      } else if (oneMsgResults.types == 2) {
        oneMsgResults.message = "[语音]";
      } else if (oneMsgResults.types == 3) {
        oneMsgResults.message = "[位置]";
      }

      friendResults[i].oneMsgResults = oneMsgResults;

      const unreadResults = await getOneMessageUnread(
        data.user_id,
        friendResults[i].friend_id
      );
      friendResults[i].unreadResults = unreadResults;
    }

    res.send({
      state: 200,
      msg: "获取好友列表成功",
      data: friendResults,
    });
  } catch (err) {
    res.status(500).send({
      state: 201,
      msg: "获取好友列表失败",
      error: err,
    });
  }
};

// 查看申请好友列表
exports.getApplyFriendList = async function (req, res) {
  try {
    let data = req.body;
    const friendResults = await getFriendList(data.user_id, data.state, res);

    for (let i = 0; i < friendResults.length; i++) {
      const oneMsgResults = await getOneMessage(
        data.user_id,
        friendResults[i].friend_id
      );

      if (oneMsgResults.types == 0) {
        // oneMsgResults.message = "[文字]";
      } else if (oneMsgResults.types == 1) {
        oneMsgResults.message = "[图片]";
      } else if (oneMsgResults.types == 2) {
        oneMsgResults.message = "[语音]";
      } else if (oneMsgResults.types == 3) {
        oneMsgResults.message = "[位置]";
      }

      friendResults[i].oneMsgResults = oneMsgResults;
    }

    res.send({
      state: 200,
      msg: "查看申请好友列表成功",
      data: friendResults,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      state: 201,
      msg: "查看申请好友列表失败",
      error: err,
    });
  }
};

// 一对一消息状态修改
exports.updateOneMessageState = function (req, res) {
  let data = req.body;
  const sql = "update message set state=0 where user_id=? and friend_id=?";
  db.query(sql, [data.friend_id, req.auth.id], (err, results) => {
    if (err) {
      return res.send(err);
    }
    if (results.affectedRows == 0) {
      return res.send({
        message: "更新状态失败！",
        state: 201,
      });
    }
    res.send({
      message: "更新状态成功！",
      state: 200,
    });
  });
};

// 分页获取数据一对一聊天数据
exports.getOneMessageByPage = (req, res) => {
  let data=req.body;
  const params = [
    data.user_id,
    data.friend_id,
    data.friend_id,
    data.user_id,
    (parseInt(data.page_num) - 1) * parseInt(data.page_size),
    parseInt(data.page_size),
  ];
  let countSql = `SELECT COUNT(*) AS total FROM message where (user_id=? and friend_id=?) or (user_id=? and friend_id=?)`;
  const sql = `select * from message where (user_id=? and friend_id=?) or (user_id=? and friend_id=?) ORDER BY time DESC limit ?,?`;
  db.query(countSql,[data.user_id,data.friend_id,data.friend_id,data.user_id], (err, countResult) => {
    if (err) {
      return res.status(500).send(err);
    }
    const total = countResult[0].total;
    const total_pages = Math.ceil(total / parseInt(data.page_size));
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
          db.query(userSql, item.user_id, (err, userResult) => {
            if (err) {
              reject(err);
            } else if (userResult.length !== 1) {
              reject({
                state: 201,
                message: "用户信息获取失败！",
              });
            }else{
              item.isMe=req.auth.id == userResult[0].id;
              item.img=userResult[0].img;
              item.name=userResult[0].name;
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
              page_num: parseInt(data.page_num),
              page_size: parseInt(data.page_size),
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
// 上传聊天附件
exports.uploaMsgdFile = (req, res) => {
  const message = `/images/${req.body.url}/` + req.file.filename;
  if(message){
    return res.send({
      state: 200,
      message: message,
    })
  }
}