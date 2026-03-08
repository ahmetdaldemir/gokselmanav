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
            <span class="star">★</span> {{ ratingStats.averageRating }} ({{ ratingStats.totalComments }}+)
            <span class="reviews" @click="openCommentsModal">Yorumları Gör</span>
            <span class="about" @click="openAboutModal">Hakkında</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Kategori ve alt kategori sekmeleri eski haline döndürülüyor -->
    <div class="menu-tabs-bar">
      <input type="text" v-model="search" class="menu-search" placeholder="Menüde Ara" />
      <div class="menu-tabs">
        <template v-for="(categories, level) in categoriesStack" :key="'level-' + level">
          <div v-if="level > 0" class="menu-tab back-tab" @click="goBackCategory(level)">
            ← Geri
          </div>
          <div
            v-for="category in categories"
            :key="category.id"
            :class="['menu-tab', { active: selectedCategoryIds[level] === category.id }]"
            @click="selectCategory(category, level)"
          >
            {{ category.name }}
          </div>
        </template>
      </div>
    </div>

    <!-- Ürün Listesi (Grid ve modern kartlar) -->
    <div class="products-grid">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="product-card-modern"
      >
        <div class="product-img-modern-wrap">
          <img :src="product.image" :alt="product.name" class="product-img-modern" />
        </div>
        <div class="product-content-modern">
          <div class="product-title-modern">{{ product.name }}</div>
          <div class="product-rating-modern">
            <span class="star">★</span> 5.0 <span class="rating-count">(962)</span>
          </div>
          <div class="product-price-modern">{{ product.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) }}</div>
        </div>
        <button class="add-btn-modern" @click="addToCart(product)">
          <span>+</span>
        </button>
      </div>
    </div>

    <!-- Sabit Alt Menü modern kalacak -->
    <div class="bottom-nav">
      <button class="nav-btn active"><i class="fas fa-home"></i></button>
      <button class="nav-btn"><i class="fas fa-heart"></i></button>
      <button class="nav-btn cart-btn"><i class="fas fa-shopping-cart"></i></button>
      <button class="nav-btn"><i class="fas fa-user"></i></button>
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
const hierarchicalCategories = ref<any[]>([])
const subCategories = ref<any[]>([])
const selectedCategoryId = ref<number | null>(null)
const search = ref('')
const currentPage = ref(1)
const itemsPerPage = 12
const ratingStats = ref({ averageRating: 4.95, totalComments: 1000 })
const categoriesStack = ref<any[][]>([])
const selectedCategoryIds = ref<number[]>([])
const categoriesTab = ref(['Fruit', 'Vegetable', 'Milk', 'Dry Fruit', 'Spices', 'Butter'])
const selectedTab = ref('Fruit')

// Kategori veya arama değiştiğinde sayfa numarasını sıfırla
watch([selectedCategoryId, search], () => {
  currentPage.value = 1
})

onMounted(async () => {
  try {
    // Ana kategorileri yükle
    const mainCategoriesResponse = await axios.get('/backend/categories/main')
    categoriesStack.value = [mainCategoriesResponse.data]
    selectedCategoryIds.value = []
    // Ürünleri ve rating istatistiklerini yükle
    const [productsResponse, statsResponse] = await Promise.all([
      axios.get('/backend/products'),
      axios.get('/backend/comments/stats')
    ])
    products.value = productsResponse.data
    ratingStats.value = statsResponse.data
  } catch (error) {
    console.error('Veriler alınamadı:', error)
  }
})

const selectCategory = async (category: any, level: number) => {
  selectedCategoryIds.value = selectedCategoryIds.value.slice(0, level)
  selectedCategoryIds.value[level] = category.id
  // Alt kategorileri getir
  const subCategoriesResponse = await axios.get(`/backend/categories/sub/${category.id}`)
  const subCategories = subCategoriesResponse.data
  categoriesStack.value = categoriesStack.value.slice(0, level + 1)
  if (subCategories.length > 0) {
    categoriesStack.value.push(subCategories)
  }
  // Seçili kategoriye göre ürünleri filtrele
  selectedCategoryId.value = category.id
}

