import { createRouter, createWebHistory } from 'vue-router'

// Auth (estado + bootstrap de sessão)
import {
  initSession,
  authState,
  me as fetchMe, // vamos usar pra garantir que roles venham do backend
} from '../core/services/auth.service'

// Importar as views principais
import MainPage from '../views/main.vue'
import Login from '../views/Login/Login.vue'
import Comunicados from '../views/comunicados.vue'
import Perfil from '../views/perfil.vue'

// Views Automações
// 👇 Agora a rota /automacoes/tax usa o arquivo Prevtax.vue
import Tax from '../views/automacao/Prevtax.vue'
import Accounting from '../views/automacao/accounting.vue'
import Payroll from '../views/automacao/payroll.vue'
import Administrative from '../views/automacao/administrative.vue'
import HR from '../views/automacao/hr.vue'
import Finance from '../views/automacao/finance.vue'

// Views Inteligência Artificial
import IATax from '../views/ia/tax.vue'
import IAAccounting from '../views/ia/accounting.vue'
import IAPayroll from '../views/ia/payroll.vue'
import IAAdministrative from '../views/ia/administrative.vue'
import IAHR from '../views/ia/hr.vue'
import IAFinance from '../views/ia/finance.vue'

// ✅ RH
import DressCode from '../views/rh/dresscode.vue'

// ✅ Usuários (novo cadastro)
import UsuarioNovo from '../views/usuarios/cadastrar.vue'

// ✅ Colaboradores (NOVAS VIEWS)
import Colaboradores from '../views/colaboradores.vue'
import ColaboradorPerfil from '../views/colaboradores/perfil.vue'

