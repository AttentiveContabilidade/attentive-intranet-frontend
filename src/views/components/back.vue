<template>
  <b-navbar
    v-if="visible"
    ref="navRef"
    class="navbar-nu px-4 d-flex justify-content-between align-items-center"
  >
    <!-- Logo -->
    <b-navbar-nav>
      <b-img
        :src="logo"
        alt="Logo"
        class="logo-img"
        fluid
        @click="goTo('/main')"
      />
    </b-navbar-nav>

    <!-- Itens de navegação -->
    <b-navbar-nav class="d-flex justify-content-center flex-grow-1">
      <div
        v-for="(menu, idx) in menus"
        :key="idx"
        class="nav-tab mx-3"
        @mouseenter="open(idx)"
        @mouseleave="scheduleClose"
      >
        <button class="nav-btn">{{ menu.title }}</button>
      </div>
    </b-navbar-nav>

    <!-- Lado direito -->
    <b-navbar-nav class="ml-auto align-items-center d-flex">
      <h6 class="mb-0 mr-3 text-white">Bem-vindo Colaborador</h6>
      <b-button size="sm" variant="outline-light" class="ms-2" @click="logout">
        Logout
      </b-button>
    </b-navbar-nav>

    <!-- Mega Menu -->
    <teleport to="body">
      <div
        v-if="openIndex !== null"
        class="mega-overlay"
        :style="{ top: navHeight + 'px' }"
        @mouseenter="cancelClose"
        @mouseleave="scheduleClose"
      >
        <div class="mega-content">
          <!-- Coluna esquerda (imagem + texto) -->
          <div class="mega-left" v-if="currentMenu.type === 'mega'">
            <img
              class="mega-image"
              :src="currentMenu.image"
              :alt="currentMenu.headline"
            />
            <div class="mega-left-text">
              <h5>{{ currentMenu.headline }}</h5>
              <p class="small text-muted">{{ currentMenu.text }}</p>
              <a
                v-if="currentMenu.cta"
                href="javascript:void(0)"
                class="mega-link"
                @click="goTo(currentMenu.cta.route)"
              >
                {{ currentMenu.cta.label }} →
              </a>
            </div>
          </div>

          <!-- Colunas de links -->
          <div
            v-for="(col, cidx) in currentMenu.columns"
            :key="'col-' + cidx"
            class="mega-col"
          >
            <h6 class="mega-col-title">{{ col.title }}</h6>
            <ul class="mega-list">
              <li v-for="(item, i) in col.items" :key="'item-' + i">
                <a href="javascript:void(0)" @click="goTo(item.route)">
                  {{ item.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </teleport>
  </b-navbar>
</template>

<script>
import logo from '@/assets/logo.png'

// Carrega todas as imagens da pasta header
const headerImages = import.meta.glob('@/assets/header/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  as: 'url',
})
function headerImg(file) {
  return headerImages[`/src/assets/header/${file}`] || ''
}

export default {
  name: 'Header',
  props: { visible: { type: Boolean, default: true } },
  data() {
    return {
      logo,
      openIndex: null,
      closeTimer: null,
      navHeight: 64,
      menus: [
        {
          title: 'Áreas',
          type: 'mega',
          image: headerImg('areas.png'),
          headline: 'Áreas Attentive',
          text: 'Acesse a interface de cada departamento e suas automações específicas.',
          columns: [
            {
              title: 'Principais',
              items: [
                { label: 'Accounting', route: '/automacoes/accounting' },
                { label: 'Administrative', route: '/automacoes/administrative' },
                { label: 'BPO Finance', route: '/automacoes/bpofinance' },
                { label: 'BPO HR', route: '/automacoes/bpohr' },
                { label: 'Payroll', route: '/automacoes/payroll' },
                { label: 'Tax', route: '/departamentos/tax' },
                { label: 'Tax Advisory', route: '/automacoes/taxadvisory' },
                { label: 'Sales', route: '/automacoes/sales' },
              ],
            },
          ],
        },
        {
          title: 'RH Attentive',
          type: 'mega',
          image: headerImg('hr.png'),
          headline: 'Políticas Internas',
          text: 'Documentos, formulários e diretrizes de conduta, benefícios e reembolsos.',
          columns: [
            {
              title: 'Políticas',
              items: [
                { label: 'Benefícios', route: '/rh/beneficios' },
                { label: 'Conduta', route: '/rh/conduta' },
                { label: 'Dress Code', route: '/rh/dresscode' },
                { label: 'Reembolso', route: '/rh/reembolso' },
                { label: 'Saúde e Segurança', route: '/rh/saude' },
              ],
            },
          ],
        },
        {
          title: 'Processos Internos',
          type: 'mega',
          image: headerImg('pi.png'),
          headline: 'POP Attentive',
          text: 'Padrões e procedimentos operacionais para cada setor.',
          columns: [
            {
              title: 'Geral',
              items: [
                { label: 'POP - Accounting', route: '/processos/accounting' },
                { label: 'POP - Payroll', route: '/processos/payroll' },
              ],
            },
          ],
        },
        {
          title: 'Controles Internos',
          type: 'mega',
          image: headerImg('ci.png'),
          headline: 'Gestão de Acessos',
          text: 'Gerencie projetos, marketing, entrada e saída de clientes.',
          columns: [
            {
              title: 'Administração',
              items: [
                { label: 'Marketing', route: '/controles/marketing' },
                { label: 'Entrada de Clientes', route: '/controles/entrada' },
                { label: 'Saída de Clientes', route: '/controles/saida' },
              ],
            },
          ],
        },
        {
          title: 'Notificações',
          type: 'mega',
          image: headerImg('nt.png'),
          headline: 'Comunicados Internos',
          text: 'Atualizações e avisos importantes da empresa.',
          columns: [
            {
              title: 'Comunicados',
              items: [
                { label: 'Atualizações', route: '/comunicados' },
              ],
            },
          ],
        },
      ],
    }
  },
  computed: {
    currentMenu() {
      return this.openIndex !== null ? this.menus[this.openIndex] : {}
    },
  },
  mounted() {
    this.$nextTick(() => {
      const el = this.$refs.navRef?.$el || this.$refs.navRef
      if (el) this.navHeight = el.getBoundingClientRect().height || this.navHeight
    })
  },
  methods: {
    goTo(route) {
      this.$router.push(route)
      this.forceClose()
    },
    logout() {
      localStorage.clear()
      window.location.href = '/'
    },
    open(idx) {
      clearTimeout(this.closeTimer)
      this.openIndex = idx
      document.body.classList.add('nu-mega-open')
    },
    scheduleClose() {
      clearTimeout(this.closeTimer)
      this.closeTimer = setTimeout(this.forceClose, 150)
    },
    cancelClose() {
      clearTimeout(this.closeTimer)
    },
    forceClose() {
      this.openIndex = null
      document.body.classList.remove('nu-mega-open')
    },
  },
}
</script>

<style scoped>
.navbar-nu {
  background: linear-gradient(90deg, #1a1f46 0%, #18293a 100%);
  color: #fff;
  min-height: 64px;
  z-index: 1100;
}
.nav-btn {
  background: transparent;
  border: 0;
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  padding: 6px 2px;
  cursor: pointer;
}
.nav-btn:hover {
  color: #f5f5f5;
  text-decoration: underline;
}
.logo-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  cursor: pointer;
  border-radius: 12px;
}
</style>

<style>
.mega-overlay {
  position: fixed;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1050;
  background: transparent;
}

.mega-content {
  margin: 0 auto;
  width: clamp(1000px, 92vw, 1280px);
  padding: 56px clamp(40px, 4vw, 80px);
  min-height: 340px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 100px;
  animation: megaIn 0.18s ease;
}
.mega-left {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.mega-image {
  width: 100%;
  height: 450px;
  object-fit: cover;
  border-radius: 12px;
}
.mega-left-text h5 {
  font-weight: 800;
  color: #111;
  margin-bottom: 8px;
}
.mega-left-text p {
  color: #555;
  margin-bottom: 8px;
}
.mega-link {
  color: #4b3fff;
  font-weight: 600;
  text-decoration: none;
}
.mega-link:hover {
  text-decoration: underline;
}
.mega-col-title {
  font-weight: 800;
  color: #0a178d;
  margin-bottom: 20px;
}
.mega-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.mega-list li {
  margin-bottom: 14px;
}
.mega-list a {
  color: #333;
  text-decoration: none;
  transition: color 0.2s;
}
.mega-list a:hover {
  color: #4b3fff;
}
body.nu-mega-open {
  overflow-x: hidden !important;
}
@keyframes megaIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (max-width: 1100px) {
  .mega-content {
    grid-template-columns: 1.5fr 1fr;
  }
}
@media (max-width: 900px) {
  .mega-content {
    grid-template-columns: 1fr;
    width: 94vw;
    min-width: 0;
  }
}
</style>
