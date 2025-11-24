<template>
  <div class="perfil-wrapper text-light">
    <b-container fluid class="py-4">
      <b-row class="g-4">
        <!-- COLUNA ESQUERDA -->
        <b-col cols="12" md="3" class="col-left d-flex flex-column align-items-center">
          <!-- Avatar + nome + depto -->
          <div class="perfil-avatar-block d-flex flex-column align-items-center">
            <img :src="perfil.avatar_url || defaultAvatar" class="perfil-foto rounded-circle mb-3" alt="Foto do colaborador" />
            <div class="perfil-identidade text-light text-center">
              <div class="perfil-nome fw-bold">{{ perfil.nome || '—' }}</div>
              <div class="perfil-depto">{{ perfil.departamento || '—' }}</div>
            </div>
          </div>

          <!-- CARD: progresso e pontuação -->
          <section class="progresso-card w-100 mt-4 rounded shadow-sm">
            <div class="px-3 py-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="text-light fw-semibold small">Evolução nos cursos</div>
                <div class="pontuacao-badge text-end">
                  <div class="pontuacao-valor">{{ totalPontos }} pts</div>
                  <div class="pontuacao-label">pontuação</div>
                </div>
              </div>

              <b-progress :value="percentualConcluido" :max="100" height="10px" variant="success" class="mb-2 progresso-bar" />

              <div class="text-light text-center progresso-text">
                {{ cursosConcluidos }} / {{ cursos.length }} cursos concluídos ({{ percentualConcluido }}%)
              </div>
            </div>
          </section>

          <!-- CARD: elogios / feedbacks -->
          <section class="feedbacks-card w-100 mt-4 rounded shadow-sm d-flex flex-column">
            <div class="px-3 pt-3 pb-2">
              <div class="text-light fw-semibold small mb-2">Feedbacks recentes</div>
              <ul class="lista-feedbacks">
                <li v-for="(item, i) in feedbacks" :key="i" class="feedback-item text-light small">
                  {{ item.msg }}
                </li>
              </ul>
            </div>

            <div class="px-3 pb-3 mt-auto">
              <b-form-textarea v-model="novoFeedback" placeholder="Adicionar elogio / reconhecimento interno..." rows="2" class="mb-2 feedback-textarea" />
              <b-button size="sm" variant="primary" class="w-100" @click="adicionarFeedback">Adicionar</b-button>
            </div>
          </section>
        </b-col>

        <!-- COLUNA DIREITA -->
        <b-col cols="12" md="9" class="col-right">
          <!-- DESCRIÇÃO DO COLABORADOR -->
          <section class="bloco-descricao rounded mb-4 p-3">
            <div class="label-descricao text-light fw-semibold mb-2">Descrição do colaborador:</div>
            <div class="editor-wrapper rounded overflow-hidden">
              <quill-editor
                v-model:content="perfil.descricao_html"
                content-type="html"
                theme="snow"
                toolbar="full"
                class="descricao-editor bg-white text-dark"
                @blur="salvarDescricao"
              />
            </div>
          </section>

          <!-- DESENVOLVIMENTO / CURSOS -->
          <section class="bloco-cursos rounded border shadow-sm mb-4">
            <header class="cursos-header p-3 border-bottom d-flex justify-content-between align-items-start">
              <div>
                <h4 class="cursos-titulo fw-semibold mb-1 text-dark">Desenvolvimento e Crescimento:</h4>
                <div class="cursos-sub fw-semibold text-primary mb-2">Cursos da CEFIS</div>
                <div class="cursos-underline"></div>
              </div>
              <div class="cursos-logo-wrapper">
                <img :src="logoAttentive" alt="Attentive" class="cursos-logo" />
              </div>
            </header>

            <div class="cursos-body position-relative">
              <div class="marca-dagua">
                <img :src="logoAttentive" alt="marca d'água" class="marca-dagua-img" />
              </div>

              <div class="cursos-grid p-3">
                <div
                  v-for="curso in cursos"
                  :key="curso.slug || curso.nome"
                  class="curso-card text-center border rounded shadow-sm p-3"
                  :class="{ 'curso-concluido': curso.concluido }"
                  @click="toggleConcluido(curso)"
                >
                  <div class="curso-time fw-bold">{{ timeLabel }}</div>
                  <div class="curso-nome fw-semibold mt-2" :class="{ 'text-success': curso.concluido, 'text-primary': !curso.concluido }">
                    {{ curso.nome }}
                  </div>
                  <div class="curso-status-icon mt-3">
                    <span v-if="curso.concluido" class="status-badge bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center" title="Concluído">✓</span>
                    <span v-else class="status-badge bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center" title="Pendente">ⓘ</span>
                  </div>
                </div>
              </div>
            </div>

            <footer class="cursos-footer border-top p-3 d-flex justify-content-end">
              <b-button size="sm" variant="success" @click="salvarCursos">Salvar progresso de cursos</b-button>
            </footer>
          </section>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/core/services/api.service.js'
