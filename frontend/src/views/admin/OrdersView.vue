<template>
  <div class="orders-view">
    <h1 class="orders-title">Siparişler</h1>
    <div class="orders-table-wrapper">
      <table v-if="orders.length" class="orders-table">
        <thead>
          <tr>
            <th class="sticky">#</th>
            <th class="sticky">Müşteri</th>
            <th class="sticky">Tutar</th>
            <th class="sticky">Durum</th>
            <th class="sticky">Ürünler</th>
            <th class="sticky">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" class="order-row">
            <td>{{ order.id }}</td>
            <td>
              <span class="customer-name">
                <i class="fas fa-user"></i>
                {{ order.customer?.firstName }} {{ order.customer?.lastName }}
              </span>
            </td>
            <td>
              <span class="order-amount">
                <i class="fas fa-coins"></i>
                {{ order.totalAmount?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) }}
              </span>
            </td>
            <td>
              <span :class="['status-badge', getStatusClass(order.status)]">
                <i :class="getStatusIcon(order.status)" class="status-icon"></i>
                {{ getStatusText(order.status) }}
              </span>
            </td>
            <td>
              <ul class="order-products">
                <li v-for="item in order.orderItems" :key="item.id" class="product-item" :title="item.product?.name">
                  <i class="fas fa-box"></i> {{ item.product?.name }} <span class="product-qty">x{{ item.quantity }}</span>
                </li>
              </ul>
            </td>
            <td>
              <select 
                v-model="order.status" 
                @change="updateOrderStatus(order.id, order.status)"
                :disabled="order.status === 'cancelled'"
                class="status-select"
              >
                <option value="pending">Beklemede</option>
                <option value="processing">İşleniyor</option>
                <option value="shipped">Kargoda</option>
                <option value="delivered">Teslim Edildi</option>
                <option value="cancelled">İptal Edildi</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-message">
        <i class="fas fa-box-open empty-icon"></i>
        <div>Hiç sipariş yok.</div>
      </div>
    </div>
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
  status: string
}

const orders = ref<Order[]>([])

onMounted(async () => {
  try {
    // Sadece admin paneli için public-list endpoint'i kullan
    const endpoint = '/backend/orders/public-list'
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

const getStatusIcon = (status: string) => {
  const iconMap: Record<string, string> = {
    pending: 'fas fa-hourglass-half',
    processing: 'fas fa-cogs',
    shipped: 'fas fa-truck',
    delivered: 'fas fa-check-circle',
    cancelled: 'fas fa-times-circle'
  }
  return iconMap[status] || 'fas fa-question-circle'
}

const updateOrderStatus = async (orderId: number, newStatus: string) => {
  try {
    // Geçici olarak public endpoint kullan (canlı ortamda authentication sorunu olduğu için)
    await axios.patch(`/backend/orders/${orderId}`, { status: newStatus })
    alert('Sipariş durumu başarıyla güncellendi!')
  } catch (error) {
    console.error('Sipariş durumu güncellenirken hata:', error)
    alert('Sipariş durumu güncellenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
  }
}
</script>

<style scoped>
.orders-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
.orders-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  letter-spacing: 0.5px;
}
.orders-table-wrapper {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  overflow-x: auto;
  padding: 1rem;
}
.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  min-width: 800px;
}
.orders-table thead tr {
  background: #f7f7f7;
}
.orders-table th, .orders-table td {
  padding: 0.75rem 1rem;
  text-align: left;
}
.orders-table th.sticky {
  position: sticky;
  top: 0;
  background: #f7f7f7;
  z-index: 2;
}
.orders-table tbody tr:nth-child(even) {
  background: #f9fafb;
}
.orders-table tbody tr:hover {
  background: #eaf6ff;
  transition: background 0.2s;
}
.customer-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #34495e;
}
.order-amount {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #1867C0;
}
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  padding: 0.3rem 0.8rem;
  border-radius: 16px;
  font-size: 0.95rem;
  min-width: 120px;
  justify-content: center;
}
.status-icon {
  font-size: 1.1rem;
}
.status-pending {
  background: #fff3cd;
  color: #856404;
}
.status-processing {
  background: #cce5ff;
  color: #004085;
}
.status-shipped {
  background: #d4edda;
  color: #155724;
}
.status-delivered {
  background: #d1ecf1;
  color: #0c5460;
}
.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}
.status-select {
  padding: 0.4rem 0.7rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  background: #f7f7f7;
  transition: border 0.2s;
}
.status-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
.order-products {
  list-style: none;
  padding: 0;
  margin: 0;
}
.product-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.97rem;
  color: #555;
  margin-bottom: 2px;
}
.product-qty {
  color: #888;
  font-size: 0.9em;
  margin-left: 2px;
}
.empty-message {
  text-align: center;
  color: #888;
  padding: 3rem 0;
  font-size: 1.2rem;
}
.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #e0e0e0;
}
@media (max-width: 900px) {
  .orders-table {
    min-width: 600px;
    font-size: 0.95rem;
  }
  .orders-title {
    font-size: 1.3rem;
  }
}
@media (max-width: 600px) {
  .orders-view {
    padding: 0.5rem;
  }
  .orders-table-wrapper {
    padding: 0.2rem;
  }
  .orders-table {
    min-width: 400px;
    font-size: 0.9rem;
  }
}
</style> 