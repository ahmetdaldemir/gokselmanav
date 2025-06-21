<template>
  <div class="starbucks-page">
    <!-- Üst: Restoran Bilgi ve Slider Alanı -->
    <div class="restaurant-header">
      <div class="restaurant-info">
        <img class="restaurant-logo" src="https://upload.wikimedia.org/wikipedia/sco/thumb/4/45/Starbucks_Coffee_Logo.svg/1200px-Starbucks_Coffee_Logo.svg.png" alt="Starbucks Coffee" />
        <div class="restaurant-meta">
          <h1>GOKSEL MANAV</h1>
          <div class="restaurant-details">
            <span class="delivery">TESLİMAT</span>
            <span class="delivery-info">18,99 TL teslimat ücreti <b>500 TL sepete ücretsiz teslimat</b></span>
            <span class="min-order">Min. sepet tutarı 100 TL</span>
          </div>
          <div class="restaurant-rating">
            <span class="star">★</span> 3.95 (1000+)
            <span class="reviews">Yorumları Gör</span>
            <span class="about">Hakkında</span>
          </div>
        </div>
      </div>
      <div class="slider-area">
        <div class="slider-track">
          <div v-for="(slide, i) in slides" :key="i" class="slider-item">
            <img :src="slide" alt="Kampanya" />
          </div>
        </div>
      </div>
    </div>

    <!-- Menüde Ara ve Tab Menü -->
    <div class="menu-tabs-bar">
      <input type="text" v-model="search" class="menu-search" placeholder="Menüde Ara" />
      <div class="menu-tabs">
        <div
          v-for="(cat, i) in categories"
          :key="cat"
          :class="['menu-tab', { active: selectedCategory === cat }]"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </div>
      </div>
    </div>

    <!-- Ürün Listesi -->
    <div class="products-list">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-row"
      >
        <div class="product-info">
          <div class="product-title">{{ product.name }}</div>
          <div class="product-price">{{ product.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) }}</div>
          <div class="product-desc">{{ product.description }}</div>
        </div>
        <div class="product-right">
          <img :src="product.image" :alt="product.name" class="product-img" />
          <button class="add-btn" @click="addToCart(product)">
            <span>+</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

const slides = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80'
]

const categories = [
  'Popüler',
  'Menüler',
  '%20 İndirimli Ürünler',
  'Espressolu İçecekler - Latte',
  'Espressolu İçecekler - Americano',
  'Tatlılar',
  'Diğer'
]
const selectedCategory = ref(categories[0])
const search = ref('')

const products = ref([
  { id: 1, name: 'Iced Caffè Latte', price: 145, description: 'Buzlu sütlü kahve (Süt içerir.)', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80', category: 'Popüler' },
  { id: 2, name: 'Caffè Latte', price: 145, description: 'Sütlü kahve (Süt içerir.)', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', category: 'Popüler' },
  { id: 3, name: 'Cool Lime Refresha®', price: 190, description: 'Misket limonu aromalı buzlu içecek', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80', category: 'Popüler' },
  { id: 4, name: 'Caramel Macchiato', price: 180, description: 'Karamelize şekerli ve vanilya aromalı sütlü kahve', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80', category: 'Popüler' },
  { id: 5, name: 'Espresso', price: 90, description: 'Yoğun aromalı espresso', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', category: 'Espressolu İçecekler - Americano' },
  { id: 6, name: 'Latte', price: 120, description: 'Sütlü espresso', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', category: 'Espressolu İçecekler - Latte' },
  { id: 7, name: 'Cheesecake', price: 95, description: 'Kremalı tatlı', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', category: 'Tatlılar' },
  { id: 8, name: 'Brownie', price: 85, description: 'Çikolatalı kek', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80', category: 'Tatlılar' }
])

const filteredProducts = computed(() => {
  return products.value.filter(
    p => (selectedCategory.value === 'Popüler' || p.category === selectedCategory.value) &&
      (p.name.toLowerCase().includes(search.value.toLowerCase()) || p.description.toLowerCase().includes(search.value.toLowerCase()))
  )
})

const addToCart = (product: any) => {
  cart.addToCart(product)
}
</script>

<style scoped>
.starbucks-page {
  margin: 0 auto;
  padding: 2rem 1rem 3rem 1rem;
}
.restaurant-header {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 1.5rem;
}
.restaurant-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.restaurant-logo {
  width: 90px;
  height: 90px;
  border-radius: 16px;
  background: #fff;
  object-fit: contain;
  border: 1px solid #eee;
}
.restaurant-meta h1 {
  font-size: 2.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.restaurant-details {
  color: #444;
  font-size: 1rem;
  margin-bottom: 0.3rem;
}
.delivery {
  color: #e52929;
  font-weight: 600;
  margin-right: 0.7rem;
}
.delivery-info {
  color: #e52929;
  font-weight: 500;
  margin-right: 0.7rem;
}
.min-order {
  color: #888;
}
.restaurant-rating {
  color: #e52929;
  font-size: 1rem;
  margin-top: 0.2rem;
}
.restaurant-rating .star {
  color: #f7b500;
  font-size: 1.1rem;
  margin-right: 0.2rem;
}
.restaurant-rating .reviews, .restaurant-rating .about {
  color: #444;
  margin-left: 1.2rem;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.98rem;
}
.slider-area {
  flex: 1;
  min-width: 200px;
  max-width: 350px;
  height: 38px;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: 12px;
  background: #f7f7f7;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.slider-track {
  display: flex;
  animation: slide-left 12s linear infinite;
  gap: 1.5rem;
}
.slider-item img {
  height: 36px;
  width: auto;
  border-radius: 8px;
  object-fit: cover;
}
@keyframes slide-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-60%); }
}
.menu-tabs-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}
.menu-search {
  padding: 0.7rem 1.2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  min-width: 220px;
}
.menu-tabs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.menu-tab {
  padding: 0.7rem 1.3rem;
  border-radius: 20px;
  background: #f7f7f7;
  color: #444;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  font-size: 1rem;
}
.menu-tab.active {
  background: #e52929;
  color: #fff;
}
.products-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
}
@media (max-width: 1100px) {
  .products-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 700px) {
  .products-list {
    grid-template-columns: 1fr;
  }
}
.product-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 1.2rem 1.5rem;
  gap: 1.5rem;
  min-width: 0;
}
.product-info {
  flex: 1;
  min-width: 0;
}
.product-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}
.product-price {
  color: #e52929;
  font-weight: 700;
  margin-bottom: 0.3rem;
}
.product-desc {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}
.product-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.product-img {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  object-fit: cover;
  background: #eee;
}
.add-btn {
  background: #fff;
  border: 2px solid #e52929;
  color: #e52929;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.add-btn:hover {
  background: #e52929;
  color: #fff;
}
@media (max-width: 900px) {
  .starbucks-page {
    padding: 1rem 0.2rem 2rem 0.2rem;
  }
  .restaurant-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .slider-area {
    max-width: 100%;
    width: 100%;
  }
  .menu-tabs-bar {
    flex-direction: column;
    gap: 1rem;
  }
  .product-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
  }
  .product-right {
    align-self: flex-end;
  }
}
</style> 