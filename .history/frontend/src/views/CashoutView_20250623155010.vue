<template>
  <div class="cashout-page">
    <h1 class="page-title">Kredi Kartı ile Ödeme</h1>

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

    <!-- Ödeme Formu (Basit) -->
    <form class="payment-form" @submit.prevent="submitPayment">
      <div class="form-group">
        <label for="cardHolder">Kart Sahibi</label>
        <input id="cardHolder" v-model="cardHolder" required placeholder="Ad Soyad" />
      </div>
      <div class="form-group">
        <label for="cardNumber">Kart Numarası</label>
        <input id="cardNumber" v-model="cardNumber" required placeholder="0000 0000 0000 0000" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="expiry">Son Kullanma (AA/YY)</label>
          <input id="expiry" v-model="expiry" required placeholder="AA/YY" />
        </div>
        <div class="form-group">
          <label for="cvv">CVV</label>
          <input id="cvv" v-model="cvv" required placeholder="123" />
        </div>
      </div>
      <button type="submit" class="btn-submit">
        Ödemeyi Tamamla (Yakında)
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

const cardHolder = ref('')
const cardNumber = ref('')
const expiry = ref('')
const cvv = ref('')

const subtotal = computed(() => (cart.items ? cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0))
const tax = computed(() => subtotal.value * 0.20)
const total = computed(() => subtotal.value + tax.value)

const submitPayment = () => {
  alert('Bu ödeme yöntemi yakında aktif olacaktır.')
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

.order-summary, .payment-form {
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

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #42b983;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.btn-submit:hover {
  background: #3aa876;
}
</style> 