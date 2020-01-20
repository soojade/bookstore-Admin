const router = require('express').Router()
const boom = require('boom')
const userRouter = require('./user')
const { CODE_ERROR } = require('../utils/constant')

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
  const msg = err && err.message || '系统错误' // 获取上面设置的message
  const statusCode = err.output && err.output.statusCode || 500
  const errorMsg = err.output && err.output.payload && err.output.payload.error || err.message
  res.status(statusCode).json({
    code: CODE_ERROR,
    msg,
    error: statusCode,
    errorMsg
  })
})

module.exports = router
