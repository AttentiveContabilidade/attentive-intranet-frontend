// src/core/services/auth.service.js
import { reactive } from "vue"
import api, {
  setAccessToken,
  getAccessToken,
  setUnauthorizedHandler,
} from "./api.service"

const USER_KEY = "att:user"

export const authState = reactive({
  user: null,
  ready: false,
})

// -------------------------
// Persistência
// -------------------------
function storeUser(user) {
  authState.user = user || null
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  } catch {}
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null")
  } catch {
    return null
  }
}

// Se refresh falhar → remove user
setUnauthorizedHandler(() => {
  storeUser(null)
})

// -------------------------
// LOGIN
// -------------------------
export async function login({ email, senha }) {
  const { data } = await api.post("/api/v1/auth/login", { email, senha })

  setAccessToken(data.access_token)

  // salva o usuário no estado E no localStorage
  storeUser(data.usuario || null)

  return data
}

// -------------------------
// REFRESH
// -------------------------
export async function refresh() {
  const { data } = await api.post("/api/v1/auth/refresh")
  setAccessToken(data.access_token)

  try {
    const meRes = await api.get("/api/v1/auth/me")
    storeUser(meRes.data.usuario || authState.user)
  } catch {}

  return data
}

// -------------------------
// ME
// -------------------------
export async function me() {
  const { data } = await api.get("/api/v1/auth/me")
  storeUser(data.usuario || null)
  return data
}

// -------------------------
// LOGOUT
// -------------------------
export async function logout() {
  try {
    await api.post("/api/v1/auth/logout")
  } catch {}

  setAccessToken(null)
  storeUser(null)
}

// -------------------------
// INIT SESSION
// -------------------------
export async function initSession() {
  try {
    if (!getAccessToken()) {
      await refresh()
    }

    if (!authState.user) {
      // tenta pegar do localStorage
      const stored = getStoredUser()
      if (stored) {
        authState.user = stored
      } else {
        // se não tem, chama /me
        await me()
      }
    }
  } catch {
    // usuário não autenticado
  } finally {
    authState.ready = true
  }
}
