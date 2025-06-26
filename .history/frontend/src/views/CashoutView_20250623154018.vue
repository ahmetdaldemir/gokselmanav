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
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const cart = useCartStore()
const auth = useAuthStore()
const total = computed(() => cart.items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0))
const totalWithTax = computed(() => total.value * 1.18)

const cardNumber = ref('')
const cardHolder = ref('')
const expiry = ref('')
const cvv = ref('')

const formatExpiry = (e: Event) => {
  let value = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '')
  if (value.length > 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4)
  }
  expiry.value = value
}

const submitPayment = async () => {
  try {
    const [expiryMonth, expiryYear] = expiry.value.split('/');
    
    const paymentData = {
      cardNumber: cardNumber.value,
      cardHolder: cardHolder.value,
      expiry: expiry.value,
      cvv: cvv.value,
      amount: totalWithTax.value,
      orderDetails: {
        customerId: auth.user?.id,
        items: cart.items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      }
    };

    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();
    
    if (result.success) {
      alert('Ödeme başarılı! Siparişiniz oluşturuldu.');
      cart.clearCart(); // Assuming you have a clearCart method in your store
      // You might want to redirect to a success page or order details page
    } else {
      alert(`Ödeme başarısız: ${result.message}`);
    }
  } catch (error) {
    console.error('Ödeme hatası:', error);
    alert('Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
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