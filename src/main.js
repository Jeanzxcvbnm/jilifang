import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import router from './router'
import './filters'
import '@/assets/css/icon.css'
import directives from './components/js/directives'

import 'element-ui/lib/theme-chalk/index.css';
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.use(ElementUI,directives);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
