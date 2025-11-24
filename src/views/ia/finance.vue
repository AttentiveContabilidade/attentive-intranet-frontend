<template>
  <b-container fluid class="min-vh-100 text-white p-3">
    <b-row class="h-100 g-4">

      <!-- Lado esquerdo - Prompts -->
      <b-col cols="12" md="3" class="d-flex flex-column">
        <h5 class="text-center mb-3">Lista de Prompts para comparações com IA.</h5>

        <b-card class="bg-transparent border-0 flex-grow-1 p-0">
          <div class="prompt-list px-1">
            <b-button
              v-for="(prompt, index) in prompts"
              :key="index"
              variant="outline-light"
              class="prompt-btn w-100 text-start mb-2"
              @click="sendPrompt(prompt)"
            >
              {{ prompt.label }}
            </b-button>
          </div>
        </b-card>
      </b-col>

      <!-- Lado direito - Chat -->
      <b-col cols="12" md="9" class="d-flex">
        <b-card no-body class="chat-card bg-light text-dark rounded shadow flex-grow-1 d-flex">
          <div class="p-3 border-bottom fw-semibold">
            Bem-vindo ao chat Attentive - Finance
          </div>

          <!-- Mensagens -->
          <div
            class="chat-messages"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            :class="{ 'dragging': isDragging }"
          >
            <div v-for="(msg, index) in messages" :key="index" class="mb-4">
              <div class="fw-semibold mb-1">{{ msg.sender }}:</div>
              <div v-if="msg.text">{{ msg.text }}</div>

              <div v-if="msg.attachments?.length" class="mt-2 d-flex flex-wrap gap-2">
                <div
                  v-for="(file, fi) in msg.attachments"
                  :key="fi"
                  class="attachment-pill d-flex align-items-center"
                >
                  <template v-if="file.preview && file.type?.startsWith('image/')">
                    <img :src="file.preview" alt="" class="thumb me-2" />
                  </template>
                  <template v-else>📎</template>
                  <div class="ms-2 small">
                    <div class="fw-semibold text-truncate" style="max-width:220px">{{ file.name }}</div>
                    <div class="text-muted">{{ formatBytes(file.size) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="isDragging" class="drop-hint">Solte os arquivos aqui para anexar</div>
          </div>

          <!-- Barra de entrada (fixa no rodapé do card) -->
          <div class="chat-input border-top p-2">
            <b-input-group class="align-items-stretch">
              <!-- Botão anexar -->
              <b-input-group-prepend>
                <b-button variant="outline-primary" class="h-100 d-flex align-items-center" @click="triggerFileDialog" title="Anexar arquivos">
                  <b-icon-paperclip class="me-1" />
                  <span class="d-none d-sm-inline">Anexar</span>
                  <span v-if="attachments.length" class="badge bg-primary ms-2">{{ attachments.length }}</span>
                </b-button>
              </b-input-group-prepend>

              <!-- Campo de texto -->
              <b-form-input
                v-model="currentMessage"
                placeholder="Digite sua mensagem..."
                @keyup.enter="sendMessage"
              />

              <!-- Enviar -->
              <b-input-group-append>
                <b-button variant="primary" class="h-100" @click="sendMessage">
                  <b-icon-send class="me-1" />
                  Enviar
                </b-button>
              </b-input-group-append>
            </b-input-group>

            <!-- chips de anexos selecionados -->
            <div v-if="attachments.length" class="mt-2 d-flex flex-wrap gap-2">
              <div v-for="(file, idx) in attachments" :key="idx" class="attachment-chip">
                <template v-if="file.preview && file.type?.startsWith('image/')">
                  <img :src="file.preview" class="chip-thumb me-2" />
                </template>
                <template v-else>📎</template>
                <span class="ms-1 text-truncate" style="max-width:220px">{{ file.name }}</span>
                <button class="btn btn-sm btn-link text-danger ms-2 p-0" @click="removeAttachment(idx)">remover</button>
              </div>
            </div>

            <!-- input invisível de arquivos -->
            <input
              ref="fileInput"
              type="file"
              class="d-none"
              multiple
              :accept="acceptTypes"
              @change="onFilesSelected"
            />
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from 'axios'

export default {
  name: "ChatIA",
  data() {
    return {
      prompts: [
        { label: "Prompt 1", text: "Compare os dois documentos PDF em anexo..." },
        { label: "Prompt 2", text: "Texto pronto para Prompt 2" },
        { label: "Prompt 3", text: "Texto pronto para Prompt 3" },
        { label: "Prompt 4", text: "Texto pronto para Prompt 4" },
        { label: "Prompt 5", text: "Texto pronto para Prompt 5" },
        { label: "Prompt 6", text: "Texto pronto para Prompt 6" }
      ],
      messages: [],
      currentMessage: "",
      attachments: [],
      isDragging: false,
      acceptTypes: '.pdf,image/*',
      maxFileSizeMB: 25,
      maxTotalMB: 80
    }
  },
  methods: {
    sendPrompt(prompt) {
      this.messages.push({ sender: "Você", text: prompt.text, attachments: [] })
    },
    triggerFileDialog() {
      this.$refs.fileInput?.click()
    },
    onFilesSelected(e) {
      const files = Array.from(e.target.files || [])
      if (!files.length) return
      this.addAttachments(files)
      e.target.value = ''
    },
    handleDrop(e) {
      this.isDragging = false
      const files = Array.from(e.dataTransfer.files || [])
      if (!files.length) return
      this.addAttachments(files)
    },
    addAttachments(files) {
      const maxFile = this.maxFileSizeMB * 1024 * 1024
      const maxTotal = this.maxTotalMB * 1024 * 1024
      let total = this.attachments.reduce((a, b) => a + b.size, 0)
      const toAdd = []

      for (const f of files) {
        if (f.size > maxFile) { alert(`Arquivo grande: ${f.name}`); continue }
        if (total + f.size > maxTotal) { alert(`Limite total excedido`); break }
        const item = { file: f, name: f.name, size: f.size, type: f.type, preview: null }
        if (f.type.startsWith('image/')) item.preview = URL.createObjectURL(f)
        toAdd.push(item)
        total += f.size
      }

      if (toAdd.length) this.attachments.push(...toAdd)
    },
    removeAttachment(i) {
      const it = this.attachments[i]
      if (it?.preview) URL.revokeObjectURL(it.preview)
      this.attachments.splice(i, 1)
    },
    async sendMessage() {
      if (!this.currentMessage.trim() && this.attachments.length === 0) return

      // adiciona no chat local
      this.messages.push({
        sender: "Você",
        text: this.currentMessage.trim(),
        attachments: this.attachments.map(a => ({
          name: a.name, size: a.size, type: a.type, preview: a.preview || null
        }))
      })

      // exemplo de envio
      try {
        const form = new FormData()
        form.append('message', this.currentMessage.trim())
        this.attachments.forEach(a => form.append('files[]', a.file, a.name))
        // await axios.post(`${import.meta.env.VITE_API_BASE_URL}/chat/upload`, form)
      } catch (e) {
        alert('Falha ao enviar')
        console.error(e)
      } finally {
        this.currentMessage = ''
        this.attachments.forEach(a => a.preview && URL.revokeObjectURL(a.preview))
        this.attachments = []
      }
    },
    formatBytes(b) {
      if (!b) return '0 B'
      const k = 1024, s = ['B','KB','MB','GB'], i = Math.floor(Math.log(b)/Math.log(k))
      return (b/Math.pow(k,i)).toFixed(2) + ' ' + s[i]
    }
  },
  beforeUnmount() {
    this.attachments.forEach(a => a.preview && URL.revokeObjectURL(a.preview))
  }
}
</script>

<style scoped>
/* layout */
.chat-card { height: 85vh; display: flex; flex-direction: column; }
.chat-messages {
  flex: 1; overflow-y: auto; padding: 1rem; position: relative;
  border: 2px dashed transparent; transition: border-color .2s, background-color .2s;
}
.chat-messages.dragging { border-color: #0d6efd; background-color: rgba(13,110,253,.06); }
.drop-hint { position: absolute; inset: 0; display: grid; place-items: center; font-weight: 600; color: #0d6efd; }

/* entrada fixa ao rodapé do card */
.chat-input { position: sticky; bottom: 0; background: #f8f9fa; }

/* prompts */
.prompt-list { height: calc(85vh - 56px); overflow: auto; }
.prompt-btn {
  border-radius: 999px;
  padding: .6rem .9rem;
  font-weight: 600;
  background: rgba(255,255,255,.08);
  backdrop-filter: blur(2px);
}
.prompt-btn:hover { background: rgba(255,255,255,.15) }

/* anexos */
.attachment-chip {
  display: inline-flex; align-items: center; background:#eef2f7; color:#212529;
  border-radius: 16px; padding: 4px 10px;
}
.chip-thumb { width: 20px; height: 20px; object-fit: cover; border-radius: 4px; }
.attachment-pill { background:#f1f3f5; border-radius:12px; padding:6px 10px; }
.thumb { width:36px; height:36px; object-fit:cover; border-radius:6px; }
</style>
