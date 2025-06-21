<template>
  <div class="cashout-page">
    <h1>Ödeme</h1>
    <div class="order-summary">
      <h2>Sipariş Özeti</h2>
      <ul>
        <li v-for="item in cart.items" :key="item.id">
          {{ item.name }} x{{ item.quantity }} - {{ ((item.price * item.quantity) * 1.18).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) }}
        </li>
      </ul>
      <div class="total">
        Toplam: <b>{{ totalWithTax.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) }}</b>
      </div>
    </div>
    <form class="payment-form" @submit.prevent="submitPayment">
      <h2>Kredi Kartı Bilgileri</h2>
      <div>
        <label>Kart Numarası</label>
        <input v-model="cardNumber" maxlength="16" required placeholder="0000000000000000" />
      </div>
      <div>
        <label>Kart Sahibi</label>
        <input v-model="cardHolder" required placeholder="Ad Soyad" />
      </div>
      <div class="row">
        <div>
          <label>Son Kullanma (AA/YY)</label>
          <input v-model="expiry" maxlength="5" required placeholder="AA/YY" @input="formatExpiry" />
        </div>
        <div>
          <label>CVV</label>
          <input v-model="cvv" maxlength="4" required placeholder="CVV" />
        </div>
      </div>
      <button type="submit">Ödemeyi Tamamla</button>
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