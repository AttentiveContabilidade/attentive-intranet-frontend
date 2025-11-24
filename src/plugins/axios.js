// Mock API client to run the frontend without any backend.
// All methods return resolved promises with empty or sample data.
const api = {
  get: (url, cfg) => Promise.resolve({ data: [] }),
  post: (url, body, cfg) => Promise.resolve({ data: { ok: true, token: 'demo-token', user: { name: 'Demo User' } } }),
  put: (url, body, cfg) => Promise.resolve({ data: { ok: true } }),
  patch: (url, body, cfg) => Promise.resolve({ data: { ok: true } }),
  delete: (url, cfg) => Promise.resolve({ data: { ok: true } }),
  defaults: { headers: { common: {} } },
  interceptors: { request: { use: () => {} }, response: { use: () => {} } },
}
export function getAuthToken(){ return 'demo-token' }
export function setAuthToken(t){ /* noop */ }
export default api