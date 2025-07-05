<template>
  <div class="orders-view">
    <h1>Siparişlerim</h1>
    <table v-if="orders.length">
      <thead>
        <tr>
          <th>#</th>
          <th>Tutar</th>
          <th>Durum</th>
          <th>Ürünler</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.totalAmount?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) }}</td>
          <td>
            <span :class="getStatusClass(order.status)">
              {{ getStatusText(order.status) }}
            </span>
          </td>
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
    <p v-else>Hiç siparişiniz yok.</p>
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

interface Order {
  id: number
  totalAmount: number
  orderItems: OrderItem[]
  status: string
}

const orders = ref<Order[]>([])

onMounted(async () => {
  try {
    // Kullanıcıya özel endpoint
    const endpoint = '/backend/orders/my-orders'
    const response = await axios.get(endpoint)
    orders.value = response.data
  } catch (error) {
    console.error('Siparişler alınamadı:', error)
    alert('Siparişler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.')
  }
})

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'Beklemede',
    processing: 'İşleniyor',
    shipped: 'Kargoda',
    delivered: 'Teslim Edildi',
    cancelled: 'İptal Edildi'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    pending: 'status-pending',
    processing: 'status-processing',
    shipped: 'status-shipped',
    delivered: 'status-delivered',
    cancelled: 'status-cancelled'
  }
  return classMap[status] || ''
}
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
.status-pending {
  background-color: #fff3cd;
  color: #856404;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}
.status-processing {
  background-color: #cce5ff;
  color: #004085;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}
.status-shipped {
  background-color: #d4edda;
  color: #155724;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}
.status-delivered {
  background-color: #d1ecf1;
  color: #0c5460;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}
.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}
</style> 