<template>
  <BModal
    v-model="show"
    title="Nova Publicação"
    dialog-class="modal-offset"
    :hide-footer="true"
  >
    <BForm @submit.prevent="publicar">
      <!-- Tipo de comunicado -->
      <BFormGroup label="Tipo de comunicado" label-for="tipo">
        <BFormSelect
          id="tipo"
          v-model="form.tipo"
          :options="tiposComunicado"
        />
        <small class="text-muted">
          Esse tipo será usado para destacar o comunicado com cores diferentes na listagem.
        </small>
      </BFormGroup>

      <BFormGroup label="Título" label-for="titulo" class="mt-3">
        <BFormInput id="titulo" v-model="form.titulo" required placeholder="Título" />
      </BFormGroup>

      <BFormGroup label="Subtítulo (opcional)" label-for="subtitulo" class="mt-3">
        <BFormInput id="subtitulo" v-model="form.subtitulo" placeholder="Subtítulo" />
      </BFormGroup>

      <BFormGroup label="Texto da publicação" class="mt-3">
        <QuillEditor
          v-model:content="form.conteudo"
          contentType="html"
          theme="snow"
          :toolbar="toolbar"
          style="height: 250px; background-color: white; border-radius: 8px;"
        />
        <small class="text-muted">
          Dica: use formatação (negrito, itálico, listas, links) para deixar o comunicado mais claro.
        </small>
      </BFormGroup>

      <BFormGroup label="URL da foto (opcional)" class="mt-3">
        <BFormInput v-model="form.fotoUrl" placeholder="https://..." />
      </BFormGroup>

      <BAlert v-if="error" variant="danger" show class="mt-3">{{ error }}</BAlert>
      <BAlert v-if="success" variant="success" show class="mt-3">Publicado com sucesso!</BAlert>

      <div class="d-flex justify-content-end gap-2 mt-4">
        <BButton variant="secondary" @click="fechar" :disabled="loading">Cancelar</BButton>
        <BButton
          variant="primary"
          type="submit"
          :disabled="loading || !form.titulo.trim() || !conteudoPlano"
        >
          <span v-if="!loading">Publicar</span>
          <span v-else>Publicando…</span>
        </BButton>
      </div>
    </BForm>
  </BModal>
</template>

<script setup>
import { ref, defineEmits, defineExpose, computed } from 'vue'
import {
  BModal,
  BForm,
  BFormInput,
  BFormGroup,
  BButton,
  BAlert,
  BFormSelect          // 👈 novo import
} from 'bootstrap-vue-3'
import { QuillEditor } from '@vueup/vue-quill'
import { api } from '@/services/api'

// ---- eventos ----
const emit = defineEmits(['publicado']) // mantém compat com a tela (Comunicados.vue)

// ---- controle do modal (exposto ao pai) ----
const show = ref(false)
defineExpose({ show })

// opções de tipo de comunicado
const tiposComunicado = [
  { value: 'general',   text: 'Comunicado geral' },
  { value: 'highlight', text: 'Aviso de destaque' },
  { value: 'mural',     text: 'Mural de recados' },
  { value: 'congrats',  text: 'Parabéns / conquistas' },
  { value: 'farewell',  text: 'Boas-vindas / Até breve' }
]

// ---- estado do form ----
const form = ref({
  tipo: 'general',  // 👈 default
  titulo: '',
  subtitulo: '',
  conteudo: '', // HTML do Quill
  fotoUrl: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

const toolbar = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
  ['link', 'blockquote', 'code-block', 'clean']
]

// Util: remover HTML para gerar um resumo/texto plano (usado só para validação)
function stripHtml (html) {
  const tmp = document.createElement('div')
  tmp.innerHTML = html || ''
  return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim()
}

const conteudoPlano = computed(() => stripHtml(form.value.conteudo))

function resetar () {
  form.value = {
    tipo: 'general',
    titulo: '',
    subtitulo: '',
    conteudo: '',
    fotoUrl: ''
  }
  error.value = ''
  success.value = false
}

function fechar () {
  show.value = false
}

// ---- publicar no backend ----
async function publicar () {
  error.value = ''
  success.value = false

  // validação mínima
  if (!form.value.titulo.trim()) {
    error.value = 'Informe o título.'
    return
  }
  if (!conteudoPlano.value) {
    error.value = 'Escreva o texto da publicação.'
    return
  }

  // Montar payload para API /comunicados
  // Campos esperados pelo backend: tipo, titulo, conteudo_html, imagem, visibilidade, tags, status, autor_id?, target_user_id?
  const payload = {
    tipo: form.value.tipo,                             // 👈 agora vem do select
    titulo: form.value.titulo.trim(),
    conteudo_html: form.value.conteudo,                // se seu backend usa conteudo_html
    imagem: form.value.fotoUrl?.trim() || null,
    visibilidade: 'public',
    tags: form.value.subtitulo ? [form.value.subtitulo.trim()] : [],
    status: 'published'
  }

  try {
    loading.value = true

    const { data: saved } = await api.post('/api/v1/comunicados', payload)

    // Emite no formato esperado pela lista
    emit('publicado', {
      id: saved?._id || saved?.id,
      tipo: form.value.tipo,
      titulo: form.value.titulo,
      subtitulo: form.value.subtitulo,
      conteudo: form.value.conteudo, // HTML rico
      fotoUrl: form.value.fotoUrl
    })

    success.value = true
    setTimeout(() => {
      show.value = false
      resetar()
    }, 400)
  } catch (e) {
    console.error(e)
    error.value = 'Não foi possível publicar. Verifique sua conexão e tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-offset {
  margin-top: 12vh !important; /* empurra o modal para baixo para não colidir com navbar/header fixos */
}
</style>
