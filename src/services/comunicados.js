// src/services/comunicados.js
import { api } from "./api";

export async function listarComunicados(params = {}) {
  const { data } = await api.get("/api/v1/comunicados", { params });
  return data;
}
