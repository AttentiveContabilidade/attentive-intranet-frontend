<template>
  <div class="bg-deep text-light min-vh-100">
    <div class="container-fluid px-4 py-4">
      <h4 class="mb-3 d-flex align-items-center justify-content-between">
        <span>Automação — Tax (CND)</span>
        <button class="btn btn-outline-light btn-sm" @click="openPreventModal">Prevenção</button>
      </h4>

      <!-- Ações em Lote -->
      <div class="d-flex justify-content-end align-items-center gap-2 mb-2">
        <span class="fw-semibold small">Ações em Lote:</span>
        <select v-model="batchAction" class="form-select form-select-sm w-auto">
          <option value="reprocessar_ok">Reprocessamento Selecionado(s) - Com Estabilidade</option>
          <option value="reprocessar_instab">Reprocessamento Selecionado(s) - Com Instabilidade</option>
          <option value="parar">Parar robô p/ Selecionados</option>
          <option value="limpar_alertas">Limpar alertas</option>
        </select>
        <button class="btn btn-sm btn-secondary" @click="runBatch">Executar</button>
      </div>

      <!-- Tabela -->
      <div class="table-shell shadow">
        <div class="table-scroll">
          <table class="table table-sm align-middle mb-0 table-darkish">
            <thead>
              <tr>
                <th class="w-1">
                  <input type="checkbox" class="form-check-input" :checked="allChecked" @change="toggleAll($event)" />
                </th>
                <th class="text-center" style="width:110px">Código</th>
                <th class="text-start" style="min-width:320px">Razão Social</th>
                <th class="text-center" style="width:200px">CNPJ</th>
                <th class="text-nowrap text-center" style="min-width:180px">Situação Federal</th>
                <th class="text-nowrap text-center" style="min-width:180px">Situação Estadual</th>
                <th class="text-nowrap text-center" style="min-width:180px">Situação Municipal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(emp, i) in rows" :key="emp.rowKey || i" :class="{'row-muted': emp.ativo === false}">
                <td>
                  <input type="checkbox" class="form-check-input" v-model="selectedIds" :value="emp.rowKey || i" />
                </td>
                <td class="text-center text-mono">{{ emp.cod_empresa || '—' }}</td>
                <td class="fw-semibold text-start">{{ emp.nome_razao_social || '—' }}</td>
                <td class="text-mono">{{ fmtCNPJ(emp.cnpj) }}</td>

                <!-- FLAGS -->
                <td class="text-center">
                  <img v-if="getIcon(emp.federal)" :src="getIcon(emp.federal)" :alt="emp.federal" class="status-icon" />
                  <span v-else class="fallback">?</span>
                </td>
                <td class="text-center">
                  <img v-if="getIcon(emp.estadual)" :src="getIcon(emp.estadual)" :alt="emp.estadual" class="status-icon" />
                  <span v-else class="fallback">?</span>
                </td>
                <td class="text-center">
                  <img v-if="getIcon(emp.municipal)" :src="getIcon(emp.municipal)" :alt="emp.municipal" class="status-icon" />
                  <span v-else class="fallback">?</span>
                </td>
              </tr>

              <tr v-if="!loading && !rows.length">
                <td colspan="7" class="text-center py-5 text-muted">Nenhum registro encontrado.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Rodapé -->
      <div class="mt-3 small text-muted d-flex gap-3">
        <span v-if="loading">Carregando…</span>
        <span v-else>Atualizado: {{ lastUpdated || '—' }}</span>
        <span v-if="error" class="text-danger">Erro: {{ error }}</span>
        <span class="ms-auto">{{ selectedIds.length }} selecionado(s) — {{ rows.length }} no total</span>
      </div>
    </div>

    <!-- ===================== MODAL PREVENÇÃO ===================== -->
    <div v-if="preventModalOpen" class="modal-backdrop">
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="preventTitle">
        <div class="modal-header">
          <h5 id="preventTitle" class="mb-0">Prevenção — Agendar Crawlers</h5>
          <button class="btn btn-sm btn-outline-light" @click="closePreventModal">✕</button>
        </div>

        <div class="modal-body">
          <p class="text-muted small mb-3">
            Defina a data de referência para cada esfera. Selecione linhas na tabela para aplicar só a elas; sem seleção, aplica a todas.
          </p>

          <div class="row g-3">
            <div class="col-12 col-md-4">
              <label class="form-label">Situação Municipal</label>
              <input v-model="preventDates.municipal" type="date" class="form-control form-control-sm" />
            </div>
            <div class="col-12 col-md-4">
              <label class="form-label">Situação Estadual</label>
              <input v-model="preventDates.estadual" type="date" class="form-control form-control-sm" />
            </div>
            <div class="col-12 col-md-4">
              <label class="form-label">Situação Federal</label>
              <input v-model="preventDates.federal" type="date" class="form-control form-control-sm" />
            </div>
          </div>

          <div class="form-check mt-3">
            <input class="form-check-input" type="checkbox" id="applyToAll" v-model="preventApplyAll" :disabled="selectedIds.length===0">
            <label class="form-check-label" for="applyToAll">
              Aplicar às selecionadas ({{ selectedIds.length }}) &nbsp;
              <span v-if="selectedIds.length===0" class="text-muted">(sem seleção, aplica a todas)</span>
            </label>
          </div>

          <div v-if="preventError" class="alert alert-danger py-2 px-3 mt-3">{{ preventError }}</div>
          <div v-if="preventSuccess" class="alert alert-success py-2 px-3 mt-3">{{ preventSuccess }}</div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline-light" @click="closePreventModal">Cancelar</button>
          <button class="btn btn-primary" :disabled="savingPrevent" @click="applyPrevention">
            {{ savingPrevent ? 'Aplicando…' : 'Aplicar' }}
          </button>
        </div>
      </div>
    </div>
    <!-- =================== /MODAL PREVENÇÃO =================== -->
  </div>
