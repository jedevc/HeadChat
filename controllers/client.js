var uuid = require('uuid/v1')

var lobby = {}

function initialize (socket) {
  socket.on('disconnect', () => {
    if (socket.id in lobby) {
      delete lobby[socket.id]
    }

    if (socket.room) {
      socket.to(socket.room).emit('left')
    }
  })
  socket.on('new', () => {
    if (socket.room) {
      socket.to(socket.room).emit('left')
      socket.leave(socket.room)
      socket.room = null
    }

    if (!(socket.id in lobby)) {
      var sockets = Object.keys(lobby)
      if (sockets.length > 0) {
        var key = sockets[Math.floor(Math.random() * sockets.length)]

        var other = lobby[key]
        delete lobby[key]

        var room = uuid()
        socket.room = room
        socket.join(room)
        socket.emit('ready')
        other.room = room
        other.join(room)
        other.emit('ready')
      } else {
        lobby[socket.id] = socket
      }
    }
  })
  socket.on('message-send', (msg) => {
    if (socket.room && msg.length > 0) {
      socket.to(socket.room).emit('message-receive', msg)
    }
  })
}

module.exports.io = initialize
