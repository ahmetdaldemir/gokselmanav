<template>
  <div class="dashboard-view">
    <h1 class="dashboard-title">Admin Dashboard</h1>
    <div class="dashboard-cards">
      <div class="dashboard-card">
        <i class="fas fa-shopping-cart card-icon"></i>
        <div class="card-label">Toplam Sipariş</div>
        <div class="card-value">{{ totalOrders }}</div>
      </div>
      <div class="dashboard-card">
        <i class="fas fa-coins card-icon"></i>
        <div class="card-label">Toplam Tutar</div>
        <div class="card-value">{{ totalAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) }}</div>
      </div>
      <div class="dashboard-card">
        <i class="fas fa-check-circle card-icon"></i>
        <div class="card-label">Tamamlanan Sipariş</div>
        <div class="card-value">{{ completedOrders }}</div>
      </div>
    </div>
    <div class="dashboard-charts">
      <div class="chart-box">
        <h3>Son 7 Günlük Siparişler</h3>
        <Bar v-if="barChartData" :data="barChartData" :options="barChartOptions" />
      </div>
      <div class="chart-box">
        <h3>Sipariş Durum Dağılımı</h3>
        <Pie v-if="pieChartData" :data="pieChartData" :options="pieChartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { Bar, Pie } from 'vue-chartjs'
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement)

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
  createdAt: string
}

const orders = ref<Order[]>([])

onMounted(async () => {
  try {
    const response = await axios.get('/backend/orders/public-list')
    orders.value = response.data
  } catch (error) {
    console.error('Siparişler alınamadı:', error)
  }
})

const totalOrders = computed(() => orders.value.length)
const totalAmount = computed(() => orders.value.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0))
const completedOrders = computed(() => orders.value.filter(o => o.status === 'delivered').length)

// Son 7 gün için bar chart verisi
const barChartData = computed(() => {
  if (!orders.value.length) return null
  const days: string[] = []
  const counts: number[] = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const label = d.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })
    days.push(label)
    const count = orders.value.filter(o => {
      const od = new Date(o.createdAt)
      return od.getDate() === d.getDate() && od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear()
    }).length
    counts.push(count)
  }
  return {
    labels: days,
    datasets: [
      {
        label: 'Sipariş Sayısı',
        backgroundColor: '#1867C0',
        data: counts,
        borderRadius: 6,
      }
    ]
  }
})
const barChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false }
  },
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 1 } }
  }
}

// Pie chart: sipariş durumlarına göre dağılım
const pieChartData = computed(() => {
  if (!orders.value.length) return null
  const statusLabels = ['Beklemede', 'İşleniyor', 'Kargoda', 'Teslim Edildi', 'İptal Edildi']
  const statusKeys = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  const counts = statusKeys.map(key => orders.value.filter(o => o.status === key).length)
  return {
    labels: statusLabels,
    datasets: [
      {
        data: counts,
        backgroundColor: ['#fff3cd', '#cce5ff', '#d4edda', '#d1ecf1', '#f8d7da'],
        borderColor: '#fff',
        borderWidth: 2
      }
    ]
  }
})
const pieChartOptions = {
  responsive: true,
  plugins: {
    legend: { position: "bottom" as const },
    title: { display: false }
  }
}
</script>

<style scoped>
.dashboard-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #2c3e50;
}
.dashboard-cards {
  display: flex;
  gap: 2rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}
.dashboard-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  padding: 1.5rem 2.5rem;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
}
.card-icon {
  font-size: 2.2rem;
  color: #1867C0;
  margin-bottom: 0.2rem;
}
.card-label {
  font-size: 1.1rem;
  color: #888;
}
.card-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
}
.dashboard-charts {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}
.chart-box {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  flex: 1 1 350px;
  min-width: 320px;
  max-width: 600px;
  margin-bottom: 2rem;
}
.chart-box h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  color: #1867C0;
}
@media (max-width: 900px) {
  .dashboard-cards, .dashboard-charts {
    flex-direction: column;
    gap: 1.2rem;
  }
  .dashboard-card, .chart-box {
    min-width: unset;
    max-width: 100%;
    padding: 1.2rem 0.7rem;
  }
}
</style> 