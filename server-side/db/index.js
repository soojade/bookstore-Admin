const mysql = require('mysql')
const { host, user, password, database } = require('./config')
const { DEBUG } = require('../utils/constant')

function connect() {
  return mysql.createConnection({
    host,
    user,
    password,
    database,
    multipleStatements: true // 允许每条sql语句有多条查询，但要防止sql注入，默认false
  })
}

function querySql(sql) {
  const conn = connect()
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, result) => {
        if (err) {
          // TODO: 调试
          DEBUG && console.log('查询失败，原因:' + JSON.stringify(err))
          reject(err)
        } else {
          // TODO: 调试
          DEBUG && console.log('查询成功', JSON.stringify(result))
          resolve(result)
        }
      })
    } catch (e) {
      reject(e)
    } finally {
      conn.end() // 要释放链接，否则会造成内存泄露
    }
  })
}

function queryOne(sql) {
  return new Promise((resolve, reject) => {
    querySql(sql).then(result => {
      if (result && result.length > 0) {
        resolve(result[0])
      } else {
        resolve(null)
      }
    }).catch(err => {
      reject(err)
    })
  })
}
module.exports = {
  querySql,
  queryOne
}