</template>

<script>
import axios from 'axios'

const ICONS = {
  regular:  new URL('../../assets/regular.png',  import.meta.url).href,
  irregular:new URL('../../assets/irregular.png',import.meta.url).href,
  erro:     new URL('../../assets/erro.png',     import.meta.url).href,
}

const API_BASE   = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'
const PAGE_LIMIT = 200
const pick = (obj, ...keys) => { for (const k of keys) if (obj && obj[k] != null) return obj[k]; return undefined }

export default {
  name: 'Tax',
  data() {
    return {
      rows: [],
      selectedIds: [],
      batchAction: 'reprocessar_instab',
      loading: false,
      error: null,
      lastUpdated: null,

      // Modal
      preventModalOpen: false,
      preventDates: { municipal: '', estadual: '', federal: '' },
      preventApplyAll: false,
      savingPrevent: false,
      preventError: '',
      preventSuccess: '',
    }
  },
  computed: {
    allChecked() { return this.rows.length > 0 && this.selectedIds.length === this.rows.length }
  },
  created() {
    this.carregarEmpresas()
  },
  methods: {
    async carregarEmpresas() {
      this.loading = true
      this.error = null
      this.rows = []
      try {
        const first = await axios.get(`${API_BASE}/api/v1/empresas`, {
          params: { limit: PAGE_LIMIT, page: 1 },
          timeout: 30000,
        })
        const body = first.data
        if (Array.isArray(body)) {
          this.rows = this.mapEmpresas(body)
        } else {
          const items = Array.isArray(body.items) ? body.items : []
          const total = Number(pick(body, 'total', 'count', 'total_items')) || items.length
          const limit = Number(pick(body, 'limit', 'per_page')) || PAGE_LIMIT
          let page    = Number(pick(body, 'page', 'current_page')) || 1

          let acumulado = [...items]
          while (acumulado.length < total) {
            page += 1
            const { data } = await axios.get(`${API_BASE}/api/v1/empresas`, { params: { limit, page }, timeout: 30000 })
            const chunk = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : [])
            if (!chunk.length) break
            acumulado = acumulado.concat(chunk)
            if (chunk.length < limit) break
          }
          this.rows = this.mapEmpresas(acumulado)
        }
        this.lastUpdated = new Date().toLocaleString()
      } catch (err) {
        try {
          const { data } = await axios.get(`${API_BASE}/api/v1/empresas`, { timeout: 30000 })
          const arr = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : [])
          this.rows = this.mapEmpresas(arr)
          this.lastUpdated = new Date().toLocaleString()
        } catch (e2) {
          this.error = 'Falha ao carregar empresas. Verifique a API, CORS e VITE_API_BASE.'
        }
      } finally { this.loading = false }
    },

    mapEmpresas(arr) {
      return arr.map((e, idx) => {
        const cod = pick(e, 'cod_empresa', 'codigo_empresa', 'id_interno')
        const raz = pick(e, 'nome_razao_social', 'razao_social', 'razao', 'nome', 'nome_fantasia', 'nome_empresarial')
        const cnp = pick(e, 'cnpj', 'CNPJ', 'cnpj_base')
        const stFed = pick(e, 'federal', 'status_federal', 'cnd_federal_status')
        const stEst = pick(e, 'estadual', 'status_estadual', 'cnd_estadual_status')
        const stMun = pick(e, 'municipal', 'status_municipal', 'cnd_municipal_status')

        return {
          rowKey: e.id ?? e._id ?? cod ?? idx,
          cod_empresa: cod ?? '—',
          nome_razao_social: raz ?? '—',
          cnpj: String(cnp ?? ''),
          federal: String(stFed ?? '').toLowerCase(),
          estadual: String(stEst ?? '').toLowerCase(),
          municipal: String(stMun ?? '').toLowerCase(),
          ativo: e.ativo ?? e.is_active ?? true,
        }
      })
    },

    // ===== Modal handlers =====
    openPreventModal() {
      this.preventModalOpen = true
      this.preventError = ''
      this.preventSuccess = ''
      const today = new Date().toISOString().slice(0,10)
      this.preventDates = { municipal: today, estadual: today, federal: today }
      this.preventApplyAll = this.selectedIds.length > 0
    },
    closePreventModal() {
      this.preventModalOpen = false
    },
    async applyPrevention() {
      this.preventError = ''
      this.preventSuccess = ''
      const { municipal, estadual, federal } = this.preventDates
      if (!municipal && !estadual && !federal) {
        this.preventError = 'Defina ao menos uma data.'
        return
      }
      const payload = {
        municipal_date: municipal || null,
        estadual_date:  estadual  || null,
        federal_date:   federal   || null,
        target_ids: this.preventApplyAll && this.selectedIds.length ? this.selectedIds : 'ALL',
      }
      this.savingPrevent = true
      try {
        // ajuste o endpoint conforme sua API
        await axios.post(`${API_BASE}/api/v1/automacoes/tax/prevent`, payload, { timeout: 30000 })
        this.preventSuccess = 'Configuração aplicada com sucesso.'
        setTimeout(() => this.closePreventModal(), 800)
      } catch (e) {
        this.preventError = 'Não foi possível aplicar. Confirme se o endpoint existe.'
      } finally {
        this.savingPrevent = false
      }
    },

    // ===== Helpers =====
    getIcon(s) {
      const v = String(s || '').toLowerCase().trim()
      if (['ok','regular','sucesso','aprovado'].includes(v)) return ICONS.regular
      if (['erro','error','x','falha','negado','rejeitado'].includes(v)) return ICONS.erro
      if (['irregular','alerta','pendente','instavel','!'].includes(v)) return ICONS.irregular
      return null
    },
    toggleAll(e) { this.selectedIds = e.target.checked ? this.rows.map((r, i) => r.rowKey ?? i) : [] },
    runBatch() {
      if (!this.selectedIds.length) return this.toast('Selecione ao menos uma empresa.','Ação em Lote','warning')
      this.toast(`Ação '${this.labelBatch(this.batchAction)}' enviada para ${this.selectedIds.length} registro(s).`,'Ação em Lote','info')
    },
    labelBatch(v){ return ({reprocessar_ok:'Reprocessamento com estabilidade',reprocessar_instab:'Reprocessamento com instabilidade',parar:'Parar robô',limpar_alertas:'Limpar alertas'})[v] || v },
    fmtCNPJ(v){ const o=String(v||'').replace(/\D/g,''); if(o.length!==14) return v||'—'; return o.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,'$1.$2.$3/$4-$5') },
    toast(m,t='Info',v='info'){ if(this.$bvToast?.toast){ this.$bvToast.toast(m,{title:t,variant:v,solid:true,autoHideDelay:3500,toaster:'b-toaster-top-right'}) } else { console[(v==='danger'||v==='warning')?'warn':'log'](`${t}: ${m}`) } },
  },
}
</script>

