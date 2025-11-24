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
        @click="goTo({ name: 'Main' })"
      />
    </b-navbar-nav>

    <!-- Itens de navegação -->
    <b-navbar-nav class="d-flex justify-content-center flex-grow-1">
      <div
        v-for="(menu, idx) in menus"
        :key="idx"
        class="nav-tab mx-3"
        @mouseenter="onNavEnter(idx)"
        @mouseleave="onNavLeave"
        @focusin="onNavEnter(idx)"
        @focusout="onNavLeave"
      >
        <button class="nav-btn">{{ menu.title }}</button>
      </div>
    </b-navbar-nav>

    <!-- Lado direito (avatar + dropdown custom) -->
    <b-navbar-nav class="ml-auto align-items-center d-flex gap-3 me-3">
      <div
        ref="profileRef"
        class="d-flex align-items-center profile-summary cursor-pointer"
        @click="toggleProfile"
      >
        <img
          :src="avatarSrc"
          alt="avatar"
          class="rounded-circle me-2 profile-avatar"
        />
        <div class="d-flex flex-column lh-1 text-white text-start">
          <span class="fw-semibold small">
            {{ displayName }}
          </span>
          <span class="text-muted extra-small depto-line">
            {{ deptoLabel }}
          </span>
        </div>
      </div>
    </b-navbar-nav>

    <!-- Overlay (Mega + Perfil) -->
    <teleport to="body">
      <div
        v-if="openIndex !== null"
        class="mega-overlay"
        :style="{ top: navHeight + 'px' }"
        @mouseenter="onOverlayEnter"
        @mouseleave="onOverlayLeave"
      >
        <!-- Mega menu -->
        <div
          v-if="openIndex !== 'profile' && currentMenu"
          class="mega-content"
        >
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

        <!-- Dropdown do perfil -->
        <div
          v-else-if="openIndex === 'profile'"
          class="profile-popover shadow"
          :style="profileStyle"
          @click.stop
        >
          <ul class="list-unstyled mb-0">
            <li>
              <a href="javascript:void(0)" @click="goTo({ name: 'Perfil' })">Meu Perfil</a>
            </li>
            <li>
              <a href="javascript:void(0)" @click="goTo({ name: 'Colaboradores' })">Colaboradores</a>
            </li>
            <li class="divider"></li>
            <li><a href="javascript:void(0)" @click="logout">Sair</a></li>
          </ul>
        </div>
      </div>
    </teleport>
  </b-navbar>
</template>

<script>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import logo from '@/assets/logo.png'
import { authState } from '@/core/services/auth.service'

const headerImages = import.meta.glob('@/assets/header/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  as: 'url',
})
function headerImg(file) {
  return headerImages[`/src/assets/header/${file}`] || ''
}

// Mapeamento dos departamentos
const DEPT_LABELS = {
  tax: 'Time Tax',
  accounting: 'Time Accounting',
  payroll: 'Time Payroll',
  finance: 'Time Finance',
  hr: 'Time HR',
  administrative: 'Time Administrative',
  automation: 'Time Automation',
  controllership: 'Time Controllership',
  controllers: 'Time Controllership',
}

function normalizeDept(value) {
  if (!value) return '—'
  if (typeof value === 'string') {
    const key = value.trim().toLowerCase()
    return DEPT_LABELS[key] || value.toUpperCase()
  }
  if (Array.isArray(value)) return value.map(normalizeDept).join(' / ')
  if (typeof value === 'object') {
    const slug = value.slug || value.nome || value.name || ''
    const label = value.label || slug
    return normalizeDept(label)
  }
  return '—'
}

