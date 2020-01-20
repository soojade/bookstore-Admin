const Express = require('express')
const router = require('./router')

const app = new Express()

app.use('/', router)

app.listen(8888, () => {
  console.log('服务启动成功，地址：http://localhost:8888')
})
