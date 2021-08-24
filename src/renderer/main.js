import Vue from 'vue'
// import axios from './utils/http'
import ElementUI from 'element-ui';
// import './assets/styles/theme.scss';
import './assets/styles/theme/index.css';
Vue.use(ElementUI);
import App from './App'
import router from './router'
import store from './store'
import filters from './filters'
import Print from 'vue-print-nb'

Vue.use(Print)
// const { cv } = require('opencv-wasm')

// const { cv,cvTranslateError } = import('opencv-wasm');

// import {cv} from 'opencv-wasm'
// import THRESH_BINARY from 'opencv-wasm/opencv.js';
// import Mat from 'opencv-wasm/opencv.js';
// import { THRESH_OTSU, THRESH_TRIANGLE, CONTOURS_MATCH_I1 } from 'opencv-wasm/opencv.js';
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
});

//if (!process.env.IS_WEB)
Vue.use(require('vue-electron'))
// Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// 定义全局点击函数
// Vue.prototype.globalClick = function (callback) {
//     document.getElementById('main').onclick = function () {
//         callback();
//     };
// };
// 定义全局点击函数
// Vue.prototype.playlistClick = function (callback) {
//     document.getElementById('playlist').onclick = function () {
//         callback();
//     };
// };

Vue.prototype.$bus = new Vue()
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app');
