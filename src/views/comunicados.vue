<template>
  <b-container fluid class="py-3 notificacoes-board">
    <b-row class="gx-3 gy-3">
      <!-- COLUNA ESQUERDA (tabs + lista) -->
      <b-col cols="12" md="6">
        <!-- Abas por tipo de publicação -->
        <div class="tabs-strip d-flex flex-wrap">
          <button
            class="tab-btn"
            :class="{ active: tipoFiltro === 'all' }"
            @click="tipoFiltro = 'all'"
          >
            <span class="tab-title">Todos</span>
            <span class="tab-counts">
              <span class="count-pill nv">{{ countsByTipo.all.naoVisualizados }}</span>
              <span class="count-pill vz">{{ countsByTipo.all.visualizados }}</span>
              <span class="count-pill ld">{{ countsByTipo.all.lidos }}</span>
            </span>
          </button>

          <button
            class="tab-btn"
            :class="{ active: tipoFiltro === 'new_hire' }"
            @click="tipoFiltro = 'new_hire'"
          >
            <span class="tab-title">Boas-vindas (RH)</span>
            <span class="tab-counts">
              <span class="count-pill nv">{{ countsByTipo.new_hire.naoVisualizados }}</span>
              <span class="count-pill vz">{{ countsByTipo.new_hire.visualizados }}</span>
              <span class="count-pill ld">{{ countsByTipo.new_hire.lidos }}</span>
            </span>
          </button>

          <button
            class="tab-btn"
            :class="{ active: tipoFiltro === 'farewell' }"
            @click="tipoFiltro = 'farewell'"
          >
            <span class="tab-title">Boas-vindas / Até breve</span>
            <span class="tab-counts">
              <span class="count-pill nv">{{ countsByTipo.farewell.naoVisualizados }}</span>
              <span class="count-pill vz">{{ countsByTipo.farewell.visualizados }}</span>
              <span class="count-pill ld">{{ countsByTipo.farewell.lidos }}</span>
            </span>
          </button>

          <button
            class="tab-btn"
            :class="{ active: tipoFiltro === 'congrats' }"
            @click="tipoFiltro = 'congrats'"
          >
            <span class="tab-title">Congratulações</span>
            <span class="tab-counts">
              <span class="count-pill nv">{{ countsByTipo.congrats.naoVisualizados }}</span>
              <span class="count-pill vz">{{ countsByTipo.congrats.visualizados }}</span>
              <span class="count-pill ld">{{ countsByTipo.congrats.lidos }}</span>
            </span>
          </button>

          <button
            class="tab-btn"
            :class="{ active: tipoFiltro === 'highlight' }"
            @click="tipoFiltro = 'highlight'"
          >
            <span class="tab-title">Avisos Importantes</span>
            <span class="tab-counts">
              <span class="count-pill nv">{{ countsByTipo.highlight.naoVisualizados }}</span>
              <span class="count-pill vz">{{ countsByTipo.highlight.visualizados }}</span>
              <span class="count-pill ld">{{ countsByTipo.highlight.lidos }}</span>
            </span>
          </button>

          <button
            class="tab-btn"
            :class="{ active: tipoFiltro === 'general' }"
            @click="tipoFiltro = 'general'"
          >
            <span class="tab-title">Comunicados Gerais</span>
            <span class="tab-counts">
              <span class="count-pill nv">{{ countsByTipo.general.naoVisualizados }}</span>
              <span class="count-pill vz">{{ countsByTipo.general.visualizados }}</span>
              <span class="count-pill ld">{{ countsByTipo.general.lidos }}</span>
            </span>
          </button>

          <button
            class="tab-btn"
            :class="{ active: tipoFiltro === 'mural' }"
            @click="tipoFiltro = 'mural'"
          >
            <span class="tab-title">Mural</span>
            <span class="tab-counts">
              <span class="count-pill nv">{{ countsByTipo.mural.naoVisualizados }}</span>
              <span class="count-pill vz">{{ countsByTipo.mural.visualizados }}</span>
              <span class="count-pill ld">{{ countsByTipo.mural.lidos }}</span>
            </span>
          </button>
        </div>

        <!-- Filtros e busca -->
        <div class="d-flex align-items-center gap-2 mt-2">
          <b-form-input
            v-model="q"
            size="sm"
            placeholder="Buscar por título ou conteúdo..."
            @keyup.enter="fetch(true)"
          />
          <b-button size="sm" variant="primary" @click="fetch(true)">Buscar</b-button>
          <b-form-checkbox v-model="expand" size="sm" switch>Expandido</b-form-checkbox>
        </div>

        <!-- Lista -->
        <div class="list-wrapper mt-2">
          <b-alert v-if="error" variant="danger" show class="mb-3">{{ error }}</b-alert>
          <div v-if="loading" class="text-center text-muted py-4">Carregando…</div>

          <b-card
            v-for="p in postsFiltrados"
            :key="p.id"
            class="post-item mb-3 clickable"
            :class="tipoMap[p.tipo]?.class || 'post-type-general'"
            @click="selecionar(p)"
          >
            <div class="d-flex align-items-center">
              <img v-if="p.thumb" :src="p.thumb" class="thumb me-3" alt="thumb" />
              <div class="flex-fill">
                <div class="d-flex justify-content-between align-items-start">
                  <h5 class="mb-1 fw-semibold">{{ p.titulo }}</h5>

                  <!-- Badge Lido / Visualizado / Não visualizado -->
                  <b-badge
                    :variant="p.lido ? 'success' : (p.visualizado ? 'info' : 'warning')"
                  >
                    {{ p.lido ? 'Lido' : (p.visualizado ? 'Visualizado' : 'Não visualizado') }}
                  </b-badge>
                </div>

                <small class="text-muted d-block mb-1">{{ formatDate(p.data) }}</small>
                <p class="mb-1 line-clamp-2">{{ p.resumo }}</p>
                <small class="text-tipo" :class="tipoMap[p.tipo]?.class">
                  {{ tipoMap[p.tipo]?.label || 'Comunicado' }}
                </small>
              </div>
            </div>
          </b-card>

          <div v-if="!loading && postsFiltrados.length === 0" class="text-center text-muted py-5">
            Nenhuma publicação para este tipo.
          </div>

          <div class="d-flex justify-content-center my-3" v-if="hasMore && !loading">
            <b-button variant="outline-primary" @click="loadMore">Carregar mais</b-button>
          </div>
        </div>

        <!-- Botão adicionar -->
        <div class="d-flex justify-content-end mt-3">
          <b-button
            variant="primary"
            @click="$refs.pubModal && ($refs.pubModal.show = true)"
            title="Adicionar publicação"
          >
            Novo
          </b-button>
        </div>
      </b-col>

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
                <small class="text-muted d-block">{{ formatDate(selecionado.data) }}</small>
                <div class="mt-1">
                  <b-badge
                    pill
                    class="badge-tipo"
                    :class="tipoMap[selecionado.tipo]?.class"
                  >
                    {{ tipoMap[selecionado.tipo]?.label || 'Comunicado' }}
                  </b-badge>
                </div>
              </div>
            </div>

            <b-card class="mt-3 inner-card">
              <div v-if="selecionado.textoHtml" v-html="selecionado.textoHtml"></div>
              <div v-else>{{ selecionado.texto }}</div>
            </b-card>

            <b-card class="mt-3 inner-card">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Comentários ({{ selecionado.comentarios.length }})</h6>

                <b-button
                  size="sm"
                  :variant="selecionado.lido ? 'secondary' : 'success'"
                  @click="toggleLido(selecionado)"
                >
                  {{ selecionado.lido ? 'Marcar como não visualizado' : 'Marcar como lido' }}
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
                <b-form-textarea
                  v-model="novoComentario"
                  rows="3"
                  placeholder="Escreva um comentário..."
                />
                <div class="d-flex justify-content-end mt-2">
                  <b-button
                    size="sm"
                    variant="primary"
                    type="submit"
                    :disabled="!novoComentario.trim() || comentarioLoading"
                  >
                    <span v-if="!comentarioLoading">Comentar</span>
                    <span v-else>Enviando…</span>
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

    <PublicarModal ref="pubModal" @publicado="handlePublicado" />
  </b-container>
