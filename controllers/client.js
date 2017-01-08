var uuid = require('uuid/v1')

var requests = new Set()

function getRequest () {
  var reqs = Array.from(requests.values())
  if (reqs.length > 0) {
    var req = reqs[Math.floor(Math.random() * reqs.length)]
    requests.delete(req)
    return req
  } else {
    return null;
  }
}

function newEvent (socket) {
  if (socket.room) {
    disconnectEvent(socket)
  }

  var req = getRequest()
  if (req) {
    socket.room = req
    socket.join(req)
    socket.emit('join')
    socket.to(socket.room).emit('join')
  } else {
    var room = uuid()
    socket.room = room
    socket.join(room)
    requests.add(room)
  }
}

function messageSendEvent (socket, msg) {
  if (socket.room && msg.length > 0) {
    socket.to(socket.room).emit('message-receive', msg)
  }
}

function disconnectEvent (socket) {
  requests.delete(socket.room)
  socket.to(socket.room).emit('left')
  socket.leave(socket.room)
  socket.room = null
}

module.exports.io = (socket) => {
  socket.on('disconnect', () => {disconnectEvent(socket)})
  socket.on('new', () => {newEvent(socket)})
  socket.on('message-send', (msg) => {messageSendEvent(socket, msg)})
}
