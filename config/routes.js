var fs = require('fs')

var routes = fs.readdirSync('controllers')
               .filter(file => file.endsWith('.js'))
               .map(file => file.substring(0, file.lastIndexOf('.')))

function setup (app, io) {
  for (var route of routes) {
    var controller = require(`../controllers/${route}.js`)

    if (controller.app) {
      if (route === 'index') {
        app.use('/', controller.app)
      } else {
        app.use(`/${route}`, controller.app)
      }
    }

    if (controller.io) {
      io.of(`/${route}`).on('connection', controller.io)
    }
  }
}

module.exports = setup
