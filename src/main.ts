import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/css/style.scss'
import initSqlJs from 'sql.js'

const app = createApp(App)
app.config.globalProperties.SQL = await initSqlJs();
app.mount('#app')
