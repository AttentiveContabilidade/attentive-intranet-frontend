// src/core/services/departamentos.service.js
import { http } from './http'

export async function listarDepartamentos() {
  try {
    const { data } = await http.get('/departamentos')
    return data
  } catch (err) {
    console.error('Erro ao buscar departamentos:', err)
    throw err
  }
}
