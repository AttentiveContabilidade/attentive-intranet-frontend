// src/core/services/auth.service.js
import { reactive } from "vue";
import api, {
  setAccessToken,
  getAccessToken,
  setUnauthorizedHandler,
} from "./api.service";

const API_PREFIX = "/api/v1";
const USER_KEY = "att:user";

export const authState = reactive({
  user: null,
  ready: false,
});

// -------------------------
// Persistência
// -------------------------
function storeUser(user) {
  authState.user = user || null;
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch {
    // ignora problemas de storage (modo privado, etc.)
  }
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

// Se der 401 em qualquer requisição (ex: refresh falhar) → limpa tudo
setUnauthorizedHandler(() => {
  setAccessToken(null);
  storeUser(null);
});

// -------------------------
// LOGIN
// -------------------------
export async function login({ email, senha }) {
  const { data } = await api.post(`${API_PREFIX}/auth/login`, { email, senha });

  if (data?.access_token) {
    setAccessToken(data.access_token);
  }

  // salva o usuário no estado E no localStorage
  storeUser(data?.usuario || null);

  return data;
}

// -------------------------
// REFRESH (usa major_token via cookie HttpOnly)
// -------------------------
export async function refresh() {
  const { data } = await api.post(`${API_PREFIX}/auth/refresh`);

  if (data?.access_token) {
    setAccessToken(data.access_token);
  }

  // se o backend devolver o usuário junto, já atualiza aqui
  if (data?.usuario) {
    storeUser(data.usuario);
  } else {
    // fallback: se não vier o usuário, mantém o que já temos (estado / localStorage)
    const stored = getStoredUser();
    if (stored && !authState.user) {
      authState.user = stored;
    }
  }

  return data;
}

// -------------------------
// ME
// -------------------------
export async function me() {
  const { data } = await api.get(`${API_PREFIX}/auth/me`);

  // dependendo de como o backend responde, pode ser data.usuario ou data direto
  const user = data?.usuario ?? data ?? null;
  storeUser(user);

  return data;
}

// -------------------------
// LOGOUT
// -------------------------
export async function logout() {
  try {
    await api.post(`${API_PREFIX}/auth/logout`);
  } catch {
    // mesmo que falhe, vamos limpar localmente
  }

  setAccessToken(null);
  storeUser(null);
}

// -------------------------
// INIT SESSION
// -------------------------
export async function initSession() {
  try {
    // 1) Se não tem accessToken em memória (reload de página) → tenta refresh (usa major_token do cookie)
    if (!getAccessToken()) {
      await refresh();
    }

    // 2) Se ainda não temos user em memória, tenta pegar do localStorage
    if (!authState.user) {
      const stored = getStoredUser();
      if (stored) {
        authState.user = stored;
      } else if (getAccessToken()) {
        // 3) Se temos token mas não temos user nem no storage → chama /me
        await me();
      }
    }
  } catch {
    // qualquer erro → considera não autenticado
    setAccessToken(null);
    storeUser(null);
  } finally {
    authState.ready = true;
  }
}
