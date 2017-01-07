<template>
<form class="chat-form" @submit="send">
  <input type="text" v-model="input">
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
      input: ''
    }
  },
  methods: {
    send: function (event) {
      event.preventDefault()

      this.$emit('send', this.input)
      this.input = ''
    }
  }
}
</script>