const goBackCategory = (level: number) => {
  categoriesStack.value = categoriesStack.value.slice(0, level)
  selectedCategoryIds.value = selectedCategoryIds.value.slice(0, level - 1)
  if (level === 1) {
    selectedCategoryId.value = null
  } else {
    selectedCategoryId.value = selectedCategoryIds.value[level - 2] || null
  }
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
  // Emit an event to open comments modal
  const event = new CustomEvent('openCommentsModal')
  window.dispatchEvent(event)
}

const openAboutModal = () => {
  // Emit an event to open about modal
  const event = new CustomEvent('openAboutModal')
  window.dispatchEvent(event)
}
</script>

<style scoped>
.starbucks-page {
  background: #f6f7fb;
  min-height: 100vh;
  padding-bottom: 80px;
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
  padding: 1rem 1rem 0.5rem 1rem;
  background: #f6f7fb;
}
.menu-search {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.menu-tabs {
  display: flex;
  gap: 0.7rem;
  padding: 0.5rem 0;
  overflow-x: auto;
  background: #f6f7fb;
}
.menu-tab {
  background: #fff;
  border: none;
  border-radius: 16px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  color: #1867C0;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  box-shadow: 0 2px 8px rgba(24,103,192,0.06);
}
.menu-tab.active, .menu-tab:hover {
  background: #1867C0;
  color: #fff;
}
.menu-tab.back-tab {
  background: #1867C0;
  color: #fff;
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
  padding: 1.2rem 1rem 2.5rem 1rem;
}
.product-card-modern {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(24,103,192,0.10);
  padding: 0 0 1.8rem 0;
  min-height: 240px;
  transition: box-shadow 0.2s, transform 0.2s;
  overflow: hidden;
}
.product-card-modern:hover {
  box-shadow: 0 12px 40px rgba(24,103,192,0.16);
  transform: translateY(-2px) scale(1.01);
}
.product-img-modern-wrap {
  width: 100%;
   display: flex;
  justify-content: center;
  align-items: flex-end;
  border-top-left-radius: 22px;
  border-top-right-radius: 22px;
  min-height: 90px;
  max-height: 120px;
  overflow: hidden;
}
.product-img-modern {
  width: 100%;
  max-width: 100px;
  height: 80px;
  object-fit: contain;
  border-radius: 0 0 18px 18px;
   margin-top: 0.5rem;
}
.product-content-modern {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.5rem 0.5rem 0 0.5rem;
}
.product-title-modern {
  font-size: 1.05rem;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 0.1rem;
}
.product-rating-modern {
  color: #f7b731;
  font-size: 0.97rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 0.1rem;
}
.product-rating-modern .star {
  font-size: 1.1rem;
}
.product-rating-modern .rating-count {
  color: #888;
  font-size: 0.93rem;
  font-weight: 400;
}
.product-price-modern {
  font-size: 1.13rem;
  font-weight: 700;
  color: #1867C0;
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
  text-align: center;
}
.add-btn-modern {
  position: absolute;
  right: 1.1rem;
  bottom: 1.1rem;
  background: #1867C0;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(24,103,192,0.10);
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  z-index: 2;
}
.add-btn-modern:hover {
  background: #145a99;
  transform: scale(1.08);
}
.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #1867C0;
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
  color: #fff;
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
  background: #fff;
  color: #1867C0;
  border-radius: 12px;
}
.cart-btn {
  position: relative;
}
.cart-btn::after {
  content: '';
  position: absolute;
  top: 10px;
  right: 18px;
  width: 8px;
  height: 8px;
  background: #f7b731;
  border-radius: 50%;
  display: block;
}
@media (max-width: 700px) {
  .products-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.7rem;
    padding: 0.7rem 0.3rem 2.5rem 0.3rem;
  }
  .product-card-modern {
    min-height: 180px;
    border-radius: 16px;
  }
  .product-img-modern-wrap {
    min-height: 60px;
    max-height: 80px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
  .product-img-modern {
    max-width: 70px;
    height: 50px;
  }
  .add-btn-modern {
    width: 34px;
    height: 34px;
    font-size: 1.1rem;
    right: 0.5rem;
    bottom: 0.5rem;
  }
  .bottom-nav {
    height: 54px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
  .nav-btn {
    font-size: 1.2rem;
  }
}
</style> 