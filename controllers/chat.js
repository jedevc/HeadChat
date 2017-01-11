var express = require('express')
var router = express.Router()

/* GET chatting page. */
router.get('/', function (req, res, next) {
  if (req.query.nick) {
    res.render('chat', {nick: req.query.nick})
  } else {
    res.redirect('/')
  }
})

module.exports.app = router
