// @ts-expect-error no types
import Proxy from 'es6-proxy-polyfill'
if (!window.Proxy) window.Proxy = Proxy

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap'
import './assets/main.scss'

const app = createApp(App)

app.use(router)

app.mount('#app')
