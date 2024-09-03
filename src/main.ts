import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ToastService from 'primevue/toastservice'

import App from './App.vue'
import router from './router'
import '../src/assets/all.scss'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(ToastService)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: 'drak-mode'
    }
  }
})
app.use(router)

app.mount('#app')
