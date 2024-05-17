import store from './store'
// 两点注意：
// 1. 网络请求的代码不能放在 if 和 endif 之间，就连注释都不能乱写 if 和 endif
// 2. baseUrl 地址后面不能写 /，因为请求的时候已经写了 /
// --- 网络请求（开始） ---7
// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'
// 把导入的 $http 挂载到顶级对象 uni 上，也命名为 $http
uni.$http = $http
// 配置根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
// 请求拦截器
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '数据加载中...'
  })
}
// 响应拦截器
$http.afterRequest = function () {
  uni.hideLoading()
}
// --- 网络请求（结束） ---

// 封装弹框的方法
uni.$showMsg = function (title = '数据请求失败', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}

// #ifndef VUE3
import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
    store
})
app.$mount()
// #endif



// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App, store)
  app.use(store)
  return {
    app
  }
}
// #endif