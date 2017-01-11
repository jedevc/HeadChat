<template>
<div class='chat'>
  <div>
    <button @click='newEvent'>new</button>
    <button @click='inviteEvent'>invite</button>
  </div>
  <message-list class='messages' :messages='messages'></message-list>
  <message-box @send='sendEvent'></entrybox>
</div>
</template>

<style lang='less' scoped>
.chat {
  display: flex;
  flex-flow: column;
  height: 100%;

  & > .messages {
    height: 100%;
    flex: 1 1 auto;
  }
}
</style>

<script>
var io = require('socket.io-client')

export default {
  data: function () {
    return {
      socket: io.connect('http://localhost:3000/client'),
      messages: []
    }
  },
  methods: {
    newEvent: function () {
      this.messages.length = 0
      this.messages.push({author: 'autobot', content: 'Waiting for new user...'})
      this.socket.emit('new', window.usernick, console.error)
    },
    inviteEvent: function () {
      this.socket.emit('invite', console.error)
    },
    sendEvent: function (msg) {
      if (msg.length > 0) {
        this.messages.push({author: window.usernick, content: msg})
        this.socket.emit('message-send', msg, console.error)
      }
    },
  },
  created: function () {
    this.messages.push({author: 'autobot', content: 'Waiting for someone...'})

    this.socket.on('connect', () => {
      this.socket.emit('new', window.usernick, console.error)
    })

    this.socket.on('message-receive', (sender, msg) => {
      this.messages.push({author: sender, content: msg})
    })

    this.socket.on('join', (nick) => {
      if (nick) {
        this.messages.push({author: 'autobot', content: `${nick} joined.`})
      } else {
        this.messages.push({author: 'autobot', content: 'You\'ve joined.'})
      }
    })

    this.socket.on('left', (nick) => {
      this.messages.push({author: 'autobot', content: `${nick} left.`})
    })

    this.socket.on('end', () => {
      this.messages.push({author: 'autobot', content: 'Everyone is gone... how about a new chat?'})
    })
  },
  components: {
    'message-list': require('./message_list.vue'),
    'message-box': require('./message_box.vue')
  }
}
</script>
