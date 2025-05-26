<template>
  <div>
    <!-- Kategori Menüsü -->
    <v-container class="py-4 px-0" fluid>
      <v-slide-group show-arrows center-active>
        <v-slide-group-item v-for="category in categories" :key="category" v-slot="{ isSelected, toggle }">
          <v-btn
            class="mx-2"
            :color="isSelected ? 'primary' : 'grey-lighten-2'"
            variant="flat"
            @click="toggle"
            style="min-width: 120px;"
          >
            {{ category }}
          </v-btn>
        </v-slide-group-item>
      </v-slide-group>
    </v-container>

    <!-- Hero Banner -->
    <div class="hero-banner">
      <v-carousel
        cycle
        height="500"
        hide-delimiter-background
        show-arrows="hover"
      >
        <v-carousel-item v-for="(slide, i) in slides" :key="i">
          <v-img :src="slide.image" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" cover height="500">
            <div class="fill-height d-flex align-end">
              <v-container>
                <div class="text-white" style="max-width: 500px;">
                  <h2 class="text-h4 font-weight-bold mb-2">{{ slide.title }}</h2>
                  <p class="text-body-1">{{ slide.description }}</p>
                  <v-btn color="primary" size="large" class="mt-4">Alışverişe Başla</v-btn>
                </div>
              </v-container>
            </div>
          </v-img>
        </v-carousel-item>
      </v-carousel>
    </div>

    <!-- Products Section -->
    <v-container class="py-12">
      <div class="d-flex align-center justify-space-between mb-8">
        <h2 class="text-h5 font-weight-bold">Taze Ürünlerimiz</h2>
        <v-btn variant="outlined" color="primary">Tümünü Gör</v-btn>
      </div>
      
      <v-row>
        <v-col v-for="product in products" :key="product.id" cols="6" sm="4" md="3">
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              :elevation="isHovering ? 4 : 1"
              class="h-100"
            >
              <v-img
                :src="product.image"
                height="200"
                cover
                class="align-end"
              >
                <v-fade-transition>
                  <div
                    v-if="isHovering"
                    class="d-flex justify-center align-center transition-fast-in-fast-out bg-black v-card--reveal text-center"
                    style="height: 100%;"
                  >
                    <v-btn
                      variant="outlined"
                      color="white"
                      @click="addToCart(product)"
                    >
                      Sepete Ekle
                    </v-btn>
                  </div>
                </v-fade-transition>
              </v-img>

              <v-card-title class="pt-4">
                {{ product.name }}
                <div class="text-primary font-weight-bold mt-1">
                  {{ product.price.toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}) }}
                </div>
              </v-card-title>

              <v-card-actions>
                <v-row align="center" no-gutters>
                  <v-col cols="8">
                    <v-rating
                      :model-value="4"
                      color="amber"
                      density="compact"
                      size="small"
                      readonly
                    ></v-rating>
                  </v-col>
                  <v-col cols="4" class="text-caption text-grey">
                    (12 yorum)
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>

    <!-- Features Section -->
    <v-container class="py-12 bg-grey-lighten-4">
      <v-row>
        <v-col cols="12" sm="4">
          <div class="text-center">
            <v-icon size="48" color="primary" class="mb-4">mdi-truck-delivery-outline</v-icon>
            <h3 class="text-h6 font-weight-bold mb-2">Aynı Gün Teslimat</h3>
            <p class="text-body-2">Şehir içi siparişlerde aynı gün teslimat</p>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="text-center">
            <v-icon size="48" color="primary" class="mb-4">mdi-leaf</v-icon>
            <h3 class="text-h6 font-weight-bold mb-2">Organik & Doğal</h3>
            <p class="text-body-2">Tüm ürünlerimiz taze ve doğaldır</p>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="text-center">
            <v-icon size="48" color="primary" class="mb-4">mdi-cash-multiple</v-icon>
            <h3 class="text-h6 font-weight-bold mb-2">Uygun Fiyat</h3>
            <p class="text-body-2">Her bütçeye uygun fiyatlar</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@vueuse/head'
import { useCartStore } from '@/stores/cart'

useHead({
  title: 'Taze Manav Ürünleri | Goksel Manav',
  meta: [
    { name: 'description', content: 'En taze sebze, meyve ve organik ürünler. Hızlı teslimat ve uygun fiyatlarla manav alışverişi.' },
    { property: 'og:title', content: 'Taze Manav Ürünleri | Goksel Manav' },
    { property: 'og:description', content: 'En taze sebze, meyve ve organik ürünler. Hızlı teslimat ve uygun fiyatlarla manav alışverişi.' },
    { property: 'og:type', content: 'website' }
  ]
})

const cart = useCartStore()

const categories = [
  'Sebze',
  'Meyve',
  'Organik',
  'Kampanyalar',
  'Yeni Ürünler',
  'İçecek',
  'Atıştırmalık',
  'Temel Gıda',
  'Diğer'
]

interface Product {
  id: number
  name: string
  price: number
  image: string
}

interface Slide {
  title: string
  description: string
  image: string
}

const slides = ref<Slide[]>([
  {
    title: 'Yeni Sezon Koleksiyonu',
    description: 'En yeni ürünlerimizi keşfedin ve modaya öncülük edin. Sınırlı sayıda, kaçırmayın!',
    image: 'https://picsum.photos/1920/1080?random=1'
  },
  {
    title: 'Büyük Yaz İndirimi',
    description: 'Seçili ürünlerde %50\'ye varan indirimler. Yaz fırsatlarını yakalayın!',
    image: 'https://picsum.photos/1920/1080?random=2'
  }
])

const products = ref<Product[]>([
  { id: 1, name: 'Domates', price: 29.99, image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'Salatalık', price: 19.99, image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: 'Elma', price: 24.99, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: 'Muz', price: 34.99, image: 'https://images.unsplash.com/photo-1574226516831-e1dff420e8e9?auto=format&fit=crop&w=400&q=80' },
  { id: 5, name: 'Portakal', price: 27.99, image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80' },
  { id: 6, name: 'Patates', price: 14.99, image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80' },
  { id: 7, name: 'Soğan', price: 12.99, image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' },
  { id: 8, name: 'Havuç', price: 16.99, image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80' },
  { id: 9, name: 'Limon', price: 9.99, image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80' },
  { id: 10, name: 'Marul', price: 11.99, image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80' }
])

const addToCart = (product: Product) => {
  cart.addToCart(product)
}
</script>

<style scoped>
.hero-banner {
  margin-bottom: 3rem;
}

.v-card--reveal {
  background-color: rgba(0, 0, 0, 0.6) !important;
}

/* Hover efektleri */
.v-card {
  transition: all 0.3s ease-in-out;
}

.v-card:hover {
  transform: translateY(-5px);
}

/* Özellikler bölümü */
.bg-grey-lighten-4 {
  background-color: #f5f5f5;
}
</style> 