<template>
  <b-card no-body class="shadow-sm h-100">
    <!-- Header com SLOT para o título e filtros -->
    <b-card-header class="d-flex flex-wrap gap-2 justify-content-between align-items-center">
      <!-- Título vem do pai -->
      <slot name="header-title">
        <span class="fw-semibold h5 mb-0">Título padrão</span>
      </slot>

      <b-button-group>
        <b-button
          :variant="currentFilter === 'andamento' ? 'warning' : 'outline-warning'"
          @click="setFilter('andamento')"
          class="text-uppercase fw-semibold"
        >
          Em Andamento
        </b-button>
        <b-button
          :variant="currentFilter === 'concluido' ? 'outline-success' : 'outline-success'"
          :class="currentFilter === 'concluido' ? 'bg-success text-white border-success' : ''"
          @click="setFilter('concluido')"
          class="text-uppercase fw-semibold"
        >
          Concluído
        </b-button>
        <b-button
          :variant="currentFilter === 'erro' ? 'danger' : 'outline-danger'"
          @click="setFilter('erro')"
          class="text-uppercase fw-semibold"
        >
          Com Erro
        </b-button>
      </b-button-group>
    </b-card-header>

    <b-card-body class="p-0">
      <b-table
        :items="filteredRows"
        :fields="fields"
        small
        hover
        responsive="md"
        head-variant="light"
        class="mb-0 align-middle"
      >
        <!-- Empresa -->
        <template #cell(empresa)="{ item }">
          <div class="d-flex align-items-center">
            <div class="avatar me-2">{{ getSigla(item.empresa) }}</div>
            <div>
              <div class="fw-semibold">{{ item.empresa }}</div>
              <div class="text-muted small">{{ item.cliente || '' }}</div>
            </div>
          </div>
        </template>

        <!-- CNPJ -->
        <template #cell(CNPJ)="{ item }">
          <span class="text-muted">{{ item.CNPJ }}</span>
        </template>

        <!-- Status (badge) -->
        <template #cell(status)="{ item }">
          <b-badge :variant="statusBadge(item.status)" class="px-3 py-2">
            {{ statusLabel(item.status) }}
          </b-badge>
        </template>

       
      </b-table>
    </b-card-body>

    <b-card-footer class="bg-light">
      <div class="d-flex flex-wrap gap-3 small align-items-center">
        <span class="d-inline-flex align-items-center">
          <span class="legend-dot ok me-2"></span> OK
        </span>
        <span class="d-inline-flex align-items-center">
          <span class="legend-dot andamento me-2"></span> Em andamento
        </span>
        <span class="d-inline-flex align-items-center">
          <span class="legend-dot erro me-2"></span> Com erro
        </span>
      </div>
    </b-card-footer>
  </b-card>
</template>

<script>
// Componente interno para desenhar a “bolinha” de estado (mantido para evolução)
const StageDot = {
  name: 'StageDot',
  props: {
    // ok | andamento | pendente | erro
    state: { type: String, default: 'pendente' }
  },
  computed: {
    cls() {
      const s = (this.state || 'pendente').toLowerCase();
      return ['dot', s];
    }
  },
  template: `<span :class="cls"></span>`
};

export default {
  name: 'StatusCard',
  components: { StageDot },
  props: {
    // Array de linhas com chaves: Código, empresa, CNPJ, DUC, CND, status (+ cliente opcional)
    rows: { type: Array, required: true },
    defaultFilter: { type: String, default: 'andamento' } // andamento | concluido | erro
  },
  data() {
    return {
      currentFilter: this.defaultFilter,
      fields: [
        { key: 'Código', label: 'Código' },
        { key: 'empresa', label: 'Empresa', thClass: 'text-nowrap' },
        { key: 'CNPJ', label: 'CNPJ' },
        { key: 'DUC', label: 'DUC', class: 'text-center', thClass: 'text-center' },
        { key: 'CND', label: 'CND', class: 'text-center', thClass: 'text-center' },
        { key: 'status', label: 'Status', class: 'text-center', thClass: 'text-center' }
      ]
    };
  },
  computed: {
    filteredRows() {
      return this.rows.filter(r => (r.status || 'andamento') === this.currentFilter);
    }
  },
  methods: {
    setFilter(f) {
      this.currentFilter = f;
      this.$emit('filter-change', f);
    },
    statusBadge(s) {
      const map = { andamento: 'warning', concluido: 'success', erro: 'danger' };
      return map[s] || 'secondary';
    },
    statusLabel(s) {
      const map = { andamento: 'Andamento', concluido: 'Concluído', erro: 'Com erro' };
      return map[s] || '—';
    },
    getSigla(nome = '') {
      const parts = nome.trim().split(/\s+/).filter(Boolean);
      const sigla = (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
      return sigla.toUpperCase().slice(0, 2) || '—';
    }
  }
};
</script>

<style scoped>
/* “Avatar” com iniciais da empresa */
.avatar {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  background: #1f6feb;
  font-size: 0.9rem;
}

/* Bolinhas (mantidas para futura expansão por etapa) */
.dot {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 2px solid #c0c4ca;
  background: #e9ecef;
}
.dot.ok { background: #28a745; border-color: #28a745; }
.dot.andamento { background: #fd7e14; border-color: #fd7e14; }
.dot.pendente { background: #e9ecef; border-color: #c0c4ca; }
.dot.erro { background: #dc3545; border-color: #dc3545; }

/* Legenda no footer */
.legend-dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  display: inline-block;
  border: 2px solid transparent;
}
.legend-dot.ok { background: #28a745; }
.legend-dot.andamento { background: #fd7e14; }
.legend-dot.pendente { background: #e9ecef; border-color: #c0c4ca; }
.legend-dot.erro { background: #dc3545; }
</style>
