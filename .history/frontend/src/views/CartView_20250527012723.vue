<template>
  <v-container class="py-8">
    <h1 class="text-h5 font-weight-bold mb-6">Sepetim</h1>
    <v-alert v-if="!cart.items || cart.items.length === 0" type="info" border="start" class="mb-8">
      Sepetinizde ürün yok.
    </v-alert>
    <v-row v-else-if="cart.items && cart.items.length > 0">
      <v-col cols="12" md="8">
        <v-card v-for="item in cart.items" :key="item.id" class="mb-4">
          <v-row align="center" no-gutters>
            <v-col cols="3" sm="2">
              <v-img :src="item.image" height="80" class="rounded-lg" />
            </v-col>
            <v-col cols="5" sm="6">
              <div class="font-weight-bold">{{ item.name }}</div>
              <div class="text-primary">{{ item.price.toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}) }}</div>
            </v-col>
            <v-col cols="4" sm="4" class="d-flex align-center justify-end">
              <v-btn icon @click="updateQuantity(item, item.quantity - 1)" :disabled="item.quantity <= 1">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <span class="mx-2">{{ item.quantity }}</span>
              <v-btn icon @click="updateQuantity(item, item.quantity + 1)"><v-icon>mdi-plus</v-icon></v-btn>
              <v-btn icon color="error" @click="removeItem(item)"><v-icon>mdi-delete</v-icon></v-btn>
            </v-col>
          </v-row>
        </v-card>
        <v-btn color="error" variant="outlined" @click="clearCart" class="mt-2">Sepeti Temizle</v-btn>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <div class="d-flex justify-space-between mb-2">
            <span>Ara Toplam</span>
            <span>{{ subtotal.toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}) }}</span>
          </div>
          <div class="d-flex justify-space-between mb-2">
            <span>KDV (18%)</span>
            <span>{{ tax.toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}) }}</span>
          </div>
          <div class="d-flex justify-space-between font-weight-bold text-h6 mt-4 mb-4">
            <span>Toplam</span>
            <span>{{ total.toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}) }}</span>
          </div>
          <v-btn color="primary" block size="large" :disabled="!cart.items || cart.items.length === 0" @click="goToCheckout">
            Alışverişi Tamamla
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="cart.isLoading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="48" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const router = useRouter()

onMounted(() => {
  cart.fetchCart()
})

const subtotal = computed(() => (cart.items ? cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0))
const tax = computed(() => subtotal.value * 0.18)
const total = computed(() => subtotal.value + tax.value)

const updateQuantity = (item: any, quantity: number) => {
  if (quantity < 1) return
  cart.updateQuantity(item.id, quantity)
}

const removeItem = (item: any) => {
  cart.removeFromCart(item.id)
}

const clearCart = () => {
  cart.clearCart()
}

const goToCheckout = () => {
  router.push('/checkout')
}
</script>

<style scoped>
.text-primary {
  color: #1867C0;
}
</style> 