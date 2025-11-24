<template>
  <div class="dept-view text-light">
    <b-container fluid class="py-4 px-4 px-md-5">
      <div class="text-center mb-4">
        <h1 class="display-3 fw-bold">
          Bem vindo ao <span class="text-accent">{{ title }}</span>
        </h1>
      </div>

      <b-row class="no-gutters split-row">
        <!-- Esquerda -->
        <b-col cols="12" md="6" class="pane pane-left bg-white text-dark">
          <div class="section-wrap">
            <h2 class="section-title"><span class="bullet">•</span> {{ leftTitle }}</h2>
            <div class="icons-wrap">
              <div v-for="(item, i) in leftItems" :key="'l-'+i" class="icon-tile"
                   @click="go(item)" tabindex="0" @keyup.enter="go(item)">
                <div class="icon-circle"><img :src="item.icon" alt="" /></div>
                <small class="icon-label">{{ item.title }}</small>
              </div>
            </div>
          </div>
        </b-col>

        <!-- Direita -->
        <b-col cols="12" md="6" class="pane pane-right">
          <div class="section-wrap">
            <h2 class="section-title"><span class="bullet">•</span> {{ rightTitle }}</h2>
            <div class="icons-wrap">
              <div v-for="(item, i) in rightItems" :key="'r-'+i" class="icon-tile"
                   @click="go(item)" tabindex="0" @keyup.enter="go(item)">
                <div class="icon-circle light"><img :src="item.icon" alt="" /></div>
                <small class="icon-label">{{ item.title }}</small>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "DepartamentoLayout",
  props: {
    title: { type: String, required: true },
    leftTitle: { type: String, default: "Automações" },
    rightTitle: { type: String, default: "Ferramentas" },
    leftItems: { type: Array, default: () => [] },
    rightItems: { type: Array, default: () => [] },
  },
  methods: {
    go(item) {
      if (!item?.to) return;
      if (item.to.path?.startsWith("http")) window.open(item.to.path, "_blank", "noopener");
      else this.$router.push(item.to);
    },
  },
};
</script>

<style scoped>
.dept-view { min-height: calc(100vh - 64px); }
.split-row { border-radius: 16px; overflow: hidden; }
.pane { min-height: 60vh; display: flex; align-items: flex-start; }
.pane-right { background: #0b0830; }
.section-wrap { width: 100%; padding: 2.5rem 2rem; }
.section-title { font-weight: 800; font-size: clamp(28px,3vw,44px); margin-bottom: 1.5rem; display: flex; gap:.75rem; }
.icons-wrap { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 18px 14px; }
.icon-tile { text-align: center; cursor: pointer; }
.icon-circle { width: 72px; height: 72px; border-radius: 999px; background:#130d4a; display:grid; place-items:center; margin:0 auto 8px; box-shadow:0 4px 12px rgba(0,0,0,.15); }
.icon-circle.light { background: #fff; }
.icon-circle img { width: 34px; height: 34px; object-fit: contain; }
.icon-label { font-size:12px; font-weight:600; opacity:.85; }
.text-accent { color:#cfd3ff; }
@media (max-width: 991.98px){ .pane{min-height:unset;} .section-wrap{padding:1.5rem;} }
</style>