<style scoped>
/* tema escuro */
.bg-deep { background: #0b172a; }

/* ===== Tabela com cantos arredondados ===== */
.table-shell {
  background: transparent;
  border: 1px solid #23314a;
  border-radius: 14px;
  overflow: hidden;
}
.table-scroll { overflow-x: auto; }

/* tabela larga + sem quebra de linha */
.table-darkish {
  --row-border: #23314a;
  color: #d9e2f1;
  min-width: 1300px;
  border-collapse: separate;
  border-spacing: 0;
}
.table-darkish td, .table-darkish th {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 360px;
}
.table-darkish thead tr { background: #0f203a; color: #bcd0f7; }
.table-darkish tbody tr { background: #0c1b31; border-top: 1px solid var(--row-border); }
.table-darkish tbody tr:hover { background: #0f2340; }
.row-muted { opacity: .65; }

/* arredondamento interno */
.table-darkish thead tr:first-child th:first-child { border-top-left-radius: 14px; }
.table-darkish thead tr:first-child th:last-child  { border-top-right-radius: 14px; }
.table-darkish tbody tr:last-child  td:first-child { border-bottom-left-radius: 14px; }
.table-darkish tbody tr:last-child  td:last-child  { border-bottom-right-radius: 14px; }

/* mono */
.text-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

/* flags */
.status-icon { width: 22px; height: 22px; object-fit: contain; display: inline-block; border-radius: 50%; }
.fallback { color: #ffd166; font-weight: 700; }

/* ===== Modal ===== */
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(2, 8, 20, 0.72);
  display: flex; align-items: center; justify-content: center;
  z-index: 1050;
}
.modal-card {
  width: min(960px, 95vw);
  background: #0c1b31; color: #d9e2f1;
  border: 1px solid #23314a; border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.45);
}
.modal-header, .modal-footer {
  padding: 12px 16px; background: #0f203a; border-bottom: 1px solid #23314a;
}
.modal-header { display: flex; align-items: center; justify-content: space-between; }
.modal-body { padding: 16px; }

.form-label { color: #bcd0f7; font-weight: 600; }
.btn-outline-light { border-color: #bcd0f7; color: #bcd0f7; }
.btn-outline-light:hover { background: #bcd0f7; color: #0b172a; }
.btn-primary { background: #2a7ade; border-color: #2a7ade; }
.btn-primary:hover { filter: brightness(1.05); }
</style>
