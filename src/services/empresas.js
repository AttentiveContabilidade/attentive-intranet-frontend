// src/services/empresas.js
import http from './http'

export async function getEmpresas(params = {}) {
  const { data } = await http.get('/api/v1/empresas', { params })
  return data
}
