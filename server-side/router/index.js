const router = require('express').Router()
const boom = require('boom')
const userRouter = require('./user')
const Result = require('../models/Result')
const jwtAuth = require('./jwt')

// 对所有路由进行 jwt 认证
router.use(jwtAuth)

router.get('/', (req, res) => {
  res.send('欢迎来到书城管理后台系统')
})
router.use('/user', userRouter)

// 处理404 错误页面，注意位置
router.use((req, res, next) => {
  next(boom.notFound('页面不存在'))
})
// 根据上面的处理信息，进行进一步处理
router.use((err, req, res, next) => {
  if (err.name && err.name === 'UnauthorizedError') {
    const { status = 401, message } = err
    new Result(null, 'token失效', {
      error: status,
      errorMsg: message
    }).jwtError(res.status(status))
  } else {
    const msg = err && err.message || '系统错误' // 获取上面设置的message
    const statusCode = err.output && err.output.statusCode || 500
    const errorMsg = err.output && err.output.payload && err.output.payload.error || err.message
    new Result(null, msg, {
      error: statusCode,
      errorMsg
    }).fail(res.status(statusCode))
  }
})

module.exports = router
