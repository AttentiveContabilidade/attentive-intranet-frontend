// src/core/services/endpoints.js
export default {
  // ======================
  // 🔐 Autenticação
  // ======================
  login: '/api/v1/auth/login',         // POST  -> autentica e retorna Bearer
  me: '/api/v1/auth/me',               // GET   -> valida token e retorna usuário logado
  refresh: '/api/v1/auth/refresh',     // POST  -> renova o token (minor->major)
  logout: '/api/v1/auth/logout',       // POST  -> revoga o token atual

  // ======================
  // 👥 Usuários
  // ======================
  listUsers: '/api/v1/usuarios',                 // GET    -> lista (aceita ?page=1, filtros via params)
  getUser:   (id) => `/api/v1/usuarios/${id}`,   // GET    -> busca um usuário específico
  createUser: '/api/v1/usuarios',                // POST   -> cria novo usuário
  updateUser: (id) => `/api/v1/usuarios/${id}`,  // PUT    -> atualiza um usuário
  deleteUser: (id) => `/api/v1/usuarios/${id}`,  // DELETE -> exclui um usuário

  // ======================
  // 🧑‍💼 Colaboradores (perfil público)
  // ======================
  listColabs: '/api/v1/colaboradores',                     // GET  -> lista pública (busca + filtros)
  getColab:  (id) => `/api/v1/colaboradores/${id}`,        // GET  -> perfil público de um colaborador

  // ======================
  // 🧾 Cursos / Perfil pessoal
  // ======================
  perfilMe: '/api/v1/perfil/me',                           // GET  -> perfil do usuário logado
  perfilUpdate: '/api/v1/perfil/update',                   // POST -> atualiza descrição
  perfilCursos: '/api/v1/perfil/update_cursos',            // POST -> salva progresso de cursos
};
