// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import Vuex from 'vuex'
import {
  currency
} from './util/currency';
Vue.config.productionTip = false;


Vue.use(VueLazyLoad, {
  loading: "/static/loading-svg/loading-bars.svg"
});
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    nickName: '',
    count: 0
  },
  mutations: {
    updateUserInfo(state, nickName) {
      state.nickName = nickName
    },
    updateCatrCount(state, CartCount) {
      state.count += CartCount
    },
    initCartCount(state, CartCount) {
      state.count = CartCount;
    }
  }
});

Vue.filter("currency", currency);
Vue.use(infiniteScroll);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
