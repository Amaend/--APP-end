// 导入 mysql
const mysql = require('mysql')

// 配置 mysql
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'campus_search',
  charset:'utf8mb4'
})

module.exports = db