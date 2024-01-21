module.exports = function (io) {
  //绑定事件connection，此事件是当有客户端连接时，触发
  io.on("connection", function (socket) {
    let user = {}; //socket注册用户
    console.log("客户端连接成功");
    //可以在这里写一些客户端连接成功后的逻辑处理代码，比如发送欢迎信息等。
    // 用户登录注册
    socket.on("login", (id) => {
      //回复客服端
      socket.emit("msg", socket.id);
      socket.name = id;
      user[id] = socket.id;
      console.log(user)
    });

    //用户一对一消息
    socket.on('msg',(msg,fromid,toid)=>{
        console.log(msg,fromid,toid)
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
