<template>
  <div class="admin-login">
    <div class="login-container">
      <h1>Admin Girişi</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">E-posta</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            required
            placeholder="E-posta adresiniz"
          >
        </div>
        <div class="form-group">
          <label for="password">Şifre</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            required
            placeholder="Şifreniz"
          >
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <button type="submit" class="btn-login" :disabled="isLoading">
          {{ isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  password: ''
})

const handleLogin = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    const success = await authStore.login(form.email, form.password, true)
    
    if (success) {
      router.push('/admin/dashboard')
    } else {
      error.value = 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.'
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = 'Bir hata oluştu. Lütfen tekrar deneyin.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.login-container {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #42b983;
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.btn-login {
  width: 100%;
  padding: 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-login:hover:not(:disabled) {
  background-color: #3aa876;
}

.btn-login:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style> 