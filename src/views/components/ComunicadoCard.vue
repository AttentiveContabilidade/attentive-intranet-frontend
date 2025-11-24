<template>
  <b-card class="h-100 d-flex flex-column">
    <div v-if="item.imagem" class="mb-3">
      <b-img :src="item.imagem" fluid alt="Imagem do comunicado" class="w-100 rounded" />
    </div>

    <h5 class="mb-2">{{ item.titulo }}</h5>
    <p class="text-muted small mb-3">
      {{ labelTipo(item.tipo) }} • {{ formatDate(item.created_at) }}
    </p>

    <div class="mb-3" style="white-space: pre-wrap;">{{ item.conteudo }}</div>

    <div class="mt-auto d-flex align-items-center gap-2 pt-2 border-top">
      <b-avatar :src="item.autor?.avatar_url" variant="light" size="sm" class="me-2">
        <span v-if="!item.autor?.avatar_url">A</span>
      </b-avatar>
      <div class="small">
        <div class="fw-semibold">
          {{ item.autor?.nome ?? "Attentive" }}
          <span v-if="item.autor?.sobrenome"> {{ item.autor?.sobrenome }}</span>
        </div>
        <div class="text-muted">{{ item.autor?.departamento ?? "administrativo" }}</div>
      </div>
      <b-badge v-if="item.tipo === 'new_hire'" variant="success" class="ms-auto">Boas-vindas</b-badge>
    </div>

    <div v-if="item.target_user" class="mt-2 d-flex align-items-center gap-2">
      <small class="text-muted">Para:</small>
      <b-avatar :src="item.target_user.avatar_url" size="sm" class="me-1" />
      <small class="fw-semibold">
        {{ item.target_user.nome }} {{ item.target_user.sobrenome }}
      </small>
    </div>
  </b-card>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps({ item: { type: Object, required: true } });

function formatDate(iso) {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}
function labelTipo(t) {
  if (t === "new_hire") return "Boas-vindas";
  if (t === "alert") return "Alerta";
  return "Comunicado";
}
</script>

<style scoped>
.gap-2 { gap: .5rem; }
</style>
