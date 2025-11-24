<template>
  <b-container fluid class="py-3 notificacoes-board">
    <b-row class="gx-3 gy-3">
      <!-- COLUNA ESQUERDA (tabs + lista) -->
      <b-col cols="12" md="6">
        <!-- Tabs -->
        <div class="tabs-strip d-flex">
          <button class="tab-btn" :class="{ active: aba === 'lido' }" @click="aba = 'lido'">Lido</button>
          <button class="tab-btn" :class="{ active: aba === 'nao' }" @click="aba = 'nao'">Não Lido</button>
        </div>

        <!-- Lista -->
        <div class="list-wrapper mt-2">
          <b-card
            v-for="p in postsFiltrados"
            :key="p.id"
            class="post-item mb-3 clickable"
            @click="selecionar(p)"
          >
            <div class="d-flex align-items-center">
              <img v-if="p.thumb" :src="p.thumb" class="thumb me-3" alt="thumb" />
              <div class="flex-fill">
                <div class="d-flex justify-content-between align-items-start">
                  <h5 class="mb-1 fw-semibold">{{ p.titulo }}</h5>
                  <b-badge :variant="p.lido ? 'success' : 'warning'">
                    {{ p.lido ? 'Lido' : 'Não lido' }}
                  </b-badge>
                </div>
                <small class="text-muted d-block mb-1">{{ formatDate(p.data) }}</small>
                <p class="mb-0 line-clamp-2">{{ p.resumo }}</p>
              </div>
            </div>
          </b-card>

          <div v-if="postsFiltrados.length === 0" class="text-center text-muted py-5">
            Nenhuma publicação {{ aba === 'lido' ? 'lida' : 'não lida' }}.
          </div>
        </div>

        <!-- Botão adicionar (abre o PublicarModal via ref exposta) -->
        <div class="d-flex justify-content-end mt-3">
          <b-button
            variant="primary"
            @click="$refs.pubModal.show = true"
            title="Adicionar publicação"
          >
            Novo
          </b-button>
        </div>
      </b-col>


  <!-- <b-button variant="primary">Primary</b-button> -->


      <!-- COLUNA DIREITA (destaque + comentários) -->
      <b-col cols="12" md="6">
        <b-card class="destaque">
          <template v-if="selecionado">
            <div class="d-flex gap-3 flex-wrap align-items-center">
              <img :src="selecionado.foto" class="avatar" alt="avatar" />
              <div>
                <h5 class="mb-1 fw-bold">{{ selecionado.titulo }}</h5>
                <div class="text-info fw-semibold mb-1" v-if="selecionado.subtitulo">
                  {{ selecionado.subtitulo }}
                </div>
                <small class="text-muted">{{ formatDate(selecionado.data) }}</small>
              </div>
            </div>

            <b-card class="mt-3 inner-card">
              <!-- Se quiser renderizar HTML rico do Quill -->
              <div v-html="selecionado.textoHtml || selecionado.texto"></div>
            </b-card>

            <b-card class="mt-3 inner-card">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Comentários ({{ selecionado.comentarios.length }})</h6>
                <b-button
                  size="sm"
                  :variant="selecionado.lido ? 'secondary' : 'success'"
                  @click="toggleLido(selecionado)"
                >
                  {{ selecionado.lido ? 'Marcar como Não lido' : 'Marcar como Lido' }}
                </b-button>
              </div>

              <div v-if="selecionado.comentarios.length === 0" class="text-muted mb-3">
                Ainda não há comentários.
              </div>

              <div v-else class="mb-3">
                <div v-for="(c, i) in selecionado.comentarios" :key="i" class="comentario mb-3">
                  <div class="fw-semibold">{{ c.autor }}</div>
                  <div class="small text-muted">{{ formatDate(c.data) }}</div>
                  <div class="mt-1">{{ c.texto }}</div>
                </div>
              </div>

              <b-form @submit.prevent="addComentario">
                <b-form-textarea v-model="novoComentario" rows="3" placeholder="Escreva um comentário..." />
                <div class="d-flex justify-content-end mt-2">
                  <b-button size="sm" variant="primary" type="submit" :disabled="!novoComentario.trim()">
                    Comentar
                  </b-button>
                </div>
              </b-form>
            </b-card>
          </template>

          <template v-else>
            <div class="text-center text-muted py-5">
              Selecione uma publicação na lista ao lado.
            </div>
          </template>
        </b-card>
      </b-col>
    </b-row>

    <!-- MODAL: componente reutilizável -->
    <PublicarModal ref="pubModal" @publicado="handlePublicado" />
  </b-container>
</template>

<script>
import PublicarModal from './components/PublicarModal.vue'

