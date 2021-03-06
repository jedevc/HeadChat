var express = require('express')
var socketIO = require('socket.io')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var less = require('less-middleware')

var browserify = require('browserify-middleware')
var babelify = require('babelify')
var vueify = require('vueify')

var routes = require('./config/routes.js')

var app = express()
var io = socketIO()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// setup various middlewares
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// setup less stylesheets
var lessOptions = {}
if (app.get('env') === 'production') {
  lessOptions = {
    debug: false,
    once: true
  }
} else {
  lessOptions = {
    debug: true,
    once: false,
  }
}
app.use('/stylesheets', less(path.join(__dirname, 'public', 'stylesheets'), lessOptions))

// setup browserify
browserify.settings({
  noParse: ['jquery'],
  transform: [babelify.configure({
    presets: ['env']
  }), vueify]
})
app.use('/javascripts', browserify(path.join(__dirname, 'public', 'javascripts')))

// serve static files
app.use('/images', express.static(path.join(__dirname, 'public', 'images')))
app.use('/javascripts', express.static(path.join(__dirname, 'public', 'javascripts')))
app.use('/stylesheets', express.static(path.join(__dirname, 'public', 'stylesheets')))

// setup routes
routes(app, io)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// export app and socket.io to attach to http server
module.exports = {
  app: app,
  io: io
}
