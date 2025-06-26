<template>
  <div class="cashout-page">
    <h1 class="page-title">Alışverişi Tamamla</h1>

    <!-- Sipariş Özeti -->
    <div class="order-summary">
      <h2 class="section-title">Sipariş Özeti</h2>
      <div v-if="cart.items.length > 0" class="items-list">
        <div v-for="item in cart.items" :key="item.id" class="summary-item">
          <span>{{ item.name }} x{{ item.quantity }}</span>
          <span>{{ (item.price * item.quantity).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) }}</span>
        </div>
      </div>
      <div class="summary-total">
        <div class="total-row">
          <span>Ara Toplam</span>
          <span>{{ subtotal.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) }}</span>
        </div>
        <div class="total-row">
          <span>KDV (%20)</span>
          <span>{{ tax.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) }}</span>
        </div>
        <div class="total-row grand-total">
          <span>Genel Toplam</span>
          <span>{{ total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) }}</span>
        </div>
      </div>
    </div>

    <form @submit.prevent="submitOrder">
      <!-- Teslimat Adresi -->
      <div class="delivery-address">
        <h2 class="section-title">Teslimat Adresi</h2>
        <div class="form-group">
          <label for="address">Adresiniz</label>
          <textarea
            id="address"
            v-model="deliveryAddress"
            rows="3"
            placeholder="Lütfen teslimat adresinizi girin..."
            required
          ></textarea>
        </div>
      </div>

      <!-- Ödeme Yöntemi -->
      <div class="payment-method">
        <h2 class="section-title">Ödeme Yöntemi</h2>
        <div class="payment-options">
          <div
            class="payment-option"
            :class="{ selected: selectedPaymentMethod === 'cod' }"
            @click="selectedPaymentMethod = 'cod'"
          >
            <input type="radio" id="cod" value="cod" v-model="selectedPaymentMethod" />
            <label for="cod">Kapıda Ödeme</label>
          </div>
          <div
            class="payment-option"
            :class="{ selected: selectedPaymentMethod === 'card' }"
            @click="selectedPaymentMethod = 'card'"
          >
            <input type="radio" id="card" value="card" v-model="selectedPaymentMethod" />
            <label for="card">Kredi/Banka Kartı</label>
          </div>
        </div>
      </div>

      <!-- Kredi Kartı Formu -->
      <div v-if="selectedPaymentMethod === 'card'" class="credit-card-form">
        <h3 class="subsection-title">Kart Bilgileri</h3>
        <div class="form-group">
          <label for="cardHolder">Kart Sahibi</label>
          <input id="cardHolder" v-model="cardDetails.cardHolder" required placeholder="Ad Soyad" />
        </div>
        <div class="form-group">
          <label for="cardNumber">Kart Numarası</label>
          <div id="card-element"></div>
          <!-- Stripe Card Element buraya gelecek -->
        </div>
        <div v-if="cardError" class="card-error">{{ cardError }}</div>
      </div>

      <button type="submit" class="btn-submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'İşleniyor...' : 'Siparişi Tamamla' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'

const VITE_STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

const cart = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const deliveryAddress = ref('')
const selectedPaymentMethod = ref('cod') // 'cod' for Cash on Delivery, 'card' for Credit Card
const isSubmitting = ref(false)

const cardDetails = ref({
  cardHolder: '',
})
const cardError = ref('')
let stripe: any = null
let cardElement: any = null

const subtotal = computed(() => cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0))
const tax = computed(() => subtotal.value * 0.20) // KDV %20
const total = computed(() => subtotal.value + tax.value)

onMounted(async () => {
  if (authStore.user && authStore.user.address) {
    deliveryAddress.value = authStore.user.address
  }

  if (VITE_STRIPE_PUBLISHABLE_KEY) {
    stripe = await loadStripe(VITE_STRIPE_PUBLISHABLE_KEY)
    const elements = stripe.elements()
    cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
        },
      },
    })
    cardElement.mount('#card-element')
    cardElement.on('change', (event: any) => {
      if (event.error) {
        cardError.value = event.error.message
      } else {
        cardError.value = ''
      }
    })
  }
})

const submitOrder = async () => {
  isSubmitting.value = true
  if (selectedPaymentMethod.value === 'cod') {
    await handleCashOnDelivery()
  } else if (selectedPaymentMethod.value === 'card') {
    await handleCardPayment()
  }
  isSubmitting.value = false
}

const handleCashOnDelivery = async () => {
  try {
    const orderData = {
      customerId: authStore.user?.id,
      items: cart.items.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price })),
      total: total.value,
      shippingAddress: deliveryAddress.value,
      paymentMethod: 'cod',
    }
    await axios.post('/backend/orders', orderData)
    cart.clearCart()
    router.push('/orders')
    alert('Siparişiniz başarıyla alındı!')
  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error)
    alert('Sipariş oluşturulurken bir hata oluştu.')
  }
}

const handleCardPayment = async () => {
  if (!stripe || !cardElement) {
    alert('Ödeme sistemi yüklenemedi.')
    return
  }

  try {
    const { data: clientSecret } = await axios.post('/backend/payment/create-payment-intent', {
      amount: Math.round(total.value * 100), // Amount in cents
    })

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: cardDetails.value.cardHolder,
        },
      },
    })

    if (error) {
      cardError.value = error.message
      return
    }

    if (paymentIntent.status === 'succeeded') {
      const orderData = {
        customerId: authStore.user?.id,
        items: cart.items.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price })),
        total: total.value,
        shippingAddress: deliveryAddress.value,
        paymentMethod: 'card',
        paymentIntentId: paymentIntent.id,
      }
      await axios.post('/backend/orders', orderData)
      cart.clearCart()
      router.push('/orders')
      alert('Ödemeniz ve siparişiniz başarıyla alındı!')
    }
  } catch (err) {
    console.error('Ödeme hatası:', err)
    alert('Ödeme sırasında bir hata oluştu.')
  }
}
</script>

<style scoped>
.cashout-page {
  max-width: 600px;
  margin: 2rem auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 2.5rem;
}

.page-title {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #42b983;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.order-summary, .delivery-address, .payment-method, .credit-card-form {
  margin-bottom: 2rem;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  color: #555;
}

.summary-total {
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #333;
}

.grand-total {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-top: 1rem;
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #42b983;
}

.payment-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}

.payment-option.selected {
  border-color: #42b983;
  background-color: #f0f8f5;
}

.payment-option input[type="radio"] {
  width: 1.2rem;
  height: 1.2rem;
}

.subsection-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

#card-element {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.card-error {
  color: #c62828;
  margin-top: 0.5rem;
}

.btn-submit {
  width: 100%;
  padding: 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #3aa876;
}

.btn-submit:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style> 