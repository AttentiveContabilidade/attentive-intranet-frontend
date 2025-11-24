import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue3 from 'bootstrap-vue-3'
import axios from 'axios'

// Estilos do Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

// ⚙️ Script JS do Bootstrap (necessário para animações do carousel)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// ✏️ Editor rico (Quill)
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const app = createApp(App)

app.use(router)
app.use(BootstrapVue3)
app.config.globalProperties.$axios = axios

// Registro global do editor
app.component('QuillEditor', QuillEditor)

app.mount('#app')
