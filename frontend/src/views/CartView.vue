<template>
  <div class="cart-page">
    <div class="cart-header">Sepetim</div>
    <div v-if="!cart.items || cart.items.length === 0" class="cart-empty">
      Sepetinizde ürün yok.
    </div>
    <div v-else>
      <!-- Ürün Kartları -->
      <div class="cart-items">
        <div v-for="item in cart.items" :key="item.id" class="cart-item-card">
          <img :src="item.image" class="cart-item-img" />
          <div class="cart-item-info">
            <div class="cart-item-title-singleline">
              {{ item.name }}<span v-if="item.unit"> {{ item.unit }}</span>
            </div>
            <div class="cart-item-price-row">
              <span class="cart-item-price">{{ item.price.toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}) }}</span>
              <span v-if="item.oldPrice" class="cart-item-oldprice">{{ item.oldPrice.toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}) }}</span>
            </div>
          </div>
          <div class="cart-item-qty">
            <button class="qty-btn" @click="updateQuantity(item, item.quantity - 1)" :disabled="item.quantity <= 1">-</button>
            <span class="qty-value">{{ item.quantity }}</span>
            <button class="qty-btn" @click="updateQuantity(item, item.quantity + 1)">+</button>
          </div>
          <button class="cart-item-remove" @click="removeItem(item)">×</button>
        </div>
      </div>
      <!-- Bill Details -->
      <div class="bill-details-card">
        <div class="bill-row">
          <span>Ara Toplam</span>
          <span class="bill-value">{{ subtotal.toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}) }}</span>
        </div>
        <div class="bill-row">
          <span>Teslimat Ücreti</span>
          <span class="bill-value free">{{ deliveryFee > 0 ? deliveryFee.toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}) : 'Ücretsiz' }}</span>
        </div>
        <div class="bill-row" v-if="packingFee > 0">
          <span>Paketleme Ücreti</span>
          <span class="bill-value">{{ packingFee.toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}) }}</span>
        </div>
        <div class="bill-row" v-if="tax > 0">
          <span>KDV</span>
          <span class="bill-value">{{ tax.toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}) }}</span>
        </div>
        <div class="bill-row total">
          <span>Ödenecek Tutar</span>
          <span class="bill-value total">{{ total.toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}) }}</span>
        </div>
        <div v-if="discount > 0" class="bill-saved">Bu siparişte {{ discount.toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}) }} tasarruf ettiniz!</div>
      </div>
      <!-- Teslimat Tarihi ve Adres -->
      <div class="delivery-card">
        <div class="delivery-row">
          <i class="fas fa-calendar-alt delivery-icon"></i>
          <div class="delivery-info">
            <div class="delivery-label">Teslimat tarihi</div>
            <div class="delivery-date">{{ deliveryDate }}</div>
            <div class="delivery-time">{{ deliveryTime }}</div>
          </div>
          <button class="delivery-edit" @click="editDeliveryDate"><i class="fas fa-pen"></i></button>
        </div>
      </div>
      <!-- Adres ve ödeme yöntemi -->
      <div class="address-card">
        <textarea v-model="deliveryAddress" class="address-input" rows="2" placeholder="Teslimat Adresi" required></textarea>
        <div class="payment-method-row">
          <label><input type="radio" value="cod" v-model="paymentMethod" /> Kapıda Ödeme</label>
          <label><input type="radio" value="card" v-model="paymentMethod" /> Kredi/Banka Kartı</label>
        </div>
      </div>
      <!-- Sabit Sipariş Butonu ve Alt Bar -->
      <div class="cart-bottom-bar">
        <div class="cart-bottom-left">
          <div class="cart-bottom-items">{{ cart.items.length }} Ürün</div>
          <div class="cart-bottom-total">{{ total.toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}) }}</div>
        </div>
        <button class="place-order-btn" :disabled="!cart.items || cart.items.length === 0 || !deliveryAddress" @click="submitOrder">
          Siparişi ver
        </button>
      </div>
    </div>
    <!-- Sabit Alt Menü -->
    <div class="bottom-nav">
      <button class="nav-btn"><i class="fas fa-home"></i></button>
      <button class="nav-btn"><i class="fas fa-history"></i></button>
      <button class="nav-btn active"><i class="fas fa-shopping-cart"></i></button>
      <button class="nav-btn"><i class="fas fa-user"></i></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const cart = useCartStore()
