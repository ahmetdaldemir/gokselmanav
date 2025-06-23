<template>
  <div class="tracking">
    <h1>Kargo Takip</h1>
    
    <div class="content">
      <section class="tracking-form">
        <h2>Sipariş Takibi</h2>
        <p>Sipariş numaranızı girerek kargo durumunu takip edebilirsiniz.</p>
        
        <div class="form-group">
          <label for="orderNumber">Sipariş Numarası</label>
          <input 
            type="text" 
            id="orderNumber" 
            v-model="orderNumber" 
            placeholder="Örn: GM-2024-001234"
            @keyup.enter="trackOrder"
          >
        </div>
        
        <button @click="trackOrder" class="btn-track" :disabled="!orderNumber || isLoading">
          {{ isLoading ? 'Aranıyor...' : 'Siparişi Takip Et' }}
        </button>
      </section>

      <section v-if="trackingInfo" class="tracking-result">
        <h2>Sipariş Durumu</h2>
        
        <div class="order-info">
          <div class="info-row">
            <strong>Sipariş Numarası:</strong>
            <span>{{ trackingInfo.orderNumber }}</span>
          </div>
          <div class="info-row">
            <strong>Sipariş Tarihi:</strong>
            <span>{{ trackingInfo.orderDate }}</span>
          </div>
          <div class="info-row">
            <strong>Teslimat Adresi:</strong>
            <span>{{ trackingInfo.deliveryAddress }}</span>
          </div>
          <div class="info-row">
            <strong>Toplam Tutar:</strong>
            <span>{{ trackingInfo.totalAmount }}</span>
          </div>
        </div>

        <div class="tracking-timeline">
          <h3>Kargo Durumu</h3>
          <div class="timeline">
            <div 
              v-for="(step, index) in trackingInfo.steps" 
              :key="index"
              :class="['timeline-step', { 'completed': step.completed, 'current': step.current }]"
            >
              <div class="step-icon">
                <span v-if="step.completed">✓</span>
                <span v-else-if="step.current">●</span>
                <span v-else>○</span>
              </div>
              <div class="step-content">
                <h4>{{ step.title }}</h4>
                <p>{{ step.description }}</p>
                <span class="step-time">{{ step.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="error" class="error-message">
        <h3>Sipariş Bulunamadı</h3>
        <p>{{ error }}</p>
        <p>Lütfen sipariş numaranızı kontrol edin veya müşteri hizmetlerimizle iletişime geçin.</p>
      </section>

      <section class="tracking-help">
        <h2>Takip Hakkında</h2>
        <div class="help-content">
          <div class="help-item">
            <h3>Sipariş Numarası Nerede?</h3>
            <p>Sipariş numaranızı e-posta adresinize gönderilen onay mesajında bulabilirsiniz. Ayrıca hesabınızın "Siparişlerim" bölümünde de görüntüleyebilirsiniz.</p>
          </div>
          
          <div class="help-item">
            <h3>Takip Güncellemeleri</h3>
            <p>Kargo durumu her güncelleme ile otomatik olarak yenilenir. Teslimat sırasında SMS ile bilgilendirme alırsınız.</p>
          </div>
          
          <div class="help-item">
            <h3>Sorun Yaşıyorsanız</h3>
            <p>Takip ile ilgili sorun yaşıyorsanız müşteri hizmetlerimizle iletişime geçebilirsiniz:</p>
            <ul>
              <li><strong>Telefon:</strong> +90 555 123 45 67</li>
              <li><strong>E-posta:</strong> kargo@gokselmanav.com</li>
              <li><strong>Çalışma Saatleri:</strong> 08:00 - 22:00</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const orderNumber = ref('')
const trackingInfo = ref(null)
const error = ref('')
const isLoading = ref(false)

const trackOrder = async () => {
  if (!orderNumber.value) return
  
  isLoading.value = true
  error.value = ''
  trackingInfo.value = null
  
  // Simüle edilmiş API çağrısı
  setTimeout(() => {
    if (orderNumber.value.includes('GM-2024')) {
      trackingInfo.value = {
        orderNumber: orderNumber.value,
        orderDate: '22 Haziran 2024, 14:30',
        deliveryAddress: 'Örnek Mahallesi, Test Sokak No:123, İstanbul',
        totalAmount: '245,50 TL',
        steps: [
          {
            title: 'Sipariş Alındı',
            description: 'Siparişiniz başarıyla alındı ve onaylandı.',
            time: '22 Haziran 2024, 14:30',
            completed: true,
            current: false
          },
          {
            title: 'Hazırlanıyor',
            description: 'Siparişiniz hazırlanmaya başlandı.',
            time: '22 Haziran 2024, 15:00',
            completed: true,
            current: false
          },
          {
            title: 'Kargoya Verildi',
            description: 'Siparişiniz kargo firmasına teslim edildi.',
            time: '22 Haziran 2024, 16:15',
            completed: true,
            current: false
          },
          {
            title: 'Yolda',
            description: 'Siparişiniz size doğru yola çıktı.',
            time: '22 Haziran 2024, 16:30',
            completed: false,
            current: true
          },
          {
            title: 'Teslim Edildi',
            description: 'Siparişiniz teslim edildi.',
            time: 'Bekleniyor',
            completed: false,
            current: false
          }
        ]
      }
    } else {
      error.value = 'Bu sipariş numarası ile sipariş bulunamadı. Lütfen sipariş numaranızı kontrol edin.'
    }
    isLoading.value = false
  }, 1000)
}
</script>

<style scoped>
.tracking {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tracking-form {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
}

.tracking-form h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #42b983;
}

.btn-track {
  width: 100%;
  padding: 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-track:hover:not(:disabled) {
  background: #3aa876;
}

.btn-track:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.tracking-result {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 2rem;
}

.order-info {
  margin-bottom: 2rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.info-row:last-child {
  border-bottom: none;
}

.tracking-timeline h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.timeline {
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #eee;
}

.timeline-step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
  position: relative;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-weight: bold;
  z-index: 1;
}

.timeline-step.completed .step-icon {
  background: #42b983;
  color: white;
}

.timeline-step.current .step-icon {
  background: #ffc107;
  color: white;
}

.step-content {
  flex: 1;
}

.step-content h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.step-content p {
  margin: 0 0 0.5rem 0;
  color: #666;
}

.step-time {
  font-size: 0.9rem;
  color: #999;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.tracking-help {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
}

.help-content {
  display: grid;
  gap: 1.5rem;
}

.help-item h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.help-item p {
  color: #666;
  margin-bottom: 1rem;
}

.help-item ul {
  margin-left: 1.5rem;
}

.help-item li {
  margin-bottom: 0.5rem;
  color: #666;
}

@media (max-width: 768px) {
  .tracking {
    padding: 1rem;
    margin: 0.5rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .info-row {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .timeline-step {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .step-icon {
    margin-bottom: 1rem;
  }
}
</style> 