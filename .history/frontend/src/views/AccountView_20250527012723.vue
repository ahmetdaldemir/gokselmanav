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
            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-group">
                <label for="firstName">Ad</label>
                <input 
                  type="text" 
                  id="firstName" 
                  v-model="profile.firstName" 
                  required
                >
              </div>
              <div class="form-group">
                <label for="lastName">Soyad</label>
                <input 
                  type="text" 
                  id="lastName" 
                  v-model="profile.lastName" 
                  required
                >
              </div>
              <div class="form-group">
                <label for="email">E-posta</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="profile.email" 
                  required
                >
              </div>
              <div class="form-group">
                <label for="phone">Telefon</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="profile.phone"
                >
              </div>
              <button type="submit" class="btn-submit">Güncelle</button>
            </form>
          </div>

          <!-- Address Section -->
          <div v-if="currentTab === 'address'" class="address-section">
            <h2>Adres Bilgileri</h2>
            <form @submit.prevent="updateAddress" class="address-form">
              <div class="form-group">
                <label for="address">Adres</label>
                <textarea 
                  id="address" 
                  v-model="address.address" 
                  required
                  rows="3"
                ></textarea>
              </div>
              <div class="form-group">
                <label for="city">Şehir</label>
                <input 
                  type="text" 
                  id="city" 
                  v-model="address.city" 
                  required
                >
              </div>
              <div class="form-group">
                <label for="postalCode">Posta Kodu</label>
                <input 
                  type="text" 
                  id="postalCode" 
                  v-model="address.postalCode" 
                  required
                >
              </div>
              <button type="submit" class="btn-submit">Güncelle</button>
            </form>
          </div>

          <!-- Password Section -->
          <div v-if="currentTab === 'password'" class="password-section">
            <h2>Şifre Değiştir</h2>
            <form @submit.prevent="updatePassword" class="password-form">
              <div class="form-group">
                <label for="currentPassword">Mevcut Şifre</label>
                <input 
                  type="password" 
                  id="currentPassword" 
                  v-model="password.currentPassword" 
                  required
                >
              </div>
              <div class="form-group">
                <label for="newPassword">Yeni Şifre</label>
                <input 
                  type="password" 
                  id="newPassword" 
                  v-model="password.newPassword" 
                  required
                >
              </div>
              <div class="form-group">
                <label for="confirmPassword">Yeni Şifre (Tekrar)</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  v-model="password.confirmPassword" 
                  required
                >
              </div>
              <button type="submit" class="btn-submit">Şifre Değiştir</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const tabs = [
  { id: 'profile', name: 'Profil Bilgileri' },
  { id: 'address', name: 'Adres Bilgileri' },
  { id: 'password', name: 'Şifre Değiştir' }
]

const currentTab = ref('profile')

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

const updateProfile = async () => {
  try {
    // TODO: Implement profile update
    console.log('Profile updated:', profile)
    alert('Profil bilgileri güncellendi!')
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('Bir hata oluştu. Lütfen tekrar deneyin.')
  }
}

const updateAddress = async () => {
  try {
    // TODO: Implement address update
    console.log('Address updated:', address)
    alert('Adres bilgileri güncellendi!')
  } catch (error) {
    console.error('Error updating address:', error)
    alert('Bir hata oluştu. Lütfen tekrar deneyin.')
  }
}

const updatePassword = async () => {
  try {
    if (password.newPassword !== password.confirmPassword) {
      alert('Yeni şifreler eşleşmiyor!')
      return
    }
    // TODO: Implement password update
    console.log('Password updated:', password)
    alert('Şifre başarıyla güncellendi!')
    // Reset password form
    password.currentPassword = ''
    password.newPassword = ''
    password.confirmPassword = ''
  } catch (error) {
    console.error('Error updating password:', error)
    alert('Bir hata oluştu. Lütfen tekrar deneyin.')
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