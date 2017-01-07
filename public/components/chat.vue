<template>
<div class="chat">
  <button @click="newChat">new</button>
  <message-list class="messages" :messages="messages"></message-list>
  <message-input class="input" @send="send"></message-input>
</div>
</template>

<style lang="less" scoped>
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
    newChat: function() {
      this.messages.length = 0
      this.messages.push({author: 'autobot', content: "Waiting for new user..."})
      this.socket.emit('new')
    },
    send: function (msg) {
      if (msg.length > 0) {
        this.messages.push({author: 'me', content: msg})
        this.socket.emit('message-send', msg)
      }
    }
  },
  created: function () {
    this.messages.push({author: 'autobot', content: "Waiting for new user..."})

    this.socket.on('connect', () => {
      this.socket.emit('new')
    })

    this.socket.on('message-receive', (msg) => {
      this.messages.push({author: 'other', content: msg})
    })

    this.socket.on('ready', () => {
      this.messages.push({author: 'autobot', content: 'You are connected.'})
    })

    this.socket.on('left', () => {
      this.messages.push({author: 'autobot', content: 'You are now disconnected.'})
    })
  },
  components: {
    'message-list': require('./message_list.vue'),
    'message-input': require('./entrybox.vue')
  }
}
</script>
