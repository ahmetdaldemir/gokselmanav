<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12" md="6">
        <v-img :src="product.image" aspect-ratio="1" class="rounded-lg" max-width="500" />
      </v-col>
      <v-col cols="12" md="6" class="d-flex flex-column justify-center">
        <h1 class="text-h4 font-weight-bold mb-2">{{ product.name }}</h1>
        <div class="text-h5 text-primary font-weight-bold mb-2">
          {{ product.price.toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}) }}
        </div>
        <v-rating :model-value="product.rating" color="amber" size="large" readonly class="mb-2" />
        <div class="mb-4 text-grey">{{ product.reviews }} Yorum</div>
        <div class="mb-6 text-body-1">{{ product.description }}</div>
        <div class="mb-4">
          <v-chip :color="product.inStock ? 'success' : 'error'" class="mr-2" dark>
            {{ product.inStock ? 'Stokta Var' : 'Stokta Yok' }}
          </v-chip>
        </div>
        <v-btn color="primary" size="large" :disabled="!product.inStock" @click="addToCart(product)">
          Sepete Ekle
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const productId = Number(route.params.id)

// Demo ürün verisi
const product = ref({
  id: productId,
  name: 'Modern Casual Gömlek',
  price: 199.99,
  image: 'https://picsum.photos/600/600?random=' + productId,
  description: 'Yüksek kaliteli, modern ve rahat bir gömlek. Günlük kullanım için idealdir. %100 pamuk.',
  rating: 4,
  reviews: 12,
  inStock: true
})

const addToCart = (product: any) => {
  // Sepete ekleme işlemi
  alert('Sepete eklendi: ' + product.name)
}
</script>

<style scoped>
.text-grey {
  color: #888;
}
</style> 