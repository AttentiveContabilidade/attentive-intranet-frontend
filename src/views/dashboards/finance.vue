<!-- src/views/dashboards/tax.vue -->
<template>
  <div class="report-wrapper">
    <iframe
      :src="src"
      frameborder="0"
      allowfullscreen
      referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'DashboardTax',
  data() {
    return {
      // cole aqui a URL de incorporação pública do seu BI
      src: 'https://lookerstudio.google.com/embed/reporting/2998e73e-c3dc-4fb3-a768-7ae967ae213d/page/VgD'
    }
  }
}
</script>

<style scoped>
.report-wrapper { height: 100vh; }
.report-wrapper iframe { width: 100%; height: 100%; border: 0; }
</style>
