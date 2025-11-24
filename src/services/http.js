// src/services/http.js
import axios from 'axios'

// ⚙️ Base e prefixo configuráveis
const BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'
const PREFIX = import.meta.env.VITE_API_PREFIX || '/api/v1'

// Cria instância Axios global
const http = axios.create({
  baseURL: `${BASE}${PREFIX}`, // Exemplo: http://127.0.0.1:8000/api/v1
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ Intercepta respostas (padroniza erros)
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      console.error(
        `[HTTP ${err.response.status}]`,
        err.response.data?.detail || err.message
      )
    } else {
      console.error('[HTTP] Erro de conexão ou timeout:', err.message)
    }
    return Promise.reject(err)
  }
)

export default http