</template>

<script>
import PublicarModal from './components/PublicarModal.vue'
import { listarComunicados } from '@/services/comunicados'
import { api } from '@/services/api'
import { getStoredUser } from '@/core/services/auth.service'

const LIDOS_KEY = 'comunicados_lidos_v1'
const VIS_KEY = 'comunicados_visualizados_v1'

export default {
  name: 'Comunicados',
  components: { PublicarModal },
  data() {
    return {
      tipoFiltro: 'all',
      posts: [],
      selecionado: null,
      novoComentario: '',
      comentarioLoading: false,

      q: '',
      expand: true,
      status: 'published',
      limit: 12,
      skip: 0,
      hasMore: false,
      loading: false,
      error: '',

      tipoMap: {
        general:   { label: 'Comunicado geral',        class: 'post-type-general' },
        highlight:{ label: 'Aviso de destaque',       class: 'post-type-highlight' },
        mural:    { label: 'Mural de recados',        class: 'post-type-mural' },
        congrats: { label: 'Congratulações',          class: 'post-type-congrats' },
        farewell: { label: 'Boas-vindas / Até breve', class: 'post-type-farewell' },
        new_hire: { label: 'Boas-vindas (RH)',        class: 'post-type-farewell' }
      }
    }
  },

  computed: {
    postsFiltrados() {
      return this.posts
        .filter((p) => this.tipoFiltro === 'all' ? true : p.tipo === this.tipoFiltro)
        .sort((a, b) => b.data - a.data)
    },

    countsByTipo() {
      const tipos = ['all', 'new_hire', 'farewell', 'congrats', 'highlight', 'general', 'mural']
      const base = {}
      tipos.forEach(t => {
        base[t] = { naoVisualizados: 0, visualizados: 0, lidos: 0 }
      })

      const pushCount = (t, p) => {
        if (p.lido) base[t].lidos++
        else if (p.visualizado) base[t].visualizados++
        else base[t].naoVisualizados++
      }

      this.posts.forEach(p => {
        pushCount('all', p)
        if (base[p.tipo]) pushCount(p.tipo, p)
      })

      return base
    }
  },

  methods: {
    // ✅ garante que datas "naive" sejam tratadas como UTC
    parseDateUtc(value) {
      if (!value) return new Date()
      if (value instanceof Date) return value

      const s = String(value)
      const hasTZ = /Z$|[+-]\d{2}:\d{2}$/.test(s)
      return new Date(hasTZ ? s : s + 'Z')
    },

    _getSetLidos() {
      try {
        const raw = localStorage.getItem(LIDOS_KEY)
        return new Set(raw ? JSON.parse(raw) : [])
      } catch {
        return new Set()
      }
    },
    _saveSetLidos(set) {
      try { localStorage.setItem(LIDOS_KEY, JSON.stringify(Array.from(set))) } catch {}
    },

    _getSetVisualizados() {
      try {
        const raw = localStorage.getItem(VIS_KEY)
        return new Set(raw ? JSON.parse(raw) : [])
      } catch {
        return new Set()
      }
    },
    _saveSetVisualizados(set) {
      try { localStorage.setItem(VIS_KEY, JSON.stringify(Array.from(set))) } catch {}
    },

    stripHtml(html) {
      const tmp = document.createElement('div')
      tmp.innerHTML = html || ''
      return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim()
    },

    mapApiToPost(item) {
      const autorNome = item.autor?.nome
        ? `${item.autor.nome}${item.autor.sobrenome ? ' ' + item.autor.sobrenome : ''}`
        : 'Attentive'
      const autorDepto = item.autor?.departamento || 'administrativo'
      const targetNome = item.target_user?.nome
        ? `${item.target_user.nome}${item.target_user.sobrenome ? ' ' + item.target_user.sobrenome : ''}`
        : ''

      const subtitulo =
        item.tipo === 'new_hire' && targetNome
          ? `${targetNome} • ${item.target_user?.departamento || ''}`.trim()
          : `${autorNome} • ${autorDepto}`

      const conteudoHtml = (item.conteudo_html || item.conteudo || '').toString()
      const textoPlano = this.stripHtml(conteudoHtml)
      const resumo =
        textoPlano.length > 160 ? `${textoPlano.slice(0, 160)}…` : textoPlano

      const fotoPreferida =
        item.imagem ||
        item.target_user?.avatar_url ||
        item.autor?.avatar_url ||
        'https://picsum.photos/seed/attentive/240/240'
      const thumb =
        item.imagem || item.target_user?.avatar_url || item.autor?.avatar_url || ''

      const lidos = this._getSetLidos()
      const vistos = this._getSetVisualizados()

      const lido = lidos.has(item.id)
      const visualizado = lido || vistos.has(item.id)

      const comentarios = (item.comentarios || []).map((c) => ({
        autor:
          c.autor_nome ||
          c.autor?.nome ||
          (c.autor?.first_name
            ? `${c.autor.first_name} ${c.autor.last_name || ''}`.trim()
            : null) ||
          'Colaborador',
        data: this.parseDateUtc(c.created_at || c.data),
        texto: c.texto || '',
      }))

      return {
        id: item.id,
        tipo: item.tipo || 'general',
        lido,
        visualizado,
        titulo: item.titulo || 'Comunicado',
        subtitulo,
        resumo,
        texto: textoPlano,
        textoHtml: conteudoHtml,
        data: this.parseDateUtc(item.created_at || item.updated_at),
        thumb,
        foto: fotoPreferida,
        comentarios,
      }
    },

    async fetch(reset) {
      try {
        this.loading = true
        this.error = ''
        if (reset) {
          this.skip = 0
          this.posts = []
        }
        const data = await listarComunicados({
          status: this.status,
          q: this.q || undefined,
          expand: this.expand,
          limit: this.limit,
          skip: this.skip,
        })
        const mapped = (data || []).map(this.mapApiToPost)
        this.posts = reset ? mapped : this.posts.concat(mapped)
        this.hasMore = mapped.length === this.limit

        if (!this.selecionado && this.posts.length) {
          const prefer = this.posts.find((p) => !p.lido) || this.posts[0]
          this.selecionado = prefer
        }
      } catch (e) {
        console.error(e)
        this.error = 'Não foi possível carregar os comunicados.'
      } finally {
        this.loading = false
      }
    },

    loadMore() {
      this.skip += this.limit
      this.fetch(false)
    },

    selecionar(p) {
      this.selecionado = p
      if (p.lido) return

      const set = this._getSetVisualizados()
      if (!set.has(p.id)) {
        set.add(p.id)
        p.visualizado = true
        this._saveSetVisualizados(set)
      }
    },

    toggleLido(p) {
      const lidos = this._getSetLidos()
      const vistos = this._getSetVisualizados()

      if (p.lido) {
        lidos.delete(p.id)
        vistos.delete(p.id)
        p.lido = false
        p.visualizado = false
      } else {
        lidos.add(p.id)
        vistos.add(p.id)
        p.lido = true
        p.visualizado = true
      }

      this._saveSetLidos(lidos)
      this._saveSetVisualizados(vistos)
    },

    async addComentario() {
      if (!this.selecionado || !this.novoComentario.trim()) return

      const texto = this.novoComentario.trim()

      const me = getStoredUser()
      const autorNome =
        me?.nome
          ? `${me.nome}${me.sobrenome ? ' ' + me.sobrenome : ''}`
          : (me?.razao_social || 'Colaborador')

      const autorId = me?.id || me?._id || null

      try {
        this.comentarioLoading = true

        const { data } = await api.post(
          `/api/v1/comunicados/${this.selecionado.id}/comentarios`,
          { texto, autor_nome: autorNome, autor_id: autorId }
        )

        const autorBackend = (data?.autor_nome || '').trim()
        const autorFinal =
          autorBackend && autorBackend.toLowerCase() !== 'colaborador'
            ? autorBackend
            : autorNome

        const comentario = {
          autor: autorFinal,
          data: this.parseDateUtc(data.created_at || new Date()),
          texto: data.texto || texto,
        }

        this.selecionado.comentarios.push(comentario)
        this.novoComentario = ''
      } catch (e) {
        console.error(e)
        this.$bvToast && this.$bvToast.toast('Não foi possível enviar o comentário.', {
          title: 'Erro',
          variant: 'danger',
          solid: true,
        })
      } finally {
        this.comentarioLoading = false
      }
    },

    handlePublicado(payload) {
      const textoHtml = (payload.conteudo || '').trim()
      const textoPlano = this.stripHtml(textoHtml)
      const resumo =
        textoPlano.length > 160 ? `${textoPlano.slice(0, 160)}…` : textoPlano

      const id = payload.id || `local-${Date.now()}`

      const post = {
        id,
        tipo: payload.tipo || 'general',
        lido: false,
        visualizado: false,
        titulo: (payload.titulo || '').trim(),
        subtitulo: (payload.subtitulo || '').trim(),
        resumo,
        texto: textoPlano,
        textoHtml,
        data: new Date(),
        thumb: payload.fotoUrl || 'https://picsum.photos/seed/new/96/64',
        foto: payload.fotoUrl || 'https://picsum.photos/seed/new2/240/240',
        comentarios: [],
      }

      this.posts.unshift(post)
      this.selecionado = post
      this.tipoFiltro = 'all'
    },

    // ✅ fuso de SP no front
    formatDate(d) {
      const date = d instanceof Date ? d : this.parseDateUtc(d)
      return date.toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'America/Sao_Paulo'
      })
    },
  },

  mounted() {
    this.fetch(true)
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
.tabs-strip {
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  flex-wrap: nowrap;
}
.tab-btn {
  position: relative;
  flex: 0 0 auto;
  background: #1b1b4a;
  color: #fff;
  border: 0;
  padding: 10px 12px;
  font-weight: 700;
  border-radius: 4px 4px 0 0;
  opacity: 0.6;
  transition: background 0.2s, opacity 0.2s;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.tab-btn.active {
  background: #2c2c7a;
  opacity: 1;
}
.tab-title { display: inline-block; }
.tab-counts {
  display: inline-flex;
  gap: 6px;
  margin-left: 6px;
}

/* 3 bolinhas */
.count-pill {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  font-size: 0.72rem;
  line-height: 20px;
  text-align: center;
  font-weight: 800;
  display: inline-block;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
}
.count-pill.nv { color: #facc15; }
.count-pill.vz { color: #60a5fa; }
.count-pill.ld { color: #34d399; }

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
  border-radius: 12px;
  color: #fff;
  transition: 0.2s;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  border-left: 4px solid transparent;
}
.post-item:hover {
  filter: brightness(1.1);
  transform: scale(1.01);
}
.thumb {
  width: 96px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.text-tipo {
  display: inline-block;
  margin-top: 2px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Cores por tipo */
.post-type-general { border-left-color: #6366f1; }
.post-type-general .text-tipo,
.badge-tipo.post-type-general { color: #a5b4fc; }

.post-type-highlight { border-left-color: #facc15; }
.post-type-highlight .text-tipo,
.badge-tipo.post-type-highlight { color: #facc15; }

.post-type-mural { border-left-color: #10b981; }
.post-type-mural .text-tipo,
.badge-tipo.post-type-mural { color: #6ee7b7; }

.post-type-congrats { border-left-color: #ec4899; }
.post-type-congrats .text-tipo,
.badge-tipo.post-type-congrats { color: #f9a8d4; }

.post-type-farewell { border-left-color: #f97316; }
.post-type-farewell .text-tipo,
.badge-tipo.post-type-farewell { color: #fed7aa; }

/* Card de destaque */
.destaque {
  background: #101b4f;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}
.avatar {
  width: 120px;
  height: 120px;
  border-radius: 60px;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.15);
}
.inner-card {
  background: #182a6d;
  border: none;
  color: #fff;
  border-radius: 16px;
}
.comentario {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 10px;
}

.badge-tipo {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 999px;
  font-weight: 600;
}

.gap-2 { gap: 0.5rem; }

.comentario .text-muted {
  color: rgba(255, 255, 255, 0.75) !important;
}
</style>