const router = useRouter()
const authStore = useAuthStore()

const deliveryAddress = ref('')
const paymentMethod = ref('cod') // 'cod' or 'card'
const deliveryDate = ref(new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }))
const deliveryTime = ref('18:00 - 22:00')
const deliveryFee = 0 // Gerçek değerle değiştirilebilir
const packingFee = 0 // Gerçek değerle değiştirilebilir
const discount = 0 // Gerçek değerle değiştirilebilir

onMounted(() => {
  cart.fetchCart()
  if (authStore.user?.address) {
    deliveryAddress.value = authStore.user.address
  }
})

const subtotal = computed(() => (cart.items ? cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0))
const tax = computed(() => subtotal.value * 0.20)
const total = computed(() => subtotal.value + deliveryFee + packingFee + tax.value - discount)

const updateQuantity = (item: any, quantity: number) => {
  if (quantity < 1) return
  cart.updateQuantity(item.id, quantity)
}

const removeItem = (item: any) => {
  cart.removeFromCart(item.id)
}

const editDeliveryDate = () => {
  // Teslimat tarihi seçici açılabilir (isteğe bağlı)
  alert('Teslimat tarihi seçimi yakında!')
}

const submitOrder = async () => {
  if (!authStore.isAuthenticated || !authStore.user) {
    router.push('/login')
    return
  }
  if (paymentMethod.value === 'card') {
    router.push('/cashout')
  } else if (paymentMethod.value === 'cod') {
    try {
      if (!authStore.user) {
        alert('Sipariş oluşturmak için lütfen giriş yapın.');
        router.push('/login');
        return;
      }
      const orderData = {
        customerId: authStore.user.id,
        items: cart.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: total.value,
        shippingAddress: deliveryAddress.value,
        paymentMethod: 'cod',
      }
      await axios.post('/backend/orders/public', orderData)
      cart.clearCart()
      router.push('/orders')
      alert('Siparişiniz başarıyla alındı!')
    } catch (error) {
      console.error('Sipariş oluşturma hatası:', error)
      alert('Sipariş oluşturulurken bir hata oluştu.')
    }
  }
}
</script>

