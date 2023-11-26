const multer = require('multer')
const mkdir =require('./mkdir.js')

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    let url=req.body.url
    mkdir.mkdirs('../public/images/'+url,err=>{
      console.log(err)
    })
    callback(null, './public/images/'+url)
  },
  filFilter: function (req, file, cb) {
    var typeArray = file.mimetype.split('/')
    var fileType = typeArray[1]
    if (fileType == 'jpg' || fileType == 'png') {
      cb(null, true)
    } else {
      cb(null, false)
    }
  },
  filename: function (req, file, callback) {
    //fieldname 为文件域的名称
    callback(null, file.fieldname + '_' + Date.now() + '.jpg')
  }
})

const upload = multer({ storage: storage })

module.exports = upload
