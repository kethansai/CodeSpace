import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createHead } from '@unhead/vue/legacy'
import { MotionPlugin } from '@vueuse/motion'

import App from './App.vue'
import router from './router'
import '@/assets/css/main.css'

const app = createApp(App)

// Pinia with persistence
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Vue Router
app.use(router)

// Unhead for SEO
const head = createHead()
app.use(head)

// Motion animations
app.use(MotionPlugin)

app.mount('#app')
