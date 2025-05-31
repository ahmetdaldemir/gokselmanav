import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isLoading = ref(false)

  // Demo: Sepeti localden getir
  const fetchCart = async () => {
    // No-op for demo
    isLoading.value = false
  }

  // Demo: Sepete ürün ekle
  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity = 1) => {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ ...product, quantity })
    }
  }

  // Demo: Sepetten ürün çıkar
  const removeFromCart = (productId: number) => {
    items.value = items.value.filter(i => i.id !== productId)
  }

  // Demo: Adet değiştir
  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find(i => i.id === productId)
    if (item && quantity > 0) {
      item.quantity = quantity
    }
  }

  // Demo: Sepeti temizle
  const clearCart = () => {
    items.value = []
  }

  return {
    items,
    isLoading,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }
}) 