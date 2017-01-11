var uuid = require('uuid/v1')

var requests = new Set()
var rooms = {}

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

function newEvent (socket, nick, err) {
  if (socket.room) {
    disconnectEvent(socket)
  }

  if (nick && nick.length > 0) {
    socket.nick = nick
  } else {
    if (err) err('Invalid nick.')
    return
  }

  var req = getRequest()
  if (req) {
    socket.room = req
    socket.join(req)

    rooms[socket.room] += 1

    socket.emit('join')
    socket.to(socket.room).emit('join', socket.nick)
  } else {
    var room = uuid()
    socket.room = room
    socket.join(room)

    rooms[room] = 1

    requests.add(room)
  }
}

function inviteEvent (socket, err) {
  if (!socket.room) {
    if (err) err('Not connected to chat.')
  } else if (requests.has(socket.room)) {
    if (err) err('Already waiting on request.')
  } else {
    requests.add(socket.room)
  }
}

function messageSendEvent (socket, msg, err) {
  if (!socket.room) {
    if (err) err('Not connected to chat.')
  } else if (msg && msg.length == 0) {
    if (err) err('Invalid message.')
  } else {
    socket.to(socket.room).emit('message-receive', socket.nick, msg)
  }
}

function disconnectEvent (socket) {
  socket.to(socket.room).emit('left', socket.nick)

  rooms[socket.room] -= 1
  if (rooms[socket.room] <= 1) {
    delete rooms[socket.room]
    requests.delete(socket.room)
    socket.to(socket.room).emit('end')
  }

  socket.leave(socket.room)
  socket.room = null
}

module.exports.io = (socket) => {
  socket.on('disconnect', (...args) => {disconnectEvent(socket, ...args)})
  socket.on('new', (...args) => {newEvent(socket, ...args)})
  socket.on('invite', (...args) => {inviteEvent(socket, ...args)})
  socket.on('message-send', (...args) => {messageSendEvent(socket, ...args)})
}
