<template>
  <div class="people-wrapper">
    <b-container fluid class="py-4">
      <h2 class="page-title text-center mb-4">Colaboradores Attentive</h2>

      <!-- Filtros -->
      <div class="filters row g-3 align-items-end mb-3">
        <div class="col-12 col-md-5">
          <label class="form-label text-light">Buscar</label>
          <b-form-input
            v-model="q"
            placeholder="Nome, e-mail..."
            @input="onSearchInput"
          />
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label text-light">Departamento</label>
          <b-form-select
            v-model="dep"
            :options="depOptions"
            @change="reload"
          />
        </div>
        <div class="col-12 col-md-3 d-flex gap-2">
          <b-button variant="outline-light" class="flex-fill" @click="clearFilters">
            Limpar
          </b-button>
          <b-button variant="primary" class="flex-fill" @click="reload">
            Aplicar
          </b-button>
        </div>
      </div>

      <!-- Grid -->
      <div class="cards-grid">
        <div v-if="loading" class="grid">
          <div v-for="n in 10" :key="n" class="card skel"></div>
        </div>

        <div v-else class="grid">
          <div
            v-for="p in people"
            :key="p.id"
            class="card"
            @click="openProfile(p)"
            role="button"
          >
            <div class="avatar">
              <img :src="p.avatar_url || defaultAvatar" alt="Avatar" />
            </div>
            <div class="info">
              <div class="name">{{ p.nome }}</div>
              <div class="dept">
                {{ p.departamento?.toUpperCase() || '—' }}
              </div>
            </div>
          </div>

          <div v-if="!people.length" class="empty text-center text-light py-5">
            Nenhum colaborador encontrado.
          </div>
        </div>
      </div>

      <!-- Paginação -->
      <div class="d-flex justify-content-center mt-4" v-if="totalPages > 1">
        <b-pagination
          v-model="page"
          :total-rows="total"
          :per-page="limit"
          align="center"
          @change="reload"
        />
      </div>
    </b-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/core/services/api.service.js'

const router = useRouter()
const defaultAvatar = '/img/avatar-default.png'

// filtros & paginação
const q = ref('')
const dep = ref('')
const page = ref(1)
const limit = ref(24)

// dados
const loading = ref(false)
const people = ref([])
const total = ref(0)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)))

// departamentos
const depOptions = ref([{ value: '', text: 'Todos os departamentos' }])

let debounceTimer = null

const onSearchInput = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    page.value = 1
    reload()
  }, 400)
}

const clearFilters = () => {
  q.value = ''
  dep.value = ''
  page.value = 1
  reload()
}

async function fetchDeps() {
  try {
    const r = await api.get('departamentos')
    const items = Array.isArray(r.data) ? r.data : []
    depOptions.value = [{ value: '', text: 'Todos os departamentos' }].concat(
      items.map(d => ({ value: d.slug, text: d.nome }))
    )
  } catch (err) {
    console.warn('Falha ao carregar departamentos:', err)
  }
}

async function reload() {
  loading.value = true
  try {
    const params = {
      q: q.value || undefined,
      departamento: dep.value || undefined,
    }

    const r = await api.get('colaboradores', { params })
    const data = r.data?.items || r.data || []

    people.value = data.sort((a, b) => (a.nome || '').localeCompare(b.nome || '', 'pt-BR'))
    total.value = data.length
  } catch (err) {
    console.warn('Falha ao carregar colaboradores:', err)
    people.value = []
  } finally {
    loading.value = false
  }
}

function openProfile(p) {
  if (p.id) router.push({ name: 'ColaboradorPerfil', params: { id: p.id } })
}

onMounted(async () => {
  await fetchDeps()
  await reload()
})
</script>

<style scoped>
.people-wrapper {
  min-height: 100vh;
  background: radial-gradient(1200px 600px at 50% -200px, #1a2b4d 0%, #0b1528 60%, #081020 100%);
}
.page-title {
  color: #cfe4ff;
  font-weight: 800;
  text-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
}
.cards-grid .grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
}
.card {
  background: #0c2a5a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px 14px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.35);
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 22px 40px rgba(0, 0, 0, 0.45);
}
.avatar {
  width: 96px;
  height: 96px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.6);
  background: #0b1b3a;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.info .name {
  color: #fff;
  font-weight: 700;
  line-height: 1.2;
  margin-top: 4px;
}
.info .dept {
  color: #8fb9ff;
  font-size: 0.85rem;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.empty {
  opacity: 0.8;
}
.skel {
  position: relative;
  overflow: hidden;
}
.skel::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.16) 50%,
    rgba(255, 255, 255, 0.06) 100%
  );
  animation: sh 1.2s infinite;
  border-radius: 14px;
}
@keyframes sh {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
