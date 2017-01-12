var Vue = require('vue')

var $ = require('jquery')

$(document).ready(() => {
  new Vue({
    el: '#app',
    render: function (createElement) {
      return createElement(require('../components/chat.vue'))
    }
  })
})