import logoAttentive from '@/assets/logo.png'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const defaultAvatar = '/img/avatar-default.png'

// mapping opcional: slug -> rótulo do “time”
const timeMap = {
  tax: 'Time Tax',
  accounting: 'Time Accounting',
  payroll: 'Time Payroll',
  finance: 'Time Finance',
  hr: 'Time HR',
  administrative: 'Time Administrative'
}

// ======== ESTADO ========
const meId = ref(null)
const depSlug = ref(null)

const perfil = ref({
  nome: '',
  departamento: '',
  descricao_html: '',
  avatar_url: ''
})

const cursos = ref([])               // [{slug,nome,concluido}]
const cursosConcluidos = computed(() => cursos.value.filter(c => c.concluido).length)
const percentualConcluido = computed(() => (cursos.value.length ? Math.round((cursosConcluidos.value / cursos.value.length) * 100) : 0))
const totalPontos = computed(() => cursosConcluidos.value * 10)
const timeLabel = computed(() => timeMap[depSlug.value] || 'Cursos')

// feedbacks
const feedbacks = ref([])
const novoFeedback = ref('')

// ======== API HELPERS ========

// tenta /colaboradores/me; se 404, usa /auth/me
async function fetchMe() {
  try {
    const r1 = await api.get('/api/v1/colaboradores/me')
    return r1.data
  } catch (e) {
    // fallback
    const r2 = await api.get('/api/v1/auth/me')
    return r2.data?.usuario || r2.data || {}
  }
}

async function fetchFeedbacks() {
  try {
    const r = await api.get('/api/v1/colaboradores/me/feedbacks')
    feedbacks.value = Array.isArray(r.data) ? r.data : []
  } catch {
    // se ainda não existe endpoint, mantém vazio
    feedbacks.value = []
  }
}

async function saveFeedback(entry) {
  try {
    await api.post('/api/v1/colaboradores/me/feedbacks', entry)
  } catch {
    /* sem endpoint ainda: ignora */
  }
}

async function fetchCursosDepartamento(slug) {
  if (!slug) return
  const r = await api.get('/api/v1/cursos', { params: { departamento_slug: slug, apenas_ativos: true } })
  // normaliza pro shape usado na UI
  cursos.value = (r.data || []).map(c => ({
    slug: c.slug,
    nome: c.nome,
    concluido: false
  }))
  // tenta aplicar progresso salvo do colaborador
  try {
    const pr = await api.get('/api/v1/colaboradores/me/cursos')
    const progresso = Array.isArray(pr.data) ? pr.data : []
    const done = new Set(progresso.filter(p => p.concluido).map(p => p.slug))
    cursos.value.forEach(c => { c.concluido = done.has(c.slug) })
  } catch {
    /* sem endpoint ainda: segue com lista base */
  }
}

