<template>
  <section class="hero-gifs-boxed">
    <div
      id="gifCarousel"
      class="carousel slide carousel-fade box"
      data-bs-ride="carousel"
      :data-bs-interval="interval"
    >
      <div class="carousel-inner">
        <div
          v-for="(u, i) in urls"
          :key="u"
          class="carousel-item"
          :class="{ active: i === 0 }"
        >
          <img :src="u" class="d-block w-100 box-img" alt="GIF do carrossel" />
        </div>
      </div>

      <!-- Controles (opcionais) -->
      <button
        v-if="urls.length > 1"
        class="carousel-control-prev"
        type="button"
        data-bs-target="#gifCarousel"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Anterior</span>
      </button>
      <button
        v-if="urls.length > 1"
        class="carousel-control-next"
        type="button"
        data-bs-target="#gifCarousel"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Próximo</span>
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroCarouselGifs',
  props: {
    interval: { type: [Number, Boolean], default: 5000 },
  },
  data() {
    return { urls: [] }
  },
  created() {
    const modules = import.meta.glob('@/assets/carrossel/*.{gif,GIF,png,jpg,jpeg,webp}', {
      eager: true,
      as: 'url'
    })
    this.urls = Object.keys(modules).sort().map(k => modules[k])
  }
}
</script>

<style scoped>
/* CONTÊINER CENTRALIZADO */
.hero-gifs-boxed {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 24px 16px;
  background: transparent; /* não ocupa tela toda */
}

/* ======== DIMENSÕES DA “CAIXA” ======== */

/* Opção A) FIXA (ajuste os px conforme seu retângulo):*/

 .box {
  width: 1400px;   
  height: 800px;   
  border-radius: 16px;
  overflow: hidden;
  background: #0d1728;
  box-shadow: 0 10px 36px rgba(0,0,0,.35);
  position: relative;
}  


/* Opção B) RESPONSIVA (descomente e comente a A) */
/* .box {
  width: min(1200px, 92vw);
  height: clamp(380px, 55vh, 560px);
  border-radius: 16px;
  overflow: hidden;
  background: #0d1728;
  box-shadow: 0 10px 36px rgba(0,0,0,.35);
  position: relative;
} */


/* imagem cobre a caixa sem distorcer */
.box-img {
  height: 100%;
  object-fit: cover;
}

/* melhora transição fade */
.carousel-item { transition: opacity .6s ease-in-out; }
.carousel-fade .carousel-item { opacity: 0; }
.carousel-fade .carousel-item.active,
.carousel-fade .carousel-item-next.carousel-item-start,
.carousel-fade .carousel-item-prev.carousel-item-end {
  opacity: 1; transform: none;
}
.carousel-fade .active.carousel-item-start,
.carousel-fade .active.carousel-item-end { opacity: 0; }

/* posiciona setas dentro da caixa */
.carousel-control-prev,
.carousel-control-next {
  width: 48px;
}
</style>
