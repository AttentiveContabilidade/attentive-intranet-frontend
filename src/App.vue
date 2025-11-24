<template>
  <div id="app">
    <!-- Header global -->
    <Navbar v-if="showNavbar" />
    <!-- Conteúdo -->
    <router-view />
  </div>
</template>

<script>
import Navbar from '@/views/components/Header.vue'

export default {
  name: 'App',
  components: { Navbar },
  computed: {
    // Mostra o header a menos que a rota atual tenha meta { hideNavbar: true }
    showNavbar () {
      return !(this.$route && this.$route.meta && this.$route.meta.hideNavbar)
    }
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  /* use o nome EXATO do arquivo (maiúsc/minúsc) */
  background-image: url('@/assets/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
</style>
