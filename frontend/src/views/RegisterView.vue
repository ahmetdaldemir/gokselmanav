<template>
  <div class="register-view">
    <div class="register-container">
      <h1>Kayıt Ol</h1>
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="firstName">Ad</label>
          <input type="text" id="firstName" v-model="form.firstName" required placeholder="Adınız" />
        </div>
        <div class="form-group">
          <label for="lastName">Soyad</label>
          <input type="text" id="lastName" v-model="form.lastName" required placeholder="Soyadınız" />
        </div>
        <div class="form-group">
          <label for="email">E-posta</label>
          <input type="email" id="email" v-model="form.email" required placeholder="E-posta adresiniz" />
        </div>
        <div class="form-group">
          <label for="password">Şifre</label>
          <input type="password" id="password" v-model="form.password" required minlength="6" placeholder="Şifreniz (en az 6 karakter)" />
        </div>
        <div class="form-group">
          <label for="phone">Telefon (isteğe bağlı)</label>
          <input type="text" id="phone" v-model="form.phone" placeholder="Telefon numaranız" />
        </div>
        <div class="form-group">
          <label for="address">Adres (isteğe bağlı)</label>
          <input type="text" id="address" v-model="form.address" placeholder="Adresiniz" />
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <button type="submit" class="btn-register" :disabled="isLoading">
          {{ isLoading ? 'Kayıt olunuyor...' : 'Kayıt Ol' }}
        </button>
      </form>
      <div class="login-link">
        Zaten hesabınız var mı? <router-link to="/login">Giriş Yap</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isLoading = ref(false)
const error = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  address: ''
})

const handleRegister = async () => {
  if (form.password.length < 6) {
    error.value = 'Şifre en az 6 karakter olmalı.'
    return
  }
  isLoading.value = true
  error.value = ''
  try {
    await axios.post('/backend/customers', form)
    router.push('/login')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Kayıt sırasında bir hata oluştu.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}
.register-container {
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
.btn-register {
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
.btn-register:hover:not(:disabled) {
  background-color: #3aa876;
}
.btn-register:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.login-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.95rem;
}
.login-link a {
  color: #42b983;
  text-decoration: underline;
}
</style> 