<template>
  <div class="settings-view">
    <div class="page-header">
      <h1>Sistem Ayarları</h1>
    </div>

    <div class="settings-content">
      <!-- Sosyal Medya Ayarları -->
      <div class="settings-section">
        <h2>Sosyal Medya Ayarları</h2>
        <div class="settings-form">
          <div class="form-group">
            <label for="facebook">Facebook URL</label>
            <input 
              type="url" 
              id="facebook" 
              v-model="socialMedia.Facebook" 
              placeholder="https://facebook.com/..."
            >
          </div>
          <div class="form-group">
            <label for="twitter">Twitter URL</label>
            <input 
              type="url" 
              id="twitter" 
              v-model="socialMedia.Twitter" 
              placeholder="https://twitter.com/..."
            >
          </div>
          <div class="form-group">
            <label for="instagram">Instagram URL</label>
            <input 
              type="url" 
              id="instagram" 
              v-model="socialMedia.Instagram" 
              placeholder="https://instagram.com/..."
            >
          </div>
          <button @click="saveSocialMedia" class="btn-save" :disabled="isLoading">
            {{ isLoading ? 'Kaydediliyor...' : 'Sosyal Medya Ayarlarını Kaydet' }}
          </button>
        </div>
      </div>

      <!-- Genel Ayarlar -->
      <div class="settings-section">
        <h2>Genel Ayarlar</h2>
        <div class="settings-form">
          <div class="form-group">
            <label for="siteName">Site Adı</label>
            <input 
              type="text" 
              id="siteName" 
              v-model="general.siteName" 
              placeholder="Site adı"
            >
          </div>
          <div class="form-group">
            <label for="contactEmail">İletişim E-posta</label>
            <input 
              type="email" 
              id="contactEmail" 
              v-model="general.contactEmail" 
              placeholder="info@example.com"
            >
          </div>
          <div class="form-group">
            <label for="phone">Telefon</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="general.phone" 
              placeholder="+90 555 123 45 67"
            >
          </div>
          <button @click="saveGeneral" class="btn-save" :disabled="isLoading">
            {{ isLoading ? 'Kaydediliyor...' : 'Genel Ayarları Kaydet' }}
          </button>
        </div>
      </div>

      <!-- Mesajlar -->
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

const isLoading = ref(false)
const message = ref('')
const messageType = ref('success')

const socialMedia = reactive({
  Facebook: '',
  Twitter: '',
  Instagram: ''
})

const general = reactive({
  siteName: '',
  contactEmail: '',
  phone: ''
})

const loadSettings = async () => {
  try {
    const response = await axios.get('/backend/settings')
    const settings: Record<string, string> = {}
    response.data.forEach((setting: any) => {
      settings[setting.key] = setting.value
    })
    
    // Sosyal medya ayarlarını doldur
    socialMedia.Facebook = settings.Facebook || ''
    socialMedia.Twitter = settings.Twitter || ''
    socialMedia.Instagram = settings.Instagram || ''
    
    // Genel ayarları doldur
    general.siteName = settings.siteName || ''
    general.contactEmail = settings.contactEmail || ''
    general.phone = settings.phone || ''
  } catch (error) {
    console.error('Ayarlar yüklenemedi:', error)
    showMessage('Ayarlar yüklenirken bir hata oluştu', 'error')
  }
}

const saveSocialMedia = async () => {
  try {
    isLoading.value = true
    const settings = [
      { key: 'Facebook', value: socialMedia.Facebook },
      { key: 'Twitter', value: socialMedia.Twitter },
      { key: 'Instagram', value: socialMedia.Instagram }
    ]
    
    for (const setting of settings) {
      if (setting.value) {
        await axios.post('/backend/settings', setting)
      }
    }
    
    showMessage('Sosyal medya ayarları başarıyla kaydedildi!', 'success')
  } catch (error) {
    console.error('Sosyal medya ayarları kaydedilemedi:', error)
    showMessage('Sosyal medya ayarları kaydedilirken bir hata oluştu', 'error')
  } finally {
    isLoading.value = false
  }
}

const saveGeneral = async () => {
  try {
    isLoading.value = true
    const settings = [
      { key: 'siteName', value: general.siteName },
      { key: 'contactEmail', value: general.contactEmail },
      { key: 'phone', value: general.phone }
    ]
    
    for (const setting of settings) {
      if (setting.value) {
        await axios.post('/backend/settings', setting)
      }
    }
    
    showMessage('Genel ayarlar başarıyla kaydedildi!', 'success')
  } catch (error) {
    console.error('Genel ayarlar kaydedilemedi:', error)
    showMessage('Genel ayarlar kaydedilirken bir hata oluştu', 'error')
  } finally {
    isLoading.value = false
  }
}

const showMessage = (msg: string, type: 'success' | 'error') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.settings-view {
  padding: 1rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0;
}

.settings-content {
  display: grid;
  gap: 2rem;
}

.settings-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 2rem;
}

.settings-section h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #42b983;
  padding-bottom: 0.5rem;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #42b983;
}

.btn-save {
  padding: 1rem 2rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-start;
}

.btn-save:hover:not(:disabled) {
  background-color: #3aa876;
}

.btn-save:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.message {
  padding: 1rem;
  border-radius: 4px;
  font-weight: 500;
}

.message.success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.message.error {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

@media (max-width: 768px) {
  .settings-view {
    padding: 0.5rem;
  }
  
  .settings-section {
    padding: 1rem;
  }
  
  .page-header h1 {
    font-size: 1.5rem;
  }
}
</style> 