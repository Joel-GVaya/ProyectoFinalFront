import "bootstrap/dist/css/bootstrap.css"; 
import "bootstrap/dist/js/bootstrap.bundle.min.js"

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/router.js' // Ensure this path is correct
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
