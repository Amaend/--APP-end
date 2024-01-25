var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var http = require('http');
// 导入 config.js
const config = require("./config.js");
// 导入 express-jwt
const { expressjwt: jwt } = require("express-jwt");
// 注册路由模块
var usersRouter = require("./router/user");
// 用户信息模块
var usersInfoRouter = require("./router/userinfo");
// 失物招领模块
let claimsRouter = require("./router/claim");
// 寻物启事模块
let lostRouter = require("./router/lost");
// 物品分类路由模块
let classRouter = require("./router/class");
// 分页功能路由模块
let pageRouter = require("./router/page");
// 收藏功能路由模块
let collectRouter = require("./router/collect");
// 评论功能路由模块
let commentRouter = require("./router/comment");
// 好友功能路由模块
let friendRouter = require("./router/friend");
// 系统公告模块
let noticeRouter = require("./router/notice");
// 建议模块
let adviceRouter = require("./router/advice");
var app = express();


// 注册路由
app.use("/api/users", usersRouter);
app.use("/api/usersinfo", usersInfoRouter);
app.use("/api/claims", claimsRouter);
app.use("/api/lost", lostRouter);
app.use("/api/class", classRouter);
app.use("/api/page", pageRouter);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// 配置解析 token 并排除/api开头的接口
app.use(
  jwt({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({
    path: /\/api\//,
  })
);

// websocket.io部分

const httpserver = http.createServer(app);
const io = require("socket.io")(httpserver, {
  allowEIO3: true,
  // 解决跨域问题
  cors: {
    origin: "*", // from the screenshot you provided
  },
});

httpserver.listen(8080,()=>{
  console.log("启动成功！");
});

require('./router_handler/socket.js')(io);


// error handler
app.use(function (err, req, res, next) {
  // token解析失败导致的错误
  if (err.name === "UnauthorizedError") {
    return res.send({ state: 401, message: "无效的token" });
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
  // catch 404 and forward to error handler
  next(createError(404));
});

// 使用路由
// 用户登录路由
app.use("/api/user", usersRouter);
// 用户信息路由
app.use("/my", usersInfoRouter);
// 失物招领模块
app.use("/my", claimsRouter);
// 寻物启事路由
app.use("/my", lostRouter);
// 分类路由
app.use("/class", classRouter);
// 分页模块
app.use("/page", pageRouter);
// 收藏模块
app.use("/collect", collectRouter);
// 评论模块
app.use("/comment", commentRouter);
// 好友模块
app.use("/friend", friendRouter);
// 系统公告模块
app.use("/notice", noticeRouter);
// 建议模块
app.use("/advice", adviceRouter);
module.exports = app;
