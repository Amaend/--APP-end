const multer = require("multer");
const mkdir = require("./mkdir.js");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    let url = req.body.url;
    mkdir.mkdirs("../public/images/" + url, (err) => {
      console.log(err);
    });
    callback(null, "./public/images/" + url);
  },
  filFilter: function (req, file, cb) {
    // 检查文件的 MIME 类型是否为 'jpg'、'png' 或 'audio/mp3'
    if (
      file.mimetype === "audio/mp3" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  filename: function (req, file, callback) {
    let type=file.originalname.replace(/.+\./,".");
    //fieldname 为文件域的名称
    callback(null, file.fieldname + "_" + Date.now() + type);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