// ======== LIFECYCLE ========
onMounted(async () => {
  // 1) usuário
  const u = await fetchMe()
  meId.value = u._id || u.id || u.user_id || null
  depSlug.value = u.departamento_slug || u.departamento || null

  perfil.value = {
    nome: u.nome || u.display_name || '—',
    departamento: u.departamento_nome || u.departamento || u.departamento_slug || '—',
    descricao_html: u.descricao_html || u.descricao || '',
    avatar_url: u.avatar_url || u.foto_url || ''
  }

  // 2) cursos do departamento
  await fetchCursosDepartamento(depSlug.value)

  // 3) feedbacks
  await fetchFeedbacks()
})

// ======== AÇÕES ========
function toggleConcluido(curso) {
  curso.concluido = !curso.concluido
}

async function salvarDescricao() {
  const payload = { descricao_html: perfil.value.descricao_html }
  try {
    // preferencial: endpoint de colaboradores
    await api.patch('/api/v1/colaboradores/me', payload)
  } catch {
    // fallback: usuários por id (se existir)
    if (meId.value) {
      try { await api.patch(`/api/v1/usuarios/${meId.value}`, payload) } catch {}
    }
  }
}

async function salvarCursos() {
  const progresso = cursos.value.map(c => ({ slug: c.slug, concluido: !!c.concluido }))
  try {
    await api.post('/api/v1/colaboradores/me/cursos', { progresso })
  } catch {
    /* sem endpoint ainda: tudo bem */
  }
}

function adicionarFeedback() {
  const msg = (novoFeedback.value || '').trim()
  if (!msg) return
  const entry = { msg, ts: new Date().toISOString() }
  feedbacks.value.unshift(entry)
  novoFeedback.value = ''
  saveFeedback(entry) // melhor effort
}
</script>

<style scoped>
/* (estilos idênticos aos seus – mantive tudo) */

