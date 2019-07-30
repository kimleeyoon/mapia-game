import Vue from 'vue'
// import VueSocketIO from 'vue-socket.io'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
