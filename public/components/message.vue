<template>
<div class="message">
  <span class="author" :style="{ background: hashedColor }">{{ author }}</span>
  <span class="content">{{ content }}</span>
</div>
</template>

<style lang="less" scoped>
.message {
  margin-top: 1em;
  margin-bottom: 1em;

  .author {
    border-radius: 0.4em;
    padding: 0.3em;
    font-weight: 600;
  }

  .content {
    word-wrap: break-word;
    line-height: 1.4em;
  }
}
</style>

<script>
var hash = require('murmurhash-js').murmur3

var seed = 51

export default {
  props: ['author', 'content'],
  computed: {
    hashedColor: function () {
      var hue = hash(this.author, seed) % 360
      return `hsl(${hue}, 90%, 70%)`
    }
  }
}
</script>
