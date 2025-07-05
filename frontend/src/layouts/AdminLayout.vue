<template>
  <div class="admin-layout" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h1>Admin Panel</h1>
        <button class="collapse-btn" @click="toggleSidebar">
          <i class="fas" :class="isSidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
        </button>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard" class="nav-item" active-class="active">
          <i class="fas fa-tachometer-alt"></i>
          <span class="nav-text">Dashboard</span>
        </router-link>
        <router-link to="/admin/products" class="nav-item" active-class="active">
          <i class="fas fa-box"></i>
          <span class="nav-text">Ürünler</span>
        </router-link>
        <router-link to="/admin/categories" class="nav-item" active-class="active">
          <i class="fas fa-tags"></i>
          <span class="nav-text">Kategoriler</span>
        </router-link>
        <router-link to="/admin/customers" class="nav-item" active-class="active">
          <i class="fas fa-users"></i>
          <span class="nav-text">Müşteriler</span>
        </router-link>
        <router-link to="/admin/orders" class="nav-item" active-class="active">
          <i class="fas fa-shopping-cart"></i>
          <span class="nav-text">Siparişler</span>
        </router-link>
        <router-link to="/admin/settings" class="nav-item" active-class="active">
          <i class="fas fa-cog"></i>
          <span class="nav-text">Ayarlar</span>
        </router-link>
      </nav>
    </aside>

    <div class="admin-main">
      <header class="admin-header">
        <div class="header-left">
          <button class="menu-toggle" @click="toggleSidebar">
            <i class="fas fa-bars"></i>
          </button>
        </div>
        <div class="header-right">
          <!-- Notification Bell -->
          <div class="notification-container">
            <button class="notification-bell" @click="toggleNotifications">
              <i class="fas fa-bell"></i>
              <span v-if="notificationCount > 0" class="notification-badge">{{ notificationCount }}</span>
            </button>
            
            <!-- Notification Dropdown -->
            <div v-if="showNotifications" class="notification-dropdown">
              <div class="notification-header">
                <h3>Bildirimler</h3>
                <button @click="clearNotifications" class="clear-btn">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
              <div class="notification-list">
                <div v-if="notifications.length === 0" class="no-notifications">
                  Bildirim yok
                </div>
                <div 
                  v-for="notification in notifications" 
                  :key="`${notification.timestamp}-${notification.type}`"
                  class="notification-item"
                  @click="removeNotification(notification)"
                >
                  <div class="notification-icon">
                    <i class="fas fa-shopping-cart"></i>
                  </div>
                  <div class="notification-content">
                    <div class="notification-message">{{ notification.message }}</div>
                    <div v-if="notification.order" class="notification-details">
                      {{ notification.order.customer.firstName }} {{ notification.order.customer.lastName }} - 
                      {{ notification.order.totalAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) }}
                    </div>
                    <div class="notification-time">
                      {{ formatTime(notification.timestamp) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="admin-profile">
            <span class="admin-name">{{ adminName }}</span>
            <button @click="handleLogout" class="logout-btn">
              <i class="fas fa-sign-out-alt"></i>
              <span>Çıkış</span>
            </button>
          </div>
        </div>
      </header>

      <main class="admin-content">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const adminName = ref('Admin User')
const isSidebarCollapsed = ref(false)
const showNotifications = ref(false)

const notifications = computed(() => notificationStore.notifications)
const notificationCount = computed(() => notifications.value.length)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const clearNotifications = () => {
  notificationStore.clearNotifications()
}

const removeNotification = (notification: any) => {
  notificationStore.removeNotification(notification)
}

const formatTime = (timestamp: Date) => {
  const now = new Date()
  const diff = now.getTime() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'Az önce'
  if (minutes < 60) return `${minutes} dakika önce`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} saat önce`
  
  const days = Math.floor(hours / 24)
  return `${days} gün önce`
}

const handleLogout = () => {
  notificationStore.disconnect()
  authStore.logout()
  router.push('/admin/login')
}

onMounted(() => {
  // Add Font Awesome
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
  document.head.appendChild(link)
  
  // Connect to WebSocket
  notificationStore.connect()
  
  // Close notifications when clicking outside
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.notification-container')) {
      showNotifications.value = false
    }
  })
})

onUnmounted(() => {
  notificationStore.disconnect()
})
</script>

<style scoped>
.admin-layout {
  display: grid;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.admin-sidebar {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  transition: all 0.3s ease;
  position: fixed;
  height: 100vh;
  width: 250px;
  z-index: 1000;
}

.sidebar-header {
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h1 {
  font-size: 1.5rem;
  margin: 0;
  color: #fff;
}

.collapse-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
}

.sidebar-nav {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background-color: #42b983;
  color: white;
}

.nav-item i {
  width: 20px;
  text-align: center;
}

.admin-main {
  margin-left: 250px;
  transition: margin-left 0.3s ease;
}

.admin-header {
  background-color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.menu-toggle {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.admin-name {
  font-weight: 500;
  color: #2c3e50;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #c82333;
}

.admin-content {
  padding: 2rem;
}

/* Sidebar Collapsed State */
.sidebar-collapsed .admin-sidebar {
  width: 70px;
}

.sidebar-collapsed .nav-text {
  display: none;
}

.sidebar-collapsed .admin-main {
  margin-left: 70px;
}

.sidebar-collapsed .sidebar-header h1 {
  display: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }

  .admin-sidebar {
    transform: translateX(-100%);
  }

  .admin-sidebar.active {
    transform: translateX(0);
  }

  .admin-main {
    margin-left: 0;
  }

  .sidebar-collapsed .admin-main {
    margin-left: 0;
  }
}

/* Notification Styles */
.notification-container {
  position: relative;
  margin-right: 1rem;
}

.notification-bell {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  position: relative;
  color: #666;
}

.notification-bell:hover {
  background-color: #f8f9fa;
  color: #333;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 350px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.notification-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #333;
}

.clear-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.25rem;
}

.clear-btn:hover {
  color: #e74c3c;
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.no-notifications {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.notification-item {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f8f9fa;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-icon {
  margin-right: 1rem;
  color: #3498db;
  font-size: 1.2rem;
}

.notification-content {
  flex: 1;
}

.notification-message {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.notification-details {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.notification-time {
  font-size: 0.75rem;
  color: #999;
}
</style> 