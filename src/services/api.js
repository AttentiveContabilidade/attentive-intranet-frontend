// src/services/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000",
  withCredentials: true, // permite envio de cookie HttpOnly (major token)
});

// -------------------------------------------
// INTERCEPTOR DE REQUEST: envia Bearer token
// -------------------------------------------
api.interceptors.request.use((config) => {
  // A MESMA chave salvada no login
  const token = localStorage.getItem("attentive_access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// -------------------------------------------
// INTERCEPTOR DE RESPOSTA (opcional)
// Se o token expirou (401), tenta pegar novo access pelo major cookie
// -------------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Se deu 401 no access token → tenta refresh automático
    if (
      error.response &&
      error.response.status === 401 &&
      !original.__retry
    ) {
      original.__retry = true;

      try {
        // Tenta emitir novo access token usando o major token (cookie HttpOnly)
        const { data } = await api.post("/api/v1/auth/refresh");

        // Salva o novo access token
        localStorage.setItem("attentive_access_token", data.access_token);

        // Reenvia a requisição original
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return api(original);
      } catch (err) {
        console.warn("Refresh falhou, redirecionando para login.");
        localStorage.removeItem("attentive_access_token");
        window.location = "/login";
      }
    }

    return Promise.reject(error);
  }
);