// ---- Rotas ----
const routes = [
  // Públicas
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { public: true, hideNavbar: true },
  },

  // Privadas (require auth)
  {
    path: '/',
    name: 'MainPage',
    component: MainPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/main',
    name: 'Main',
    component: MainPage,
    meta: { requiresAuth: true },
  },

  // ✅ Comunicados / Notificações
  {
    path: '/comunicados',
    name: 'Comunicados',
    component: Comunicados,
    meta: { requiresAuth: true },
  },
  {
    path: '/notificacoes',
    redirect: { name: 'Comunicados' },
  },

  // ✅ Perfil do colaborador logado
  {
    path: '/perfil',
    name: 'Perfil',
    component: Perfil,
    meta: { requiresAuth: true },
  },

  // ✅ Página com todos os colaboradores
  {
    path: '/colaboradores',
    name: 'Colaboradores',
    component: Colaboradores,
    meta: { requiresAuth: true },
  },

  // ✅ Perfil público interno de um colaborador
  {
    path: '/colaboradores/:id',
    name: 'ColaboradorPerfil',
    component: ColaboradorPerfil,
    props: true,
    meta: { requiresAuth: true },
  },

  // ✅ RH - Dress Code
  {
    path: '/rh/dresscode',
    name: 'DressCode',
    component: DressCode,
    meta: { requiresAuth: true },
  },

  // ✅ Cadastro de Usuário (somente admin)
  {
    path: '/usuarios/novo',
    name: 'UsuarioNovo',
    component: UsuarioNovo,
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  // Automações
  {
    path: '/automacoes/tax',
    name: 'Tax',
    component: Tax, // Prevtax.vue
    meta: { requiresAuth: true },
  },
  {
    path: '/automacoes/accounting',
    name: 'Accounting',
    component: Accounting,
    meta: { requiresAuth: true },
  },
  {
    path: '/automacoes/payroll',
    name: 'Payroll',
    component: Payroll,
    meta: { requiresAuth: true },
  },
  {
    path: '/automacoes/administrative',
    name: 'Administrative',
    component: Administrative,
    meta: { requiresAuth: true },
  },
  {
    path: '/automacoes/hr',
    name: 'HR',
    component: HR,
    meta: { requiresAuth: true },
  },
  {
    path: '/automacoes/finance',
    name: 'Finance',
    component: Finance,
    meta: { requiresAuth: true },
  },

  // IA
  {
    path: '/ia/tax',
    name: 'IATax',
    component: IATax,
    meta: { requiresAuth: true },
  },
  {
    path: '/ia/accounting',
    name: 'IAAccounting',
    component: IAAccounting,
    meta: { requiresAuth: true },
  },
  {
    path: '/ia/payroll',
    name: 'IAPayroll',
    component: IAPayroll,
    meta: { requiresAuth: true },
  },
  {
    path: '/ia/administrative',
    name: 'IAAdministrative',
    component: IAAdministrative,
    meta: { requiresAuth: true },
  },
  {
    path: '/ia/hr',
    name: 'IAHR',
    component: IAHR,
    meta: { requiresAuth: true },
  },
  {
    path: '/ia/finance',
    name: 'IAFinance',
    component: IAFinance,
    meta: { requiresAuth: true },
  },

  // Dashboards
  {
    path: '/dashboards/tax',
    name: 'DashboardTax',
    component: () => import('../views/dashboards/tax.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboards/accounting',
    name: 'DashboardAccounting',
    component: () => import('../views/dashboards/accounting.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboards/payroll',
    name: 'DashboardPayroll',
    component: () => import('../views/dashboards/payroll.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboards/administrative',
    name: 'DashboardAdministrative',
    component: () => import('../views/dashboards/administrative.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboards/hr',
    name: 'DashboardHR',
    component: () => import('../views/dashboards/hr.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboards/finance',
    name: 'DashboardFinance',
    component: () => import('../views/dashboards/finance.vue'),
    meta: { requiresAuth: true },
  },

  // Departamentos (English naming)
  {
    path: '/departamentos/tax',
    name: 'DepartmentTax',
    component: () => import('../views/departamentos/tax.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/departamentos/accounting',
    name: 'DepartmentAccounting',
    component: () => import('../views/departamentos/accounting.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/departamentos/payroll',
    name: 'DepartmentPayroll',
    component: () => import('../views/departamentos/payroll.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/departamentos/administrative',
    name: 'DepartmentAdministrative',
    component: () => import('../views/departamentos/administrative.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/departamentos/hr',
    name: 'DepartmentHR',
    component: () => import('../views/departamentos/hr.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/departamentos/finance',
    name: 'DepartmentFinance',
    component: () => import('../views/departamentos/finance.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/departamentos/marketing',
    name: 'DepartmentMarketing',
    component: () => import('../views/departamentos/marketing.vue'),
    meta: { requiresAuth: true },
  },

  // Atalhos (redirects opcionais)
  { path: '/fiscal', redirect: { name: 'DepartmentTax' } },
  { path: '/contabil', redirect: { name: 'DepartmentAccounting' } },
  { path: '/pessoal', redirect: { name: 'DepartmentPayroll' } },
  { path: '/administrativo', redirect: { name: 'DepartmentAdministrative' } },
  { path: '/rh', redirect: { name: 'DepartmentHR' } },
  { path: '/financeiro', redirect: { name: 'DepartmentFinance' } },
  { path: '/marketing', redirect: { name: 'DepartmentMarketing' } },

  // Fallback
  {
    path: '/:pathMatch(.*)*',
    redirect: '/main',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// --------------------------------------------------
// 🧭 Controle de autenticação global
// --------------------------------------------------
let bootstrapped = false

router.beforeEach(async (to, _from, next) => {
  // 1) Garante que a sessão foi inicializada UMA vez
  if (!bootstrapped) {
    bootstrapped = true
    if (!authState.ready) {
      try {
        await initSession()
      } catch {
        /* sessão não autenticada */
      }
    }
  }

  const isPublic = !!to.meta?.public
  const isAuthed = !!authState.user

  // 2) Bloqueia rotas privadas sem login
  if (to.meta?.requiresAuth && !isAuthed) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  // 3) Verifica se a rota exige privilégio de admin
  if (to.meta?.requiresAdmin) {
    // se chegou aqui, teoricamente já está autenticado
    if (!authState.user) {
      // fallback hard: se por algum motivo não tiver user, volta pro login
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    }

    let roles = authState.user.roles

    // Se não tiver roles carregado ainda, tenta buscar via /auth/me
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      try {
        const meData = await fetchMe()
        const user = meData?.usuario ?? meData ?? null
        roles = user?.roles || []
      } catch {
        roles = []
      }
    }

    const isAdmin = Array.isArray(roles) && roles.includes('administrador')

    if (!isAdmin) {
      // logado mas não admin → manda pro main
      return next({ name: 'Main' })
    }
  }

  // 4) Evita ir ao login se já autenticado
  if (isPublic && isAuthed && to.name === 'Login') {
    return next({ name: 'Main' })
  }

  return next()
})

export default router