<style scoped>
.cart-page {
  background: #f6f7fb;
  min-height: 100vh;
  padding-bottom: 110px;
  font-family: 'Inter', Arial, sans-serif;
}
.cart-header {
  font-size: 1.5rem;
  font-weight: 700;
  padding: 1.2rem 1.2rem 0.5rem 1.2rem;
  color: #222;
}
.cart-empty {
  background: #fff;
  border-radius: 18px;
  margin: 2rem 1rem;
  padding: 2.5rem 1rem;
  text-align: center;
  color: #888;
  font-size: 1.1rem;
}
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  padding: 0.5rem 1rem 0.5rem 1rem;
}
.cart-item-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(24,103,192,0.07);
  padding: 0.7rem 1rem;
  position: relative;
  min-height: 70px;
}
.cart-item-img {
  width: 44px;
  height: 44px;
  object-fit: contain;
  border-radius: 12px;
  background: #f3f7fa;
  margin-right: 0.9rem;
}
.cart-item-info {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.cart-item-title-singleline {
  font-size: 1.08rem;
  font-weight: 600;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}
.cart-item-price-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.cart-item-price {
  color: #00b386;
  font-size: 1.05rem;
  font-weight: 700;
}
.cart-item-oldprice {
  color: #bbb;
  font-size: 0.98rem;
  text-decoration: line-through;
}
.cart-item-qty {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-left: 1.2rem;
}
.qty-btn {
  background: #fff;
  border: 1.5px solid #ff5a5f;
  color: #ff5a5f;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.qty-value {
  font-size: 1.1rem;
  font-weight: 600;
  min-width: 22px;
  text-align: center;
}
.cart-item-remove {
  background: #fff;
  border: 1.5px solid #eee;
  color: #ff5a5f;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  font-weight: 700;
  margin-left: 0.7rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.cart-item-remove:hover {
  background: #ff5a5f;
  color: #fff;
}
.bill-details-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(24,103,192,0.07);
  margin: 1.2rem 1rem 0.7rem 1rem;
  padding: 1.2rem 1.2rem 0.7rem 1.2rem;
}
.bill-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.05rem;
  margin-bottom: 0.5rem;
}
.bill-value {
  font-weight: 600;
  color: #222;
}
.bill-value.free {
  color: #00b386;
}
.bill-row.total {
  font-size: 1.15rem;
  font-weight: 700;
  margin-top: 0.7rem;
  margin-bottom: 0.7rem;
}
.bill-value.total {
  color: #ff5a5f;
}
.bill-saved {
  background: #00b386;
  color: #fff;
  border-radius: 8px;
  padding: 0.5rem 0.7rem;
  font-size: 0.98rem;
  margin-top: 0.7rem;
  text-align: center;
}
.delivery-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(24,103,192,0.07);
  margin: 1.2rem 1rem 0.7rem 1rem;
  padding: 1rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.delivery-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.delivery-icon {
  color: #ff5a5f;
  font-size: 1.3rem;
}
.delivery-info {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.delivery-label {
  font-size: 0.98rem;
  color: #888;
}
.delivery-date {
  font-size: 1.08rem;
  font-weight: 600;
  color: #222;
}
.delivery-time {
  font-size: 0.98rem;
  color: #888;
}
.delivery-edit {
  background: #fff;
  border: 1.5px solid #eee;
  color: #ff5a5f;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.delivery-edit:hover {
  background: #ff5a5f;
  color: #fff;
}
.address-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(24,103,192,0.07);
  margin: 1.2rem 1rem 0.7rem 1rem;
  padding: 1rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.address-input {
  width: 100%;
  border: 1.5px solid #eee;
  border-radius: 8px;
  padding: 0.7rem;
  font-size: 1.05rem;
  color: #222;
  resize: none;
}
.payment-method-row {
  display: flex;
  gap: 1.2rem;
  font-size: 1.05rem;
  color: #222;
  margin-top: 0.2rem;
}
.cart-bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 60px;
  background: #fff;
  box-shadow: 0 -2px 12px rgba(24,103,192,0.07);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1.2rem;
  z-index: 101;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
}
.cart-bottom-left {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.cart-bottom-items {
  font-size: 1.02rem;
  color: #888;
}
.cart-bottom-total {
  font-size: 1.18rem;
  font-weight: 700;
  color: #ff5a5f;
}
.place-order-btn {
  background: #ff5a5f;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.13rem;
  font-weight: 700;
  padding: 0.8rem 2.1rem;
  box-shadow: 0 2px 8px rgba(255,90,95,0.10);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.place-order-btn:disabled {
  background: #ffd6d8;
  color: #fff;
  cursor: not-allowed;
}
.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  z-index: 100;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  box-shadow: 0 -2px 12px rgba(24,103,192,0.10);
}
.nav-btn {
  background: none;
  border: none;
  color: #bbb;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  height: 100%;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.nav-btn.active, .nav-btn:focus {
  background: #ff5a5f;
  color: #fff;
  border-radius: 12px;
}
@media (max-width: 700px) {
  .cart-header {
    font-size: 1.2rem;
    padding: 1rem 0.7rem 0.5rem 0.7rem;
  }
  .cart-items {
    padding: 0.5rem 0.3rem 0.5rem 0.3rem;
  }
  .bill-details-card, .delivery-card, .address-card {
    margin: 1.2rem 0.3rem 0.7rem 0.3rem;
    padding: 1rem 0.7rem;
  }
  .cart-bottom-bar {
    padding: 0.7rem 0.7rem;
  }
}
</style> 