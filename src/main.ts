import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/css/style.scss'
import initSqlJs from 'sql.js'

const app = createApp(App)
app.config.globalProperties.SQL = await initSqlJs({
  // locateFile: file => `https://sql.js.org/dist/${file}`
  locateFile: file => `./${file}`
});
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})

