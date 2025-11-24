// src/core/services/api.service.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000",
  withCredentials: true,
});

const API_PREFIX = "/api/v1";   // <<< garante que sempre chamaremos o prefixo

let accessToken = null;
let isRefreshing = false;
let pendingQueue = [];
let onUnauthorized = null;

export function setAccessToken(token) { accessToken = token || null; }
export function getAccessToken() { return accessToken; }
export function setUnauthorizedHandler(fn) { onUnauthorized = typeof fn === "function" ? fn : null; }

function processQueue(error, token = null) {
  pendingQueue.forEach(({ resolve, reject }) => { error ? reject(error) : resolve(token); });
  pendingQueue = [];
}

// ---------- Request interceptor ----------
api.interceptors.request.use((config) => {
  // Prefixa /api/v1 quando a URL NÃO é absoluta e ainda não começa com /api/v1
  const url = config.url || "";
  const isAbsolute = /^https?:\/\//i.test(url);
  const hasPrefix = url.startsWith(API_PREFIX);

  if (!isAbsolute && !hasPrefix) {
    const sep = url.startsWith("/") ? "" : "/";
    config.url = `${API_PREFIX}${sep}${url}`;
  }

  if (accessToken) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

// ---------- Response interceptor ----------
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error?.config || {};
    const status = error?.response?.status;

    if (status === 401 && !original._retry) {
      const isRefreshCall = String(original?.url || "").includes("/auth/refresh");
      if (isRefreshCall) {
        setAccessToken(null);
        if (onUnauthorized) onUnauthorized(error);
        throw error;
      }

      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => pendingQueue.push({ resolve, reject }))
          .then((token) => {
            original.headers = original.headers || {};
            original.headers["Authorization"] = `Bearer ${token}`;
            return api(original);
          })
          .catch(Promise.reject);
      }

      isRefreshing = true;
      try {
        const { data } = await api.post("auth/refresh"); // será prefixado para /api/v1/auth/refresh
        setAccessToken(data.access_token);
        processQueue(null, data.access_token);

        original.headers = original.headers || {};
        original.headers["Authorization"] = `Bearer ${data.access_token}`;
        return api(original);
      } catch (e) {
        processQueue(e, null);
        setAccessToken(null);
        if (onUnauthorized) onUnauthorized(e);
        throw e;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  }
);

export default api;
