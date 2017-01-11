<template>
<form class="chat-form" @submit="send">
  <input type="text" v-model="message">
  <input type="image" src="/images/send.svg">
</form>
</template>

<style lang="less" scoped>
.chat-form {
  display: flex;
  flex-direction: row;

  border: 2px solid grey;
  padding: 2px;

  input[type="text"] {
    border: none;
    flex: 1 1 auto;
  }

  input[type="image"] {
    width: 1em;
    height: 1em;
    flex: 0 0 content;
  }
}

*:focus {
  outline: none;
}
</style>

<script>
export default {
  data: function () {
    return {
      message: ''
    }
  },
  methods: {
    send: function (event) {
      event.preventDefault()

      this.$emit('send', this.message)
      this.message = ''
    }
  }
}
</script>
