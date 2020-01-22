const router = require('express').Router()
const Result = require('../models/Result')
router.post('/login', (req, res, next) => {
  const username = req.body.username
  const password = req.body.password

  if (username === 'admin' && password === '111111') {
    new Result('登录成功').success(res)
  } else {
    new Result('登录失败').fail(res)
  }
})
module.exports = router
