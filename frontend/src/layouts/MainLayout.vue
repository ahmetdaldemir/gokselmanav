<template>
  <v-app>
    <div class="main-content-area">
      <v-app-bar color="white" flat app class="main-content-bar">
        <v-container class="d-flex align-center justify-space-between" fluid>
          <!-- Hamburger (mobilde) -->
          <v-btn icon class="d-md-none" @click="drawer = !drawer">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
          <div class="d-flex align-center">
            <v-img src="/logo.png" alt="Logo" max-width="40" class="mr-2" />
            <span class="font-weight-bold text-h6">Vuemmerce</span>
          </div>
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            label="Search..."
            hide-details
            variant="solo"
            density="compact"
            class="mx-4 d-none d-md-flex"
            style="max-width: 300px;"
          />
          <div class="d-flex align-center d-none d-md-flex">
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
              <span class="ml-2 font-weight-bold">{{ userName }}</span>
              <v-btn color="error" variant="outlined" class="ml-2" @click="logout">Çıkış Yap</v-btn>
            </template>
            <template v-else>
              <v-btn color="primary" variant="outlined" class="ml-2" @click="goToSignup">Kayıt Ol</v-btn>
              <v-btn color="primary" class="ml-2" @click="goToLogin">Giriş Yap</v-btn>
            </template>
          </div>
        </v-container>
      </v-app-bar>
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
const logout = () => {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.main-bg {
  background: #f6f7fb;
  min-height: 100vh;
}
.main-content-area {
  max-width: 1400px;
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
</style> 