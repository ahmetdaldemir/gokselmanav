<template>
  <div class="orders-view">
    <h1 class="orders-title">Siparişler</h1>
    <div class="orders-search-bar">
      <input v-model="search" type="text" placeholder="Sipariş, müşteri, ürün, durum ara..." class="orders-search-input" />
    </div>
    <div class="orders-table-wrapper">
      <table v-if="filteredOrders.length" class="orders-table">
        <thead>
          <tr>
            <th class="sticky">#</th>
            <th class="sticky">Müşteri</th>
            <th class="sticky">Tutar</th>
            <th class="sticky">Durum</th>
            <th class="sticky">Ödeme Tipi</th>
            <th class="sticky">Ödeme Durumu</th>
            <th class="sticky">Kalan Bakiye</th>
            <th class="sticky">Ürünler</th>
            <th class="sticky">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id" class="order-row" @click="openDetail(order)">
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
              <span class="payment-type-badge">
                <i :class="getPaymentTypeIcon(order.paymentType)" class="status-icon"></i>
                {{ getPaymentTypeText(order.paymentType) }}
              </span>
            </td>
            <td>
              <span :class="['payment-status-badge', getPaymentStatusClass(order.paymentStatus)]">
                {{ getPaymentStatusText(order.paymentStatus) }}
              </span>
            </td>
            <td>
              <span :class="(order.remainingAmount || 0) > 0 ? 'remaining-amount-warning' : 'remaining-amount-ok'">
                {{ (order.remainingAmount || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) }}
              </span>
            </td>
            <td>
              <ul class="order-products">
                <li v-for="item in order.orderItems" :key="item.id" class="product-item" :title="item.product?.name">
                  <i class="fas fa-box"></i> {{ item.product?.name }} <span class="product-qty">x{{ item.quantity }}</span>
                </li>
              </ul>
            </td>
            <td @click.stop>
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

    <!-- Sipariş Detay Modalı -->
    <div v-if="showDetail" class="order-detail-modal-bg" @click.self="closeDetail">
      <div class="order-detail-modal">
        <div class="modal-header">
          <h2>Sipariş Detayı #{{ selectedOrder?.id }}</h2>
          <button class="modal-close-btn" @click="closeDetail"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="modal-section">
            <strong>Müşteri:</strong> {{ selectedOrder?.customer?.firstName }} {{ selectedOrder?.customer?.lastName }}
          </div>
          <div class="modal-section">
            <strong>Adres:</strong> {{ selectedOrder?.shippingAddress }}
          </div>
          <div class="modal-section">
            <strong>Toplam Tutar:</strong> {{ selectedOrder?.totalAmount?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) }}
          </div>
          <div class="modal-section">
            <strong>Ödeme Tipi:</strong> {{ getPaymentTypeText(selectedOrder?.paymentType) }}
          </div>
          <div class="modal-section">
            <strong>Ödeme Durumu:</strong> {{ getPaymentStatusText(selectedOrder?.paymentStatus) }}
          </div>
          <div class="modal-section">
            <strong>Ödenen:</strong> {{ selectedOrder?.paidAmount?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) }}
          </div>
          <div class="modal-section">
            <strong>Kalan Bakiye:</strong> <span :class="(selectedOrder?.remainingAmount || 0) > 0 ? 'remaining-amount-warning' : 'remaining-amount-ok'">{{ (selectedOrder?.remainingAmount || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) }}</span>
          </div>
          <div class="modal-section">
            <strong>Not:</strong> {{ selectedOrder?.note || '-' }}
          </div>
          <div class="modal-section">
            <strong>Ürünler:</strong>
            <ul class="order-products">
              <li v-for="item in selectedOrder?.orderItems" :key="item.id" class="product-item">
                <i class="fas fa-box"></i> {{ item.product?.name }} <span class="product-qty">x{{ item.quantity }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-action-btn" @click="openPaymentEdit">Ödeme/Güncelle</button>
          <button class="modal-action-btn modal-close-btn" @click="closeDetail">Kapat</button>
        </div>
      </div>
    </div>

    <!-- Ödeme Güncelle Modalı -->
    <div v-if="showPaymentEdit" class="order-detail-modal-bg" @click.self="closePaymentEdit">
      <div class="order-detail-modal">
        <div class="modal-header">
          <h2>Ödeme Güncelle (Sipariş #{{ selectedOrder?.id }})</h2>
          <button class="modal-close-btn" @click="closePaymentEdit"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="modal-section">
            <label>Ödeme Tipi:</label>
            <select v-model="editPaymentType">
              <option value="nakit">Nakit</option>
              <option value="kart">Kart</option>
              <option value="veresiye">Veresiye</option>
            </select>
          </div>
          <div class="modal-section">
            <label>Ödenen Tutar:</label>
            <input v-model.number="editPaidAmount" type="number" min="0" :max="selectedOrder?.totalAmount" step="0.01" />
          </div>
          <div class="modal-section">
            <label>Not:</label>
            <textarea v-model="editNote" rows="2" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-action-btn" @click="savePaymentEdit">Kaydet</button>
          <button class="modal-action-btn modal-close-btn" @click="closePaymentEdit">İptal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
  paymentType?: string
  paidAmount?: number
  remainingAmount?: number
  paymentStatus?: string
  note?: string
  shippingAddress?: string
}

const orders = ref<Order[]>([])
const search = ref('')
const showDetail = ref(false)
const selectedOrder = ref<Order | null>(null)
const showPaymentEdit = ref(false)
const editPaymentType = ref('')
const editPaidAmount = ref(0)
const editNote = ref('')

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

const filteredOrders = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return orders.value
  return orders.value.filter(order => {
    return (
      order.id.toString().includes(q) ||
      (order.customer?.firstName + ' ' + order.customer?.lastName).toLowerCase().includes(q) ||
      order.status?.toLowerCase().includes(q) ||
      order.orderItems.some(item => item.product?.name?.toLowerCase().includes(q))
    )
  })
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

const getPaymentTypeText = (type?: string) => {
  const map: Record<string, string> = { nakit: 'Nakit', kart: 'Kart', veresiye: 'Veresiye' }
  return map[type || ''] || '-'
}

const getPaymentTypeIcon = (type?: string) => {
  const map: Record<string, string> = { nakit: 'fas fa-money-bill-wave', kart: 'fas fa-credit-card', veresiye: 'fas fa-hand-holding-usd' }
  return map[type || ''] || 'fas fa-question-circle'
}

const getPaymentStatusText = (status?: string) => {
  const map: Record<string, string> = { tam: 'Tam', eksik: 'Eksik', veresiye: 'Veresiye' }
  return map[status || ''] || '-'
}

const getPaymentStatusClass = (status?: string) => {
  const map: Record<string, string> = { tam: 'payment-status-tam', eksik: 'payment-status-eksik', veresiye: 'payment-status-veresiye' }
  return map[status || ''] || ''
}

const openDetail = (order: Order) => {
  selectedOrder.value = order
  showDetail.value = true
}

const closeDetail = () => {
  showDetail.value = false
  selectedOrder.value = null
}

const openPaymentEdit = () => {
  if (!selectedOrder.value) return
  editPaymentType.value = selectedOrder.value.paymentType || 'nakit'
  editPaidAmount.value = selectedOrder.value.paidAmount || 0
  editNote.value = selectedOrder.value.note || ''
  showPaymentEdit.value = true
}

const closePaymentEdit = () => {
  showPaymentEdit.value = false
}

const savePaymentEdit = async () => {
  if (!selectedOrder.value) return
  const total = selectedOrder.value.totalAmount || 0
  const paid = editPaidAmount.value
  let paymentStatus = 'tam'
  let remaining = 0
  if (paid < total) {
    paymentStatus = paid === 0 ? 'veresiye' : 'eksik'
    remaining = total - paid
  }
  try {
    await axios.patch(`/backend/orders/${selectedOrder.value.id}`, {
      paymentType: editPaymentType.value,
      paidAmount: paid,
      remainingAmount: remaining,
      paymentStatus,
      note: editNote.value
    })
    // Güncel veriyi çek
    const response = await axios.get('/backend/orders/public-list')
    orders.value = response.data
    showPaymentEdit.value = false
    showDetail.value = false
    alert('Ödeme bilgisi güncellendi!')
  } catch (error) {
    alert('Ödeme güncellenemedi!')
  }
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
.orders-search-bar {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
}
.orders-search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  min-width: 260px;
  outline: none;
  transition: border 0.2s;
}
.orders-search-input:focus {
  border-color: #1867C0;
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
  min-width: 900px;
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
  cursor: pointer;
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
.payment-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 500;
  background: #f1f1f1;
  color: #333;
  border-radius: 12px;
  padding: 0.2rem 0.7rem;
  font-size: 0.95rem;
}
.payment-status-badge {
  display: inline-block;
  padding: 0.2rem 0.7rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
}
.payment-status-tam { background: #d4edda; color: #155724; }
.payment-status-eksik { background: #fff3cd; color: #856404; }
.payment-status-veresiye { background: #f8d7da; color: #721c24; }
.remaining-amount-warning { color: #e67e22; font-weight: 600; }
.remaining-amount-ok { color: #27ae60; font-weight: 600; }
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
.order-detail-modal-bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.order-detail-modal {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.13);
  min-width: 350px;
  max-width: 95vw;
  width: 420px;
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  position: relative;
  animation: modalIn 0.2s;
}
@keyframes modalIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.modal-header h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}
.modal-close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
}
.modal-close-btn:hover {
  background: #f5f5f5;
  color: #e74c3c;
}
.modal-body {
  margin-bottom: 1.2rem;
}
.modal-section {
  margin-bottom: 0.7rem;
  font-size: 1rem;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.7rem;
}
.modal-action-btn {
  background: #1867C0;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-action-btn:hover {
  background: #145a99;
}
.modal-action-btn.modal-close-btn {
  background: #e0e0e0;
  color: #333;
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
  .order-detail-modal {
    width: 98vw;
    min-width: unset;
    padding: 1rem 0.5rem;
  }
}
</style> 