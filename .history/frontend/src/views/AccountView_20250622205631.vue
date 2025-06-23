<template>
  <div class="account">
    <div class="container">
      <h1>Hesabım</h1>

      <div class="account-content">
        <div class="account-sidebar">
          <nav class="account-nav">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              :class="{ active: currentTab === tab.id }"
              @click="currentTab = tab.id"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="account-main">
          <!-- Profile Section -->
          <div v-if="currentTab === 'profile'" class="profile-section">
            <h2>Profil Bilgileri</h2>
            <div v-if="error" class="error-message">{{ error }}</div>
            <div v-if="success" class="success-message">{{ success }}</div>
            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-group">
                <label for="firstName">Ad</label>
                <input 
                  type="text" 
                  id="firstName" 
                  v-model="profile.firstName" 
                  required
                  :disabled="isLoading"
                >
              </div>
              <div class="form-group">
                <label for="lastName">Soyad</label>
                <input 
                  type="text" 
                  id="lastName" 
                  v-model="profile.lastName" 
                  required
                  :disabled="isLoading"
                >
              </div>
              <div class="form-group">
                <label for="email">E-posta</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="profile.email" 
                  required
                  :disabled="isLoading"
                >
              </div>
              <div class="form-group">
                <label for="phone">Telefon</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="profile.phone"
                  :disabled="isLoading"
                >
              </div>
              <button type="submit" class="btn-submit" :disabled="isLoading">
                {{ isLoading ? 'Güncelleniyor...' : 'Güncelle' }}
              </button>
            </form>
          </div>

          <!-- Address Section -->
          <div v-if="currentTab === 'address'" class="address-section">
            <h2>Adres Bilgileri</h2>
            <div v-if="error" class="error-message">{{ error }}</div>
            <div v-if="success" class="success-message">{{ success }}</div>
            <form @submit.prevent="updateAddress" class="address-form">
              <div class="form-group">
                <label for="address">Adres</label>
                <textarea 
                  id="address" 
                  v-model="address.address" 
                  required
                  rows="3"
                  :disabled="isLoading"
                ></textarea>
              </div>
              <div class="form-group">
                <label for="city">Şehir</label>
                <input 
                  type="text" 
                  id="city" 
                  v-model="address.city" 
                  required
                  :disabled="isLoading"
                >
              </div>
              <div class="form-group">
                <label for="postalCode">Posta Kodu</label>
                <input 
                  type="text" 
                  id="postalCode" 
                  v-model="address.postalCode" 
                  required
                  :disabled="isLoading"
                >
              </div>
              <button type="submit" class="btn-submit" :disabled="isLoading">
                {{ isLoading ? 'Güncelleniyor...' : 'Güncelle' }}
              </button>
            </form>
          </div>

          <!-- Password Section -->
          <div v-if="currentTab === 'password'" class="password-section">
            <h2>Şifre Değiştir</h2>
            <div v-if="error" class="error-message">{{ error }}</div>
            <div v-if="success" class="success-message">{{ success }}</div>
            <form @submit.prevent="updatePassword" class="password-form">
              <div class="form-group">
                <label for="currentPassword">Mevcut Şifre</label>
                <input 
                  type="password" 
                  id="currentPassword" 
                  v-model="password.currentPassword" 
                  required
                  :disabled="isLoading"
                >
              </div>
              <div class="form-group">
                <label for="newPassword">Yeni Şifre</label>
                <input 
                  type="password" 
                  id="newPassword" 
                  v-model="password.newPassword" 
                  required
                  :disabled="isLoading"
                >
              </div>
              <div class="form-group">
                <label for="confirmPassword">Yeni Şifre (Tekrar)</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  v-model="password.confirmPassword" 
                  required
                  :disabled="isLoading"
                >
              </div>
              <button type="submit" class="btn-submit" :disabled="isLoading">
                {{ isLoading ? 'Güncelleniyor...' : 'Şifre Değiştir' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const authStore = useAuthStore()

const tabs = [
  { id: 'profile', name: 'Profil Bilgileri' },
  { id: 'address', name: 'Adres Bilgileri' },
  { id: 'password', name: 'Şifre Değiştir' }
]

const currentTab = ref('profile')
const isLoading = ref(false)
const error = ref('')
const success = ref('')

// Tab değiştiğinde mesajları temizle
watch(currentTab, () => {
  error.value = ''
  success.value = ''
})

const profile = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

const address = reactive({
  address: '',
  city: '',
  postalCode: ''
})

const password = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Mevcut kullanıcı bilgilerini yükle
const loadUserData = async () => {
  try {
    if (authStore.user?.id) {
      const response = await axios.get(`/backend/customers/${authStore.user.id}`)
      const userData = response.data
      
      // Profil bilgilerini doldur
      profile.firstName = userData.firstName || ''
      profile.lastName = userData.lastName || ''
      profile.email = userData.email || ''
      profile.phone = userData.phone || ''
      
      // Adres bilgilerini doldur (eğer varsa)
      if (userData.address) {
        address.address = userData.address || ''
        // Şehir ve posta kodu için ayrı alanlar yoksa adres içinden parse edilebilir
        address.city = ''
        address.postalCode = ''
      }
    }
  } catch (error) {
    console.error('Kullanıcı bilgileri yüklenemedi:', error)
  }
}

onMounted(() => {
  loadUserData()
})

const updateProfile = async () => {
  try {
    isLoading.value = true
    error.value = ''
    success.value = ''
    
    if (!authStore.user?.id) {
      error.value = 'Kullanıcı bilgileri bulunamadı'
      return
    }
    
    const updateData = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone
    }
    
    await axios.patch(`/backend/customers/${authStore.user.id}`, updateData)
    
    // Auth store'daki kullanıcı bilgilerini güncelle
    authStore.updateUser({
      ...authStore.user,
      ...updateData
    })
    
    success.value = 'Profil bilgileri başarıyla güncellendi!'
  } catch (err: any) {
    console.error('Profil güncelleme hatası:', err)
    error.value = err.response?.data?.message || 'Profil güncellenirken bir hata oluştu'
  } finally {
    isLoading.value = false
  }
}

const updateAddress = async () => {
  try {
    isLoading.value = true
    error.value = ''
    success.value = ''
    
    if (!authStore.user?.id) {
      error.value = 'Kullanıcı bilgileri bulunamadı'
      return
    }
    
    const updateData = {
      address: `${address.address}, ${address.city} ${address.postalCode}`.trim()
    }
    
    await axios.patch(`/backend/customers/${authStore.user.id}`, updateData)
    
    success.value = 'Adres bilgileri başarıyla güncellendi!'
  } catch (err: any) {
    console.error('Adres güncelleme hatası:', err)
    error.value = err.response?.data?.message || 'Adres güncellenirken bir hata oluştu'
  } finally {
    isLoading.value = false
  }
}

const updatePassword = async () => {
  try {
    if (password.newPassword !== password.confirmPassword) {
      error.value = 'Yeni şifreler eşleşmiyor!'
      return
    }
    
    if (password.newPassword.length < 6) {
      error.value = 'Yeni şifre en az 6 karakter olmalıdır!'
      return
    }
    
    isLoading.value = true
    error.value = ''
    success.value = ''
    
    // Şifre değiştirme için özel bir endpoint gerekebilir
    // Şimdilik mevcut endpoint'i kullanıyoruz
    await axios.patch(`/backend/customers/${authStore.user?.id}`, {
      password: password.newPassword
    })
    
    success.value = 'Şifre başarıyla güncellendi!'
    
    // Şifre formunu temizle
    password.currentPassword = ''
    password.newPassword = ''
    password.confirmPassword = ''
  } catch (err: any) {
    console.error('Şifre güncelleme hatası:', err)
    error.value = err.response?.data?.message || 'Şifre güncellenirken bir hata oluştu'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.account {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
}

.account-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
}

.account-sidebar {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.account-nav {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.account-nav button {
  padding: 1rem;
  text-align: left;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  font-size: 1rem;
  transition: all 0.2s;
}

.account-nav button:hover {
  background-color: #f5f5f5;
  color: #333;
}

.account-nav button.active {
  background-color: #42b983;
  color: white;
}

.account-main {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
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

input, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #42b983;
}

.btn-submit {
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

.btn-submit:hover {
  background-color: #3aa876;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #ffcdd2;
}

.success-message {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #c8e6c9;
}

@media (max-width: 768px) {
  .account-content {
    grid-template-columns: 1fr;
  }

  .account {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .account-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 0.5rem;
  }

  .account-nav button {
    white-space: nowrap;
  }
}
</style> 