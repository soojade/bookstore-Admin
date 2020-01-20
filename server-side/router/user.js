const router = require('express').Router()

router.get('/', (req, res, next) => {
  res.json('欢迎来到用户信息页面')
})

module.exports = router
