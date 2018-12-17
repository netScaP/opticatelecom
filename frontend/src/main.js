import Vue from 'vue';
import NProgress from 'nprogress';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';

import '../node_modules/nprogress/nprogress.css';

NProgress.configure({
  minimum: 0.1,
  parent: '#app',
  easing: 'linear',
  speed: 500,
  template:
  `
    <div class="bar" role="bar" ref="loadingBar">
      <div class="peg"></div>
    </div>
    <div class="spinner" role="spinner" ref="loadingSpinner">
      <div class="spinner-icon"></div>
    </div>
  `,
});

axios.interceptors.request.use((config) => {
  NProgress.start();
  return config;
}, error => Promise.reject(error));

axios.interceptors.response.use((response) => {
  NProgress.done();
  return response;
}, (error) => {
  NProgress.done();
  return Promise.reject(error);
});

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start();
  }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

Vue.prototype.$http = axios;
const token = localStorage.getItem('token');
if (token) {
  Vue.prototype.$http.defaults.headers.common.Authorization = token;
}

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
