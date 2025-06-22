<template>
  <div class="orders-view">
    <h1>Siparişler</h1>
    <table v-if="orders.length">
      <thead>
        <tr>
          <th>#</th>
          <th>Müşteri</th>
          <th>Tutar</th>
          <th>Ürünler</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.customer?.firstName }} {{ order.customer?.lastName }}</td>
          <td>{{ order.totalAmount?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) }}</td>
          <td>
            <ul>
              <li v-for="item in order.orderItems" :key="item.id">
                {{ item.product?.name }} x{{ item.quantity }}
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>Hiç sipariş yok.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Type definitions
interface Product {
  id: number
  name: string
  price: number
}

interface OrderItem {
  id: number
  product: Product
  quantity: number
}

interface Customer {
  id: number
  firstName: string
  lastName: string
}

interface Order {
  id: number
  customer: Customer
  totalAmount: number
  orderItems: OrderItem[]
}

const orders = ref<Order[]>([])

onMounted(async () => {
  try {
    const response = await axios.get('/backend/orders')
    orders.value = response.data
  } catch (error) {
    console.error('Siparişler alınamadı:', error)
  }
})
</script>

<style scoped>
.orders-view {
  padding: 2rem;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
}
th, td {
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  text-align: left;
}
th {
  background: #f7f7f7;
}
</style> 