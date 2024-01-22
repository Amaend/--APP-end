const friend = require("./friend");

module.exports = function (io) {
  let user = {}; //socket注册用户
  //绑定事件connection，此事件是当有客户端连接时，触发
  io.on("connection", function (socket) {
    console.log("客户端连接成功");
    //可以在这里写一些客户端连接成功后的逻辑处理代码，比如发送欢迎信息等。
    // 用户登录注册
    socket.on("login", (id) => {
      //回复客服端
      socket.emit("login", socket.id);
      socket.name = id;
      user[id] = socket.id;
    });

    //用户一对一消息
    socket.on('msg',(msg,fromid,toid)=>{
        // 修改好友最后通信时间
        friend.updateFriendLastTime(fromid,toid)
        // 储存一对一消息
        friend.addOneMsg(fromid,toid,msg.msg,msg.type)
        // 发送给对方
        if(user[toid]){
          socket.to(user[toid]).emit("msg",msg,fromid,0)
        }
        // 发送给自己
        socket.emit("msg",msg,toid,1)
    }) 

    // 用户离开
    socket.on("disconnecting", () => {
        if(user.hasOwnProperty(socket.name)){
            delete user[socket.name];
            console.log(user)
        }
    });
  });
};
