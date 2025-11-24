<template>
  <div class="signup-wrapper">
    <div class="signup-box">
      <h2 class="mb-3 text-center">Cadastrar colaborador</h2>

      <transition name="fade">
        <div v-if="error" class="alert alert-danger text-center py-2" role="alert">
          {{ error }}
        </div>
      </transition>
      <transition name="fade">
        <div v-if="success" class="alert alert-success text-center py-2" role="alert">
          Usuário criado com sucesso!
        </div>
      </transition>

      <form @submit.prevent="submit" novalidate>
        <div class="row g-3">

          <!-- Nome -->
          <div class="col-md-6">
            <label for="nome" class="form-label">Nome</label>
            <input v-model.trim="form.nome" id="nome" type="text" class="form-control" required />
          </div>

          <!-- Sobrenome -->
          <div class="col-md-6">
            <label for="sobrenome" class="form-label">Sobrenome</label>
            <input v-model.trim="form.sobrenome" id="sobrenome" type="text" class="form-control" required />
          </div>

          <!-- Email -->
          <div class="col-12">
            <label for="email" class="form-label">E-mail</label>
            <input
              v-model.trim="form.email"
              id="email"
              type="email"
              class="form-control"
              placeholder="colaborador@empresa.com"
              required
              autocomplete="username"
            />
          </div>

          <!-- Departamento -->
          <div class="col-md-6">
            <label for="departamento" class="form-label">Departamento</label>
            <select
              v-model="form.departamento"
              id="departamento"
              class="form-select"
              :disabled="loadingDeps"
              required
            >
              <option value="" disabled>Selecione...</option>
              <option v-for="d in departamentos" :key="d.slug" :value="d.slug">
                {{ d.nome }}
              </option>
            </select>
          </div>

          <!-- Ativo -->
          <div class="col-md-6">
            <label class="form-label d-block">Ativo</label>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="ativo" v-model="form.ativo" />
              <label class="form-check-label" for="ativo">{{ form.ativo ? 'Sim' : 'Não' }}</label>
            </div>
          </div>

          <!-- Senha -->
          <div class="col-md-6">
            <label for="senha" class="form-label">Senha</label>
            <div class="input-group">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.senha"
                id="senha"
                class="form-control"
                placeholder="Defina uma senha"
                required
                autocomplete="new-password"
              />
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="showPassword = !showPassword"
                :disabled="loading"
              >
                {{ showPassword ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
          </div>

          <!-- Confirmar senha -->
          <div class="col-md-6">
            <label for="senha2" class="form-label">Confirmar senha</label>
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="senhaConfirm"
              id="senha2"
              class="form-control"
              placeholder="Repita a senha"
              required
              autocomplete="new-password"
            />
            <small v-if="senhaMismatch" class="text-danger">As senhas não conferem.</small>
          </div>

          <!-- Avatar -->
          <div class="col-12">
            <label class="form-label">Avatar</label>
            <div class="d-flex align-items-center gap-3">
              <input type="file" accept="image/*" class="form-control" @change="onAvatarSelect" />
              <input
                v-model.trim="form.avatar_url"
                type="url"
                class="form-control"
                placeholder="Ou cole uma URL de imagem"
              />
            </div>
            <div v-if="preview" class="text-center mt-2">
              <img :src="preview" alt="preview" class="avatar-preview rounded-circle" />
            </div>
          </div>

          <!-- Descrição -->
          <div class="col-12">
            <label for="descricao" class="form-label">Descrição (HTML simples)</label>
            <textarea
              v-model="form.descricao_html"
              id="descricao"
              rows="3"
              class="form-control"
              placeholder="Resumo do colaborador, habilidades, etc."
            ></textarea>
          </div>

          <!-- Notas de boas-vindas com Quill -->
          <div class="col-12">
            <label class="form-label">Notas de boas-vindas (RH)</label>
            <div class="quill-wrapper">
              <QuillEditor
                v-model:content="form.welcome_notes"
                content-type="html"
                theme="snow"
                class="quill-editor"
              />
            </div>
          </div>

          <!-- Permissões -->
          <div class="col-12 mt-3">
            <label class="form-label d-block">Permissões</label>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="checkbox"
                id="role_colab"
                value="colaborador"
                v-model="form.roles"
              />
              <label class="form-check-label" for="role_colab">Colaborador</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="checkbox"
                id="role_admin"
                value="administrador"
                v-model="form.roles"
              />
              <label class="form-check-label" for="role_admin">Administrador</label>
            </div>
          </div>
        </div>

        <!-- Botão salvar -->
        <button
          type="submit"
          class="btn btn-primary w-100 d-flex align-items-center justify-content-center mt-4"
          :disabled="loading || senhaMismatch"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
          {{ loading ? 'Salvando...' : 'Criar usuário' }}
        </button>

        <!-- Botão voltar -->
        <button
          type="button"
          class="btn btn-outline-secondary w-100 mt-2"
          :disabled="loading"
          @click="goBack"
        >
          Voltar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/services/http'
import { QuillEditor } from '@vueup/vue-quill'

const router = useRouter()

const loading = ref(false)
const loadingDeps = ref(false)
const error = ref(null)
const success = ref(false)
const showPassword = ref(false)
const senhaConfirm = ref('')

const departamentos = ref([])

const preview = ref('')

const form = ref({
  nome: '',
  sobrenome: '',
  email: '',
  departamento: '',
  avatar_url: '',
  descricao_html: '',
  pontos: 0,
  feedbacks: [],
  cursos_progresso: [],
  ativo: true,
  roles: ['colaborador'],
  senha: '',

  welcome_notes: '',
  welcome_photo: ''
})

const senhaMismatch = computed(
  () => !!form.value.senha && form.value.senha !== senhaConfirm.value
)

function onAvatarSelect (evt) {
  const file = evt.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    form.value.avatar_url = String(reader.result)
    preview.value = form.value.avatar_url

    // usa a mesma imagem como foto de boas-vindas
    form.value.welcome_photo = form.value.avatar_url
  }
  reader.readAsDataURL(file)
}

function normalizeUserPayload () {
  const payload = { ...form.value }
  payload.email = payload.email.trim().toLowerCase()
  return payload
}

async function loadDepartamentos () {
  loadingDeps.value = true
  try {
    const { data } = await http.get('/departamentos')
    departamentos.value = data
      .filter(d => d.ativo !== false)
      .sort((a, b) => (a.ordem ?? 999) - (b.ordem ?? 999))
  } catch (e) {
    error.value = 'Falha ao carregar departamentos'
  } finally {
    loadingDeps.value = false
  }
}

async function submit () {
  error.value = null
  success.value = false

  if (senhaMismatch.value) {
    error.value = 'As senhas não conferem.'
    return
  }

  loading.value = true
  try {
    const payload = normalizeUserPayload()
    await http.post('/usuarios', payload)

    success.value = true
    setTimeout(() => router.replace({ name: 'Perfil' }), 800)
  } catch (e) {
    const msg = e?.response?.data?.detail
    error.value = msg ? String(msg) : 'Não foi possível criar o usuário.'
  } finally {
    loading.value = false
  }
}

function goBack () {
  router.back()
}

onMounted(() => {
  loadDepartamentos()
})
</script>

<style scoped>
.signup-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: url('@/assets/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.signup-box {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 14px;
  backdrop-filter: blur(4px);
  box-shadow:
    0 10px 25px rgba(16, 24, 40, 0.08),
    0 2px 8px rgba(16, 24, 40, 0.06);
  width: 100%;
  max-width: 560px;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 3px solid rgba(0,0,0,0.08);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Wrapper do Quill para evitar "invadir" o próximo bloco */
.quill-wrapper {
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
}

/* toolbar + editor com bordas arredondadas e altura mínima */
.quill-wrapper :deep(.ql-toolbar) {
  border-radius: 8px 8px 0 0;
}

.quill-wrapper :deep(.ql-container) {
  border-radius: 0 0 8px 8px;
}

.quill-wrapper :deep(.ql-editor) {
  min-height: 150px;
}

.btn { height: 44px; border-radius: 10px; }
.form-label { font-weight: 600; }

.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter, .fade-leave-to { opacity: 0; }
</style>
