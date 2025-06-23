<template>
  <v-app>
    <div class="main-content-area">
      <v-app-bar color="white" flat app class="main-content-bar">
        <div class="navbar-flex">
          <!-- Desktop Navigation -->
          <div class="d-none d-md-flex navbar-center w-100">
            <div class="navbar-left">
              <v-btn icon @click="drawer = !drawer">
                <v-icon>mdi-menu</v-icon>
              </v-btn>
              <v-img src="/logogoksel.png" alt="Logo" max-width="40" class="mr-2" />
              <span class="font-weight-bold text-h6" @click="goToHome">Göksel Manav</span>
            </div>
            
            <!-- Orta: Arama -->
            <div class="navbar-center">
              <!-- Arama alanı buraya eklenebilir -->
            </div>
            
            <!-- Sağ: Sosyal ve Auth -->
            <div class="navbar-right">
              <v-btn icon variant="text">
                <v-icon>mdi-facebook</v-icon>
              </v-btn>
              <v-btn icon variant="text">
                <v-icon>mdi-twitter</v-icon>
              </v-btn>
              <v-btn icon variant="text">
                <v-icon>mdi-instagram</v-icon>
              </v-btn>
              <v-btn icon variant="text" @click="goToCart">
                <v-badge :content="cartCount" color="primary" v-if="cartCount > 0" overlap>
                  <template #badge>
                    <span>{{ cartCount }}</span>
                  </template>
                  <v-icon>mdi-cart</v-icon>
                </v-badge>
                <v-icon v-else>mdi-cart</v-icon>
              </v-btn>
              <template v-if="isAuthenticated">
                <span class="ml-2 font-weight-bold user-name" @click="handleUserNameClick">{{ userName }}</span>
                <v-btn color="error" variant="outlined" class="ml-2" @click="logout">Çıkış Yap</v-btn>
              </template>
              <template v-else>
                <v-btn color="primary" variant="outlined" class="ml-2" @click="goToSignup">Kayıt Ol</v-btn>
                <v-btn color="primary" class="ml-2" @click="goToLogin">Giriş Yap</v-btn>
              </template>
            </div>
          </div>

          <!-- Mobile Navigation -->
          <div class="d-flex d-md-none w-100 justify-space-between align-center">
            <v-btn icon @click="drawer = !drawer">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
            <v-img src="/logogoksel.png" alt="Logo" max-width="35" />
            <v-btn icon variant="text" @click="goToCart">
              <v-badge :content="cartCount" color="primary" v-if="cartCount > 0" overlap>
                <template #badge>
                  <span>{{ cartCount }}</span>
                </template>
                <v-icon>mdi-cart</v-icon>
              </v-badge>
              <v-icon v-else>mdi-cart</v-icon>
            </v-btn>
          </div>
        </div>
      </v-app-bar>

      <!-- Mobile Bottom Navigation -->
      <v-bottom-navigation
        v-model="bottomNav"
        class="d-flex d-md-none"
        color="primary"
        grow
        app
      >
        <v-btn value="home" @click="goToHome">
          <v-icon>mdi-home</v-icon>
          <span>Ana Sayfa</span>
        </v-btn>
        
        <v-btn value="products" @click="goToProducts">
          <v-icon>mdi-package-variant</v-icon>
          <span>Ürünler</span>
        </v-btn>
        
        <v-btn value="login" @click="goToLogin" v-if="!isAuthenticated">
          <v-icon>mdi-login</v-icon>
          <span>Giriş</span>
        </v-btn>
        
        <v-btn value="profile" @click="goToProfile" v-else>
          <v-icon>mdi-account</v-icon>
          <span>{{ userName }}</span>
        </v-btn>
      </v-bottom-navigation>

      <!-- Mobil Navigation Drawer -->
      <v-navigation-drawer v-model="drawer" app temporary class="d-md-none">
        <v-list nav>
          <v-list-item to="/" title="Ana Sayfa" prepend-icon="mdi-home" />
          <v-list-item to="/corporate" title="Kurumsal" prepend-icon="mdi-domain" />
          <v-list-item to="/contact" title="İletişim" prepend-icon="mdi-email" />
          <v-list-item to="/account" title="Hesabım" prepend-icon="mdi-account" />
          <v-list-item to="/orders" title="Siparişlerim" prepend-icon="mdi-package-variant" />
          <v-list-item to="/cart" title="Sepetim" prepend-icon="mdi-cart" />
          <v-list-item v-if="!isAuthenticated" to="/login" title="Giriş Yap" prepend-icon="mdi-login" />
          <v-list-item v-if="!isAuthenticated" to="/signup" title="Kayıt Ol" prepend-icon="mdi-account-plus" />
          <v-list-item v-if="isAuthenticated" @click="logout" title="Çıkış Yap" prepend-icon="mdi-logout" />
        </v-list>
      </v-navigation-drawer>
      <v-main class="main-bg">
        <v-container fluid style="min-height: 80vh; padding: 0;">
          <slot />
        </v-container>
      </v-main>
    </div>
    <v-footer color="#f5f5f5" padless>
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="6">
            <h3 class="text-subtitle-1 font-weight-bold mb-2">Güvenli Alışveriş</h3>
            <v-list density="compact">
              <v-list-item v-for="item in ['Gizlilik Politikası', 'Kullanım Koşulları', 'KVKK']" :key="item">
                <v-list-item-title>{{ item }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" sm="6">
            <h3 class="text-subtitle-1 font-weight-bold mb-2">Müşteri Hizmetleri</h3>
            <v-list density="compact">
              <v-list-item v-for="item in ['Sıkça Sorulan Sorular', 'İade ve Değişim', 'Kargo Takip']" :key="item">
                <v-list-item-title>{{ item }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const drawer = ref(false)
const bottomNav = ref('home')
const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()

onMounted(() => {
  cart.fetchCart()
  auth.initAuth()
})

const cartCount = computed(() => cart.items.reduce((sum, item) => sum + item.quantity, 0))
const isAuthenticated = computed(() => auth.isAuthenticated)
const userName = computed(() => auth.user?.firstName || 'Kullanıcı')

const goToCart = () => {
  router.push('/cart')
}
const goToLogin = () => {
  router.push('/login')
}
const goToSignup = () => {
  router.push('/signup')
}
const goToHome = () => {
  router.push('/')
}
const goToProducts = () => {
  router.push('/products')
}
const goToProfile = () => {
  router.push('/account')
}
const logout = () => {
  auth.logout()
  router.push('/')
}

const handleUserNameClick = () => {
  if (auth.user?.role === 'admin') {
    router.push('/admin/dashboard')
  } else {
    router.push('/account')
  }
}
</script>

<style scoped>
.main-bg {
  background: #f6f7fb;
  min-height: 100vh;
  padding-bottom: 80px; /* Bottom navigation için alan */
}
.main-content-area {
  width: 80vw;
  max-width: 1600px;
  min-width: 320px;
  margin: 0 auto;
}
.main-content-bar {
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  border-radius: 0 0 16px 16px;
  margin-bottom: 0;
}
.v-footer {
  border-top: 1px solid #eee;
  margin-top: 2rem;
}
.navbar-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1.5rem;
}
.navbar-left {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
}
.navbar-search {
  width: 100%;
  max-width: 300px;
}
.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Mobile responsive styles */
@media (max-width: 900px) {
  .navbar-flex {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  .navbar-center {
    justify-content: flex-start;
    margin: 0;
  }
  
  /* Bottom navigation için footer'ı gizle */
  .v-footer {
    display: none;
  }
  
  /* Main content için bottom padding */
  .main-bg {
    padding-bottom: 80px;
  }
}

/* Desktop'ta bottom navigation'ı gizle */
@media (min-width: 960px) {
  .v-bottom-navigation {
    display: none !important;
  }
  
  .main-bg {
    padding-bottom: 0;
  }
}

.user-name {
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0.5rem;
  border-radius: 4px;
}

.user-name:hover {
  color: #e52929;
  background-color: rgba(229, 41, 41, 0.1);
}
</style>

<style>
body {
  background: #f6f7fb !important;
}
#app {
  background: #f6f7fb !important;
}
</style> 