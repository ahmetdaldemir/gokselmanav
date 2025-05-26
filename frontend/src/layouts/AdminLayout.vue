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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const adminName = ref('Admin User')
const isSidebarCollapsed = ref(false)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const handleLogout = () => {
  authStore.logout()
  router.push('/admin/login')
}

onMounted(() => {
  // Add Font Awesome
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
  document.head.appendChild(link)
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
</style> 