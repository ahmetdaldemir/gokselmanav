<template>
  <div class="contact">
    <div class="container">
      <h1>İletişim</h1>

      <div class="contact-content">
        <div class="contact-info">
          <h2>İletişim Bilgileri</h2>
          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <p>Adres: Örnek Mahallesi, Örnek Sokak No:1, İstanbul</p>
          </div>
          <div class="info-item">
            <i class="fas fa-phone"></i>
            <p>Telefon: +90 (212) 123 45 67</p>
          </div>
          <div class="info-item">
            <i class="fas fa-envelope"></i>
            <p>E-posta: info@example.com</p>
          </div>
          <div class="info-item">
            <i class="fas fa-clock"></i>
            <p>Çalışma Saatleri: Pazartesi - Cumartesi, 09:00 - 18:00</p>
          </div>
        </div>

        <form class="contact-form" @submit.prevent="submitForm">
          <h2>Bize Ulaşın</h2>
          <div class="form-group">
            <label for="name">Ad Soyad</label>
            <input 
              type="text" 
              id="name" 
              v-model="form.name" 
              required
              placeholder="Adınız Soyadınız"
            >
          </div>
          <div class="form-group">
            <label for="email">E-posta</label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email" 
              required
              placeholder="E-posta Adresiniz"
            >
          </div>
          <div class="form-group">
            <label for="subject">Konu</label>
            <input 
              type="text" 
              id="subject" 
              v-model="form.subject" 
              required
              placeholder="Mesaj Konusu"
            >
          </div>
          <div class="form-group">
            <label for="message">Mesaj</label>
            <textarea 
              id="message" 
              v-model="form.message" 
              required
              placeholder="Mesajınız"
              rows="5"
            ></textarea>
          </div>
          <button type="submit" class="btn-submit">Gönder</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitForm = async () => {
  try {
    // TODO: Implement form submission
    console.log('Form submitted:', form)
    // Reset form
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
    alert('Mesajınız başarıyla gönderildi!')
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Bir hata oluştu. Lütfen tekrar deneyin.')
  }
}
</script>

<style scoped>
.contact {
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

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.contact-info, .contact-form {
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

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.info-item i {
  color: #42b983;
  font-size: 1.2rem;
}

.info-item p {
  color: #666;
  margin: 0;
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
  .contact-content {
    grid-template-columns: 1fr;
  }

  .contact {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }
}
</style> 