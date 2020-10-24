import Vue from 'vue'
import App from './App'
import store from './store'
import uView from "@/components/uview-ui";
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
import {
	http
} from "./util/js/common.js"
Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)

Vue.use(uView);

Vue.prototype.http = http;
Vue.prototype.$store = store;
App.mpType = 'app'
Vue.config.productionTip = false
const app = new Vue({
	store,
	...App
})
app.$mount()
