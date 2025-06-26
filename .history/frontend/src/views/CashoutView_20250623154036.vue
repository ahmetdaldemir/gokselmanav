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
  max-width: 500px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 2rem;
}
.order-summary {
  margin-bottom: 2rem;
}
.order-summary ul {
  padding-left: 1.2rem;
}
.order-summary .total {
  margin-top: 1rem;
  font-size: 1.2rem;
}
.payment-form label {
  display: block;
  margin-bottom: 0.2rem;
  font-weight: 500;
}
.payment-form input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}
.payment-form .row {
  display: flex;
  gap: 1rem;
}
button[type="submit"] {
  width: 100%;
  background: #1867C0;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.8rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
}
button[type="submit"]:hover {
  background: #145399;
}
</style> 