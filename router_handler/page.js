const db = require('../db')

// 失物分页功能
exports.pageLost = (req, res) => {
  const page_num = req.query.page_num //当前的num
  const page_size = req.query.page_size //当前页的数量
  const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
  const sql = 'select * from lost limit ?,?'
  db.query(sql, params, (err, results1) => {
    if (err) {
      return res.ss(err)
    }
    if (results1.lengt <= 0) {
      return res.ss('查询失败！')
    }
    const sql = 'select * from lost'
    db.query(sql, (err, results2) => {
      if (err) {
        return res.ss(err)
      }
      if (results2.length <= 0) {
        return res.ss('查询失败！')
      }
      const total = results2.length
      res.send({
        state: 200,
        message: '查询成功！',
        data: results1,
        paging: {
          page_num: page_num,
          page_size: page_size,
          total: total
        }
      })
    })
  })
}

// 招领分页功能
exports.pageFound = (req, res) => {
  const page_num = req.query.page_num //当前的num
  const page_size = req.query.page_size //当前页的数量
  const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
  console.log(params)
  const sql = 'select * from claim limit ?,?'
  db.query(sql, params, (err, results1) => {
    if (err) {
      return res.ss(err)
    }
    if (results1.lengt <= 0) {
      return res.ss('查询失败！')
    }
    const sql = 'select * from claim'
    db.query(sql, (err, results2) => {
      if (err) {
        return res.ss(err)
      }
      if (results2.length <= 0) {
        return res.ss('查询失败！')
      }
      const total = results2.length
      res.send({
        state: 200,
        message: '查询成功！',
        data: results1,
        paging: {
          page_num: page_num,
          page_size: page_size,
          total: total
        }
      })
    })
  })
}

// 用户管理分页功能
exports.pageUserAdmin = (req, res) => {
  const page_num = req.query.page_num
  const page_size = req.query.page_size
  const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
  const sql = 'select * from user limit ?,?'
  db.query(sql, params, (err, results1) => {
    if (err) {
      return res.ss(err)
    }
    if (results1.lengt <= 0) {
      return res.ss('查询失败！')
    }
    const sql = 'select * from user'
    db.query(sql, (err, results2) => {
      if (err) {
        return res.ss(err)
      }
      if (results2.length <= 0) {
        return res.ss('查询失败！')
      }
      const total = results2.length
      res.send({
        state: 200,
        message: '查询成功！',
        data: results1,
        paging: {
          page_num: page_num,
          page_size: page_size,
          total: total
        }
      })
    })
  })
}