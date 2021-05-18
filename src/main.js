import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '../src/assets/css/style.scss'
import './registerServiceWorker'

createApp(App).use(router).mount('#app')
