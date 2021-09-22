import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/css/style.scss'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh () {},
  onOfflineReady () {}
})

updateSW()

createApp(App).mount('#app')
