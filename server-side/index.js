const Express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const router = require('./router')

const app = new Express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/', router)

app.listen(80, () => {
  console.log('服务启动成功，地址：http://localhost:80')
})