export default {
  name: 'Comunicados',
  components: { PublicarModal },
  data() {
    return {
      aba: 'nao',
      posts: [
        {
          id: 1,
          lido: false,
          titulo: 'Entrada de Novo Colaborador',
          subtitulo: 'Brenda Nunes • Consulting',
          resumo: 'Anunciamos a chegada de Brenda ao time Tax.',
          texto: 'É com grande satisfação que anunciamos a chegada de Brenda Nunes à Attentive...',
          textoHtml: '', // quando vier do Quill
          data: new Date(),
          thumb: 'https://media.licdn.com/dms/image/v2/D4D03AQEntibUuTl5Vw/profile-displayphoto-crop_800_800/B4DZpgpVCaIEAI-/0/1762558039164?e=1764201600&v=beta&t=GI3Sc9RVOaQAx3M4dMMqwWu5mLL4tVgYkoEDqH8ES5M',
          foto: 'https://media.licdn.com/dms/image/v2/D4D03AQEntibUuTl5Vw/profile-displayphoto-crop_800_800/B4DZpgpVCaIEAI-/0/1762558039164?e=1764201600&v=beta&t=GI3Sc9RVOaQAx3M4dMMqwWu5mLL4tVgYkoEDqH8ES5M',
          comentarios: [],
        },
      ],
      selecionado: null,
      novoComentario: '',
    }
  },
  computed: {
    postsFiltrados() {
      return this.posts
        .filter(p => (this.aba === 'lido' ? p.lido : !p.lido))
        .sort((a, b) => b.data - a.data)
    },
  },
  methods: {
    selecionar(p) {
      this.selecionado = p
    },
    toggleLido(p) {
      p.lido = !p.lido
    },
    addComentario() {
      if (!this.selecionado || !this.novoComentario.trim()) return
      this.selecionado.comentarios.push({
        autor: 'Colaborador',
        data: new Date(),
        texto: this.novoComentario.trim(),
      })
      this.novoComentario = ''
    },
    handlePublicado(payload) {
      // payload do PublicarModal: { titulo, subtitulo, conteudo (HTML), fotoUrl }
      const id = Math.max(0, ...this.posts.map(p => p.id)) + 1
      const textoHtml = (payload.conteudo || '').trim()
      const textoPlano = this.stripHtml(textoHtml)
      const post = {
        id,
        lido: false,
        titulo: (payload.titulo || '').trim(),
        subtitulo: (payload.subtitulo || '').trim(),
        resumo: textoPlano.slice(0, 120) + (textoPlano.length > 120 ? '...' : ''),
        texto: textoPlano,
        textoHtml,                         // preserva HTML do Quill para exibir rico
        data: new Date(),
        thumb: 'https://picsum.photos/seed/new/96/64',
        foto: payload.fotoUrl || 'https://picsum.photos/seed/new2/240/240',
        comentarios: [],
      }
      this.posts.unshift(post)
      this.selecionado = post
      this.aba = 'nao'
    },
    stripHtml(html) {
      const tmp = document.createElement('div')
      tmp.innerHTML = html
      return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim()
    },
    formatDate(d) {
      const date = d instanceof Date ? d : new Date(d)
      return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
    },
  },
  mounted() {
    this.selecionado = this.posts.find(p => !p.lido) || this.posts[0] || null
  },
}
</script>

<style scoped>
.notificacoes-board {
  background: #0e1a36;
  color: #fff;
  min-height: calc(100vh - 120px);
}

/* Tabs */
.tabs-strip { gap: 8px; }
.tab-btn {
  flex: 1;
  background: #1b1b4a;
  color: #fff;
  border: 0;
  padding: 10px 12px;
  font-weight: 700;
  border-radius: 4px 4px 0 0;
  opacity: 0.6;
  transition: background 0.2s, opacity 0.2s;
}
.tab-btn.active { background: #2c2c7a; opacity: 1; }

/* Lista de posts */
.list-wrapper {
  background: #0f1843;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 12px;
  max-height: 60vh;
  overflow: auto;
}
.post-item {
  background: #1a2759;
  border: none;
  border-radius: 12px;
  color: #fff;
  transition: 0.2s;
  box-shadow: 0 3px 10px rgba(0,0,0,0.15);
}
.post-item:hover { filter: brightness(1.1); transform: scale(1.01); }
.thumb { width: 96px; height: 64px; object-fit: cover; border-radius: 8px; }
.line-clamp-2 { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; overflow: hidden; }

/* Botão “+” */
.btn-plus {
  width: 52px; height: 52px; border-radius: 12px; font-size: 28px;
  border: 2px solid rgba(255,255,255,.6); color: #fff; background: transparent;
  transition: all 0.2s;
}
.btn-plus:hover { background: #ffffff22; border-color: #fff; }

/* Card de destaque */
.destaque {
  background: #101b4f;
  border: 2px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  color: #fff;
  box-shadow: 0 3px 10px rgba(0,0,0,0.15);
}
.avatar {
  width: 120px; height: 120px; border-radius: 60px; object-fit: cover;
  border: 3px solid rgba(255,255,255,0.15);
}
.inner-card { background: #182a6d; border: none; color: #fff; border-radius: 16px; }
.comentario { background: rgba(255,255,255,0.05); border-radius: 10px; padding: 10px; }
</style>
