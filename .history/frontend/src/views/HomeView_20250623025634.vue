<template>
  <div class="starbucks-page">
    <!-- Üst: Restoran Bilgi Alanı -->
    <div class="restaurant-header d-none d-md-block">
      <div class="restaurant-info">
        <img class="restaurant-logo" src="/logogoksel.png" alt="Goksel Manav" @click="goToHome" />
        <div class="restaurant-meta">
          <h1 @click="goToHome">GOKSEL MANAV</h1>
          <div class="restaurant-details">
            <span class="delivery">TESLİMAT</span>
            <span class="delivery-info">18,99 TL teslimat ücreti <b>500 TL sepete ücretsiz teslimat</b></span>
            <span class="min-order">Min. sepet tutarı 100 TL</span>
          </div>
          <div class="restaurant-rating">
            <span class="star">★</span> 4.95 (1000+)
            <span class="reviews" @click="openCommentsModal">Yorumları Gör</span>
            <span class="about">Hakkında</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Menüde Ara ve Tab Menü -->
    <div class="menu-tabs-bar">
      <input type="text" v-model="search" class="menu-search" placeholder="Menüde Ara" />
      <div class="menu-tabs">
        <div
          v-for="category in categories"
          :key="category.id"
          :class="['menu-tab', { active: selectedCategoryId === category.id }]"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </div>
      </div>
    </div>

    <!-- Ürün Listesi -->
    <div class="products-list">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="product-row"
      >
        <div class="product-info">
          <div class="product-title">{{ product.name }}</div>
          <div class="product-price">{{ product.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) }}</div>
          <div class="product-desc">{{ cleanDescription(product.description) }}</div>
        </div>
        <div class="product-right">
          <img :src="product.image" :alt="product.name" class="product-img" />
          <button class="add-btn" @click="addToCart(product)">
            <span>+</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Sayfalama -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        class="page-btn" 
        :disabled="currentPage === 1"
        @click="currentPage = currentPage - 1"
      >
        ← Önceki
      </button>
      
      <div class="page-numbers">
        <button 
          v-for="page in visiblePages" 
          :key="page"
          :class="['page-number', { active: page === currentPage }]"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        class="page-btn" 
        :disabled="currentPage === totalPages"
        @click="currentPage = currentPage + 1"
      >
        Sonraki →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cart = useCartStore()

const products = ref<any[]>([])
const categories = ref<any[]>([])
const selectedCategoryId = ref<number | null>(null)
const search = ref('')
const currentPage = ref(1)
const itemsPerPage = 12

// Kategori veya arama değiştiğinde sayfa numarasını sıfırla
watch([selectedCategoryId, search], () => {
  currentPage.value = 1
})

onMounted(async () => {
  try {
    // Ürünleri ve kategorileri paralel olarak yükle
    const [productsResponse, categoriesResponse] = await Promise.all([
      axios.get('/backend/products'),
      axios.get('/backend/categories/main')
    ])
    
    products.value = productsResponse.data
    categories.value = categoriesResponse.data
    
    // İlk kategoriyi seç
    if (categories.value.length > 0) {
      selectedCategoryId.value = categories.value[0].id
    }
  } catch (error) {
    console.error('Veriler alınamadı:', error)
  }
})

const selectCategory = (categoryId: number) => {
  selectedCategoryId.value = categoryId
}

const filteredProducts = computed(() => {
  if (!products.value || !Array.isArray(products.value)) {
    return []
  }
  
  let filtered = products.value
  
  // Kategori filtresi
  if (selectedCategoryId.value) {
    filtered = filtered.filter(p => p.categoryId === selectedCategoryId.value)
  }
  
  // Arama filtresi
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.description.toLowerCase().includes(searchLower)
    )
  }
  
  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  const start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages.value, start + maxVisible - 1)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const paginatedProducts = computed(() => {
  if (!filteredProducts.value || !Array.isArray(filteredProducts.value)) {
    return []
  }
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

const addToCart = (product: any) => {
  cart.addToCart(product)
}

const cleanDescription = (description: string) => {
  if (!description) return '';
  
  // HTML tag'lerini kaldır
  let cleanText = description.replace(/<[^>]*>/g, '');
  
  // HTML karakterlerini decode et
  cleanText = cleanText
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  
  // Fazla boşlukları temizle
  cleanText = cleanText.replace(/\s+/g, ' ').trim();
  
  // İlk 120 karakteri al ve "..." ekle
  if (cleanText.length > 120) {
    cleanText = cleanText.substring(0, 120) + '...';
  }
  
  return cleanText;
}

const goToHome = () => {
  router.push('/')
}

const openCommentsModal = () => {
  // Implement the logic to open the comments modal
  console.log('Yorumları Gör clicked')
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
  cursor: pointer;
  transition: transform 0.2s ease;
}
.restaurant-logo:hover {
  transform: scale(1.05);
}
.restaurant-meta h1 {
  font-size: 2.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: color 0.2s ease;
}
.restaurant-meta h1:hover {
  color: #e52929;
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
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}
.page-btn {
  padding: 0.7rem 1.2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  color: #444;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.page-btn:hover {
  background: #e52929;
  color: #fff;
}
.page-numbers {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.page-number {
  padding: 0.7rem 1.2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  color: #444;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.page-number.active {
  background: #e52929;
  color: #fff;
}
</style> 