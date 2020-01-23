const router = require('express').Router()
const { body, validationResult } = require('express-validator')
const boom = require('boom')
const jwt = require('jsonwebtoken')
const Result = require('../models/Result')
const { md5 } = require('../utils')
const { login } = require('../services/user')
const { PWD_SUGAR, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')

router.post('/login',
  [
    body('username').isString().withMessage('用户名必须为字符'),
    body('password').isString().withMessage('用户名必须为字符')
  ], (req, res, next) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors // 双层解构 err.errors[0].msg
      next(boom.badRequest(msg)) // 传递错误给 boom 处理
    } else {
      /* eslint-disable */
      let { username, password } = req.body
      password = md5(`${password}${PWD_SUGAR}`)
      login(username, password).then(user => {
        if (!user || user.length === 0) {
          new Result('登录失败').fail(res)
        } else {
          const token = jwt.sign(
            { username }, // 非隐私数据
            PRIVATE_KEY, // 私钥
            { expiresIn: JWT_EXPIRED } // 辅助参数，过期时间...
          )
          new Result({ token }, '登录成功').success(res)
        }
      })
    }
  })

router.get('/info', (req, res) => {
  res.json('info page...')
})
module.exports = router
