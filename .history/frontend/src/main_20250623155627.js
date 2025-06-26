import './assets/main.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { useAuthStore } from './stores/auth'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
        },
      },
    },
  },
})

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// Axios Interceptor
// Bu kod parçası, her bir axios isteğinden önce araya girer.
// Auth store'dan token'ı alır ve isteğin 'Authorization' başlığına ekler.
// Böylece backend, isteği yapan kullanıcının kimliğini doğrulayabilir.
axios.interceptors.request.use(config => {
  const authStore = useAuthStore()
  const token = authStore.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

app.use(router)
app.use(vuetify)
app.use(createHead())
app.mount('#app')