export default {
  name: 'Header',
  props: { visible: { type: Boolean, default: true } },
  setup() {
    const router = useRouter()
    const user = computed(() => authState.user || {})

    const avatarSrc = computed(() =>
      user.value?.avatar_url || '/favicon.ico'
    )

    const displayName = computed(() => {
      const n = user.value?.nome || ''
      const s = user.value?.sobrenome || ''
      const full = [n, s].filter(Boolean).join(' ')
      if (full) return full
      if (user.value?.display_name) return user.value.display_name
      if (user.value?.email) return String(user.value.email).split('@')[0]
      return 'Colaborador'
    })

    const deptoLabel = computed(() => {
      const d =
        user.value?.departamento ||
        user.value?.departamentos ||
        user.value?.department ||
        user.value?.perfil?.departamento ||
        null
      return normalizeDept(d)
    })

    const goTo = (route) => router.push(route)

    const logout = async () => {
      try {
        await fetch(
          `${import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'}/api/v1/auth/logout`,
          { method: 'POST', credentials: 'include' }
        )
      } catch {}
      localStorage.clear()
      window.location.href = '/login'
    }

    onMounted(() => {
      window.addEventListener('keydown', onKeydown)
      window.addEventListener('scroll', forceClose, { passive: true })
      // fecha ao trocar de rota
      router.afterEach(() => forceClose())
    })
    onBeforeUnmount(() => {
      window.removeEventListener('keydown', onKeydown)
      window.removeEventListener('scroll', forceClose)
    })

    // utils globais para fechar com Esc
    function onKeydown(e) {
      if (e.key === 'Escape') forceClose()
    }
    function forceClose() {
      const ev = new CustomEvent('nu-header-force-close')
      window.dispatchEvent(ev)
    }

    return { user, avatarSrc, displayName, deptoLabel, goTo, logout }
  },
  data() {
    return {
      logo,
      openIndex: null,
      closeTimer: null,
      navHeight: 64,
      profileRect: { top: 0, left: 0, width: 0, height: 0 },
      // estados de hover
      hoveringNav: false,
      hoveringOverlay: false,
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
                { label: 'Accounting', route: '/departamentos/accounting' },
                { label: 'Administrative', route: '/departamentos/administrative' },
                { label: 'Payroll', route: '/departamentos/payroll' },
                { label: 'Tax', route: '/departamentos/tax' },
                { label: 'Finance', route: '/departamentos/finance' },
                { label: 'HR', route: '/departamentos/hr' },
                { label: 'Marketing', route: '/departamentos/marketing' },
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
                { label: 'POP - Administrative', route: '/processos/administrative' },
                { label: 'POP - Tax', route: '/processos/tax' },
                { label: 'POP - Finance', route: '/processos/finance' },
                { label: 'POP - Marketing', route: '/processos/marketing' },
                { label: 'POP - Hr', route: '/processos/hr' },
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
            { title: 'Comunicados', items: [
               { label: 'Avisos de Destaque', route: '/comunicados' },
               { label: 'Murais de Recados', route: '/comunicados' },
               { label: 'Congratulações', route: '/comunicados' },
               { label: 'Boas-Vindas e Até Breve', route: '/comunicados' },            
              ]
           },            
          ],
        },
      ],
    }
  },
  computed: {
    currentMenu() {
      return this.openIndex !== null && this.openIndex !== 'profile'
        ? this.menus[this.openIndex]
        : null
    },
    profileStyle() {
      const pad = 8
      const left = Math.max(12, this.profileRect.left + this.profileRect.width - 240)
      const top = this.navHeight + pad
      return { position: 'fixed', top: `${top}px`, left: `${left}px`, width: '240px', zIndex: 1200 }
    },
  },
  mounted() {
    this.$nextTick(() => {
      const el = this.$refs.navRef?.$el || this.$refs.navRef
      if (el) this.navHeight = el.getBoundingClientRect().height || this.navHeight
    })
    window.addEventListener('click', this.handleClickOutside)
    // listener para fechar vindo do setup()
    window.addEventListener('nu-header-force-close', this.forceClose)
  },
  beforeUnmount() {
    window.removeEventListener('click', this.handleClickOutside)
    window.removeEventListener('nu-header-force-close', this.forceClose)
  },
  methods: {
    /** ---------- HOVER ROBUSTO (nav + overlay) ---------- */
    onNavEnter(idx) {
      this.hoveringNav = true
      this.cancelClose()
      if (this.openIndex !== 'profile') {
        this.openIndex = idx
        document.body.classList.add('nu-mega-open')
      }
    },
    onNavLeave() {
      this.hoveringNav = false
      this.scheduleClose()
    },
    onOverlayEnter() {
      this.hoveringOverlay = true
      this.cancelClose()
    },
    onOverlayLeave() {
      this.hoveringOverlay = false
      this.scheduleClose()
    },

    /** ---------- PERFIL ---------- */
    toggleProfile(e) {
      e?.stopPropagation()
      const el = this.$refs.profileRef
      if (el) {
        const r = (el.$el || el).getBoundingClientRect()
        this.profileRect = { top: r.top, left: r.left, width: r.width, height: r.height }
      }
      // abrir perfil sempre fecha mega
      if (this.openIndex !== 'profile') {
        this.openIndex = 'profile'
      } else {
        this.openIndex = null
      }
      if (this.openIndex) document.body.classList.add('nu-mega-open')
      else document.body.classList.remove('nu-mega-open')
    },

    /** ---------- FECHAMENTO / TIMERS ---------- */
    scheduleClose(delay = 140) {
      this.cancelClose()
      this.closeTimer = setTimeout(() => {
        // só fecha se o mouse não estiver nem no nav nem no overlay
        if (!this.hoveringNav && !this.hoveringOverlay) {
          this.forceClose()
        }
      }, delay)
    },
    cancelClose() {
      if (this.closeTimer) {
        clearTimeout(this.closeTimer)
        this.closeTimer = null
      }
    },
    handleClickOutside() {
      if (this.openIndex === 'profile') this.forceClose()
    },
    forceClose() {
      this.openIndex = null
      this.hoveringNav = false
      this.hoveringOverlay = false
      this.cancelClose()
      document.body.classList.remove('nu-mega-open')
    },

    /** ---------- NAVEGAÇÃO / AUTH ---------- */
    goTo(route) { this.$router.push(route) },
    logout: async function () {
      try {
        await fetch(
          `${import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'}/api/v1/auth/logout`,
          { method: 'POST', credentials: 'include' }
        )
      } catch {}
      localStorage.clear()
      window.location.href = '/login'
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
.nav-btn:hover { color: #f5f5f5; text-decoration: underline; }
.logo-img {
  width: 50px; height: 50px; object-fit: contain; cursor: pointer; border-radius: 12px;
}
.profile-summary { color: #fff; }
.profile-avatar {
  width: 32px; height: 32px; object-fit: cover;
  border: 2px solid #fff; border-radius: 50%;
  background-color: #0a0a2a;
}
.extra-small { font-size: 11px; line-height: 1.2; }
.depto-line { color: rgba(255,255,255,0.7) !important; }
.profile-popover {
  background: #0f2033; border: 1px solid rgba(255,255,255,.08);
  border-radius: 10px; padding: 8px;
}
.profile-popover a {
  display: block; padding: 10px 12px; color: #fff; text-decoration: none; border-radius: 8px;
}
.profile-popover a:hover { background: rgba(255,255,255,.06); }
.profile-popover .divider { height: 1px; margin: 6px 0; background: rgba(255,255,255,.12); }
</style>

<style>
.mega-overlay { position: fixed; left: 0; right: 0; width: 100%; z-index: 1050; background: transparent; }
.mega-content {
  margin: 0 auto; width: clamp(1000px, 92vw, 1280px);
  padding: 56px clamp(40px, 4vw, 80px); min-height: 340px; background: #fff;
  border-radius: 16px; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 100px; animation: megaIn 0.18s ease;
}
.mega-left { display: flex; flex-direction: column; gap: 24px; }
.mega-image { width: 100%; height: 450px; object-fit: cover; border-radius: 12px; }
.mega-left-text h5 { font-weight: 800; color: #111; margin-bottom: 8px; }
.mega-left-text p { color: #555; margin-bottom: 8px; }
.mega-link { color: #4b3fff; font-weight: 600; text-decoration: none; }
.mega-link:hover { text-decoration: underline; }
.mega-col-title { font-weight: 800; color: #0a178d; margin-bottom: 20px; }
.mega-list { list-style: none; margin: 0; padding: 0; }
.mega-list li { margin-bottom: 14px; }
.mega-list a { color: #333; text-decoration: none; transition: color 0.2s; }
.mega-list a:hover { color: #4b3fff; }
body.nu-mega-open { overflow-x: hidden !important; }
@keyframes megaIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 1100px) { .mega-content { grid-template-columns: 1.5fr 1fr; } }
@media (max-width: 900px)  { .mega-content { grid-template-columns: 1fr; width: 94vw; min-width: 0; } }
</style>