/* FUNDO GERAL */
.perfil-wrapper{background:radial-gradient(circle at 10% 0%,#0f1a3a 0%,#0e1d32 60%,#091021 100%);min-height:100vh;color:#fff}
/* ===== COLUNA ESQUERDA ===== */
.col-left{background:#0f1a3a;border-right:2px solid rgba(255,255,255,.07);min-height:calc(100vh - 80px);padding-top:2rem;padding-bottom:2rem;position:relative}
.perfil-avatar-block{max-width:260px}
.perfil-foto{width:180px;height:180px;object-fit:cover;border:4px solid rgba(255,255,255,.25);background-color:#0a0a2a;box-shadow:0 20px 40px rgba(0,0,0,.8)}
.perfil-identidade{text-shadow:0 10px 24px rgba(0,0,0,.9)}
.perfil-nome{font-size:1.4rem;line-height:1.3;color:#fff;text-align:center}
.perfil-depto{font-size:1rem;color:#cfd8ff;font-weight:500;text-align:center}
/* ===== CARD PROGRESSO ===== */
.progresso-card{background:rgba(15,26,58,.8);border:1px solid rgba(255,255,255,.12);box-shadow:0 18px 40px rgba(0,0,0,.8);font-size:.85rem}
.progresso-bar{background-color:rgba(255,255,255,.15);border-radius:4px;box-shadow:0 10px 24px rgba(0,0,0,.8)}
.pontuacao-badge{text-align:right;line-height:1.1}
.pontuacao-valor{font-size:1rem;font-weight:700;color:#6bffb4}
.pontuacao-label{font-size:.7rem;color:rgba(255,255,255,.6)}
.progresso-text{font-size:.75rem;color:rgba(255,255,255,.8)}
/* ===== CARD FEEDBACKS ===== */
.feedbacks-card{background:rgba(15,26,58,.8);border:1px solid rgba(255,255,255,.12);box-shadow:0 18px 40px rgba(0,0,0,.8);min-height:200px;max-width:260px;font-size:.8rem}
.lista-feedbacks{list-style:none;padding-left:0;margin-bottom:0;max-height:120px;overflow-y:auto}
.feedback-item{background:rgba(255,255,255,.07);border-radius:6px;padding:6px 8px;line-height:1.3;box-shadow:0 10px 20px rgba(0,0,0,.7)}
.feedback-item + .feedback-item{margin-top:6px}
.feedback-textarea{background:rgba(0,0,0,.4)!important;border:1px solid rgba(255,255,255,.2)!important;color:#fff!important;font-size:.8rem}
.feedback-textarea:focus{box-shadow:0 0 0 .2rem rgba(0,123,255,.25);outline:0}
/* ===== COLUNA DIREITA ===== */
.col-right{min-height:calc(100vh - 80px);background:transparent;color:#fff}
/* ===== BLOCO DESCRIÇÃO ===== */
.bloco-descricao{background:#0f1a3a;border:1px solid rgba(255,255,255,.12);box-shadow:0 18px 40px rgba(0,0,0,.8)}
.label-descricao{font-size:.9rem;color:#dbe3ff}
.editor-wrapper{background:#fff;border-radius:6px;overflow:hidden;box-shadow:0 12px 28px rgba(0,0,0,.6)}
.descricao-editor{min-height:130px;max-height:260px}
.descricao-editor :deep(.ql-toolbar){background:#1a1f46;color:#fff;border:0;border-bottom:1px solid rgba(255,255,255,.15)}
.descricao-editor :deep(.ql-toolbar .ql-picker),.descricao-editor :deep(.ql-toolbar button){color:#fff!important;fill:#fff!important}
.descricao-editor :deep(.ql-container){border:0!important}
.descricao-editor :deep(.ql-editor){background:#fff;color:#000;font-size:.95rem;line-height:1.4rem}
/* ===== BLOCO CURSOS ===== */
.bloco-cursos{background:#fdfdfd;border-color:#00000022!important;box-shadow:0 24px 48px rgba(0,0,0,.6);position:relative}
.cursos-header .cursos-titulo{color:#1a1a1a;font-size:1.05rem;line-height:1.3}
.cursos-sub{font-size:.95rem;color:#003a8c;text-decoration:underline}
.cursos-underline{width:220px;height:2px;background:#003a8c}
.cursos-logo-wrapper{min-width:64px;text-align:right}
.cursos-logo{max-height:28px;opacity:.9}
.cursos-body{position:relative;background:linear-gradient(to bottom,rgba(255,255,255,1) 0%,rgba(245,245,245,1) 70%,rgba(240,240,240,1) 100%);border-bottom:1px solid #00000022}
.marca-dagua{position:absolute;right:1.5rem;bottom:1.5rem;opacity:.07;pointer-events:none}
.marca-dagua-img{max-height:90px;max-width:120px;object-fit:contain;filter:brightness(0) saturate(100%)}
.cursos-grid{display:flex;flex-wrap:wrap;gap:1rem}
.curso-card{flex:0 1 calc(33.333% - 1rem);min-width:200px;max-width:260px;background:#fff;color:#000;border:1px solid rgba(0,0,0,.15)!important;border-radius:12px;cursor:pointer;transition:all .18s ease;box-shadow:0 12px 22px rgba(0,0,0,.15);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;min-height:140px;text-align:center}
.curso-card:hover{transform:translateY(-2px);box-shadow:0 16px 30px rgba(0,0,0,.25)}
.curso-time{font-size:.85rem;color:#1a1a1a;font-weight:600}
.curso-nome{font-size:.9rem;line-height:1.3rem}
.status-badge{width:28px;height:28px;font-size:.8rem;font-weight:600;border:2px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,.3)}
.curso-concluido{background:#00b89430!important;border:2px solid #00b894!important}
.curso-concluido .curso-nome{color:#00b894!important;font-weight:600}
.cursos-footer{background:#fff}
</style>
