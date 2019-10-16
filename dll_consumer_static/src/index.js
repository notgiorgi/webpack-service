import Vue from 'vue/dist/vue.runtime.esm.js'
import qs from 'query-string'

console.log(
  qs.parse('foo=bar&boo=baz'),
  qs.stringify({
    foo: 'bar',
    boo: 'baz',
  }),
)

new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
  },
  render(h) {
    console.log('my app runs')

    return h('h1', [this.message])
  },
})
