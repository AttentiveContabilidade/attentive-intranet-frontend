# Attentive Intranet – Frontend

Frontend da Intranet da **Attentive Contabilidade**, utilizada pelos colaboradores para:

- Acessar comunicados e notificações internas  
- Visualizar ferramentas e automações por departamento (Fiscal, Contábil, Pessoal, Administrativo, etc.)  
- Interagir com a área de IA de apoio aos times  
- Gerenciar perfil e visualizar informações de colaboradores

Este repositório contém apenas o **frontend** (SPA em Vue 3 + Vite).  
A API utilizada fica no projeto **attentive-intranet-api** (FastAPI).

---

## Stack principal

- [Vue 3](https://vuejs.org/)  
- [Vite](https://vite.dev/)  
- [Vue Router](https://router.vuejs.org/)  
- [BootstrapVue 3](https://github.com/cdmoro/bootstrap-vue-3)  
- [Axios](https://axios-http.com/)

---

## Pré-requisitos

- **Node.js** >= 18.x  
- **npm** >= 9.x (ou `pnpm`/`yarn`, se preferir adaptar os comandos)

---

## Variáveis de ambiente

O frontend utiliza um arquivo `.env` na raiz do projeto.

Exemplo mínimo:

```bash
# URL base da API (FastAPI)
VITE_API_BASE="http://127.0.0.1:8000/api/v1"

# Opcional: nome da aplicação exibido em alguns componentes
VITE_APP_NAME="Attentive Intranet"
