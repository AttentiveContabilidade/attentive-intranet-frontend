<template>
  <div class="colab-perfil-wrapper text-light">
    <b-container fluid class="py-4">

      <!-- Top bar -->
      <div class="d-flex align-items-center mb-3">
        <b-button size="sm" variant="outline-light" @click="goBack">← Voltar</b-button>
      </div>

      <b-card no-body class="bg-panel border-0 shadow-sm mb-4">
        <b-card-body class="p-3 p-md-4">
          <div class="d-flex flex-wrap align-items-center gap-3">
            <img :src="profile.avatar_url || defaultAvatar" alt="Avatar" class="avatar" />
            <div class="flex-grow-1">
              <h3 class="mb-1 text-white">{{ profile.nome || 'Colaborador' }}</h3>

              <div class="small text-muted">
                <span v-if="profile.email" class="me-3">
                  <i class="bi bi-envelope me-1"></i>{{ profile.email }}
                </span>
                <span v-if="profile.departamento">
                  <i class="bi bi-people me-1"></i>{{ profile.departamento.toUpperCase() }}
                </span>
              </div>
            </div>
          </div>
        </b-card-body>
      </b-card>

      <!-- Descrição -->
      <b-card no-body class="bg-panel border-0 shadow-sm mb-4">
        <b-card-header class="bg-panel-2 text-white fw-semibold">Descrição</b-card-header>
        <b-card-body class="text-white">
          <div v-if="loading.profile" class="text-muted">Carregando descrição…</div>
          <div v-else-if="profile.descricao_html" v-html="profile.descricao_html" class="desc-html"></div>
          <div v-else class="text-muted">Sem descrição cadastrada.</div>
        </b-card-body>
      </b-card>

      <!-- Cursos -->
      <b-card no-body class="bg-panel border-0 shadow-sm">
        <b-card-header class="bg-panel-2 text-white fw-semibold">Cursos do departamento</b-card-header>
        <b-card-body>
          <div v-if="loading.courses" class="text-muted">Carregando cursos…</div>
          <div v-else-if="!courses.length" class="text-muted">Não há cursos ativos.</div>

          <div v-else class="grid">
            <div v-for="(c, idx) in courses" :key="idx" class="course-card border rounded shadow-sm p-3 bg-white text-dark">
              <div class="fw-bold course-title mb-2">
                <a v-if="c.url" :href="c.url" target="_blank" rel="noopener" class="link-primary text-decoration-none">
                  {{ c.nome }}
                </a>
                <span v-else>{{ c.nome }}</span>
              </div>
            </div>
          </div>
        </b-card-body>
      </b-card>

      <div v-if="error" class="alert alert-danger mt-4">{{ error }}</div>
    </b-container>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/core/services/api.service.js'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const defaultAvatar = '/img/avatar-default.png'

const loading = reactive({ profile: true, courses: true })
const profile = reactive({})
const courses = ref([])
const error = ref('')

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push({ name: 'Colaboradores' })
}

async function fetchProfile() {
  loading.profile = true
  error.value = ''
  try {
    const { data } = await api.get(`colaboradores/${id}`)
    Object.assign(profile, data)
  } catch (err) {
    error.value = 'Não foi possível carregar o colaborador.'
  } finally {
    loading.profile = false
  }
}

async function fetchCourses() {
  loading.courses = true
  try {
    const { data } = await api.get('cursos', {
      params: { departamento_slug: profile.departamento },
    })
    courses.value = data
  } catch {
    courses.value = []
  } finally {
    loading.courses = false
  }
}

onMounted(async () => {
  await fetchProfile()
  await fetchCourses()
})
</script>

<style scoped>
.colab-perfil-wrapper {
  min-height: 100vh;
  background: radial-gradient(1200px 500px at 10% -200px, #1a2450 0%, #0e1d32 60%, #091021 100%);
}
.bg-panel {
  background: rgba(15, 26, 58, 0.85) !important;
}
.bg-panel-2 {
  background: rgba(15, 26, 58, 0.75) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.avatar {
  width: 78px;
  height: 78px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  background: #0a0a2a;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
.course-card {
  border-radius: 12px;
}
.course-title {
  line-height: 1.2rem;
}
</style>
