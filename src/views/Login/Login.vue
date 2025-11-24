<template>
  <div class="login-wrapper">
    <div class="login-box">
      <h2 class="mb-3 text-center">Bem-vindo, Colaborador!</h2>

      <transition name="fade">
        <div
          v-if="error"
          class="alert alert-danger text-center py-2"
          role="alert"
          aria-live="polite"
        >
          {{ error }}
        </div>
      </transition>

      <form @submit.prevent="submit" novalidate>
        <div class="mb-3">
          <label for="email" class="form-label">E-mail</label>
          <input
            v-model.trim="email"
            type="email"
            id="email"
            class="form-control"
            placeholder="seu@email.com"
            required
            autocomplete="username"
            @keyup.enter="submit"
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Senha</label>
          <div class="input-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              id="password"
              class="form-control"
              placeholder="Digite sua senha"
              required
              autocomplete="current-password"
              @keyup.enter="submit"
            />
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="toggleShowPassword"
              :disabled="loading"
            >
              {{ showPassword ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-primary w-100 d-flex align-items-center justify-content-center"
          :disabled="loading || !email || !password"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login as apiLogin, initSession } from '@/core/services/auth.service'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref(null)

const router = useRouter()
const route = useRoute()

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

const submit = async () => {
  if (!email.value || !password.value) {
    error.value = 'Informe e-mail e senha.'
    return
  }

  error.value = null
  loading.value = true

  try {
    await apiLogin({
      email: email.value.trim(),
      senha: password.value,
    })

    // garante que authState.user está sincronizado com /me
    await initSession()

    const redirectParam = route.query.redirect
    const redirect =
      typeof redirectParam === 'string' && redirectParam.length > 0
        ? redirectParam
        : '/main'

    await router.replace(redirect)
  } catch (e) {
    console.error('Erro no login:', e)

    const backendMsg =
      e?.response?.data?.detail ||
      e?.response?.data?.message ||
      e?.message

    error.value = backendMsg || 'Credenciais inválidas'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: url('@/assets/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.login-box {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 14px;
  backdrop-filter: blur(4px);
  box-shadow:
    0 10px 25px rgba(16, 24, 40, 0.08),
    0 2px 8px rgba(16, 24, 40, 0.06);
  width: 100%;
  max-width: 420px;
}

.btn {
  height: 44px;
  border-radius: 10px;
}

.form-label {
  font-weight: 600;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
