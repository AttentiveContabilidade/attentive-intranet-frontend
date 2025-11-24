<template>
  <button
    class="tile-btn d-flex flex-column align-items-center justify-content-center"
    :class="variantClass"
    type="button"
    @click="$emit('click')"
  >
    <div class="tile-icon d-flex align-items-center justify-content-center mb-2">
      <img :src="img" alt="" class="img-fluid" />
    </div>
    <span class="tile-label fw-semibold">{{ label }}</span>
  </button>
</template>

<script>
export default {
  name: 'TileButton',
  props: {
    img: { type: String, required: true },
    label: { type: String, required: true },
    variant: { type: String, default: 'light' }
  },
  emits: ['click'],
  computed: {
    variantClass () {
      return this.variant === 'dark' ? 'tile-dark' : 'tile-light'
    }
  }
}
</script>

<style scoped>
.tile-btn {
  width: 180px; height: 180px; border: none; border-radius: 24px;
  padding: 18px 16px 14px; transition: transform .08s ease, box-shadow .08s ease;
  box-shadow: 0 6px 20px rgba(0,0,0,.15);
}
.tile-btn:active { transform: scale(.98); }
.tile-icon { width: 96px; height: 96px; }
.tile-icon img { max-width: 100%; max-height: 100%; object-fit: contain; }
.tile-light { background: #ffffff; color: #0a073a; }
.tile-dark  { background: #0a073a; color: #ffffff; }
.tile-label { font-size: 1.05rem; }
</style>
