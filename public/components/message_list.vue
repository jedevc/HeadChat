<template>
<div class="messages">
  <message v-for="message in messages"
           :author="message.author"
           :content="message.content">
  </message>
</div>
</template>

<style lang="less" scoped>
.messages {
  overflow-y: scroll;
}
</style>

<script>
export default {
  props: ['messages'],
  watch: {
    'messages': function (val, oldVal) {
      this.$nextTick(function () {
        this.$el.scrollTop = this.$el.scrollHeight
      })
    }
  },
  components: {
    'message': require('./message.vue')
  }
}
</script>
