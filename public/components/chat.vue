<template>
<div class='chat'>
  <input type='text' @blur='nickChangeEvent' :value='nick'></input>
  <div>
    <button @click='newEvent'>new</button>
  </div>
  <message-list class='messages' :messages='messages'></message-list>
  <message-input class='input' @send='sendEvent'></message-input>
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
      nick: 'anon',
      socket: io.connect('http://localhost:3000/client'),
      messages: []
    }
  },
  methods: {
    newEvent: function () {
      this.messages.length = 0
      this.messages.push({author: 'autobot', content: 'Waiting for new user...'})
      this.socket.emit('new', this.nick)
    },
    sendEvent: function (msg) {
      if (msg.length > 0) {
        this.messages.push({author: this.nick, content: msg})
        this.socket.emit('message-send', msg)
      }
    },
    nickChangeEvent: function (event) {
      if (event.target.value.length == 0) {
        event.target.value = this.nick
      } else {
        this.nick = event.target.value
        this.socket.emit('nick', this.nick)
      }
    }
  },
  created: function () {
    this.messages.push({author: 'autobot', content: 'Waiting for new user...'})

    this.socket.on('connect', () => {
      this.socket.emit('new', this.nick)
    })

    this.socket.on('message-receive', (sender, msg) => {
      this.messages.push({author: sender, content: msg})
    })

    this.socket.on('join', () => {
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
