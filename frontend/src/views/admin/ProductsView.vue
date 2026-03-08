<template>
  <div class="admin-products">
    <div class="page-header">
      <h1>Ürün Yönetimi</h1>
      <button class="btn-add" @click="showAddModal = true">
        <i class="fas fa-plus"></i>
        Yeni Ürün
      </button>
    </div>

    <div class="search-bar">
      <input
        v-model="search"
        type="text"
        class="search-input"
        placeholder="Ürünlerde ara... (ad, açıklama, ID)"
      />
    </div>

    <div class="products-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Resim</th>
            <th>Ürün Adı</th>
            <th>Fiyat</th>
            <th>Stok</th>
            <th>Satış Cinsi</th>
            <th>Min. Kg</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td>{{ product.id }}</td>
            <td>
              <img :src="product.image" :alt="product.name" class="product-image">
            </td>
            <td>{{ product.name }}</td>
            <td>{{ product.price }} TL</td>
            <td>{{ product.stock }}</td>
            <td>{{ product.salesType ?? 'adet' }}</td>
            <td>{{ product.salesType === 'kg' ? (product.minKg ?? '-') : '-' }}</td>
            <td>
              <span :class="['status', product.isActive ? 'active' : 'inactive']">
                {{ product.isActive ? 'Aktif' : 'Pasif' }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button class="btn-edit" @click="editProduct(product)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" @click="deleteProduct(product.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Product Modal -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h2>{{ editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün' }}</h2>
        <form @submit.prevent="handleSubmit" class="product-form">
          <div class="form-group">
            <label for="name">Ürün Adı</label>
            <input 
              type="text" 
              id="name" 
              v-model="form.name" 
              required
            >
          </div>
          <div class="form-group">
            <label for="description">Açıklama</label>
            <textarea 
              id="description" 
              v-model="form.description" 
              required
              rows="3"
            ></textarea>
          </div>
          <div class="form-row">
            <div class="form-group half-width">
              <label for="price">Fiyat</label>
              <input 
                type="number" 
                id="price" 
                v-model="form.price" 
                required
                min="0"
                step="0.01"
              >
            </div>
            <div class="form-group half-width">
              <label for="stock">Stok</label>
              <input 
                type="number" 
                id="stock" 
                v-model="form.stock" 
                required
                min="0"
              >
            </div>
          </div>
          <div class="form-group">
            <label for="image">Ürün Resmi</label>
            <ImageUpload v-model="form.image" />
          </div>
          <div class="form-group">
            <label for="salesType">Satış Cinsi</label>
            <select id="salesType" v-model="form.salesType" required class="sales-type-select">
              <option value="kg">Kilogram (kg)</option>
              <option value="adet">Adet</option>
              <option value="gram">Gram</option>
              <option value="kasa">Kasa</option>
              <option value="dilim">Dilim</option>
              <option value="paket">Paket</option>
              <option value="diğer">Diğer</option>
            </select>
          </div>
          <div class="form-group" v-if="form.salesType === 'kg'">
            <label for="minKg">Minimum Kg (örn: 0.5)</label>
            <input type="number" id="minKg" v-model.number="form.minKg" min="0.01" step="0.01" required />
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="form.isActive"
              >
              Aktif
            </label>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="closeModal">
              İptal
            </button>
            <button type="submit" class="btn-submit">
              {{ editingProduct ? 'Güncelle' : 'Ekle' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import axios from 'axios'
import ImageUpload from '@/components/ImageUpload.vue'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  image: string
  isActive: boolean
  salesType: string
  minKg?: number
}

const products = ref<Product[]>([])
const search = ref('')

const fetchProducts = async () => {
  const response = await axios.get('/backend/products')
  products.value = response.data
}

onMounted(fetchProducts)

const filteredProducts = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return products.value
  return products.value.filter(product =>
    product.name.toLowerCase().includes(q) ||
    product.description.toLowerCase().includes(q) ||
    product.id.toString().includes(q)
  )
})

const showAddModal = ref(false)
const editingProduct = ref<Product | null>(null)

const form = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  image: '',
  isActive: true,
  salesType: 'adet',
  minKg: undefined
})

const editProduct = (product: Product) => {
  editingProduct.value = product
  Object.assign(form, product)
  if (product.salesType !== 'kg') form.minKg = undefined
  showAddModal.value = true
}

const deleteProduct = async (id: number) => {
  if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
    try {
      await axios.delete(`/backend/products/${id}`)
      await fetchProducts()
    } catch (error) {
      alert('Ürün silinirken bir hata oluştu.')
    }
  }
}

const handleSubmit = async () => {
  try {
    if (editingProduct.value) {
      await axios.patch(`/backend/products/${editingProduct.value.id}`, form)
    } else {
      await axios.post('/backend/products', form)
    }
    await fetchProducts()
    closeModal()
  } catch (error) {
    alert('Ürün kaydedilirken bir hata oluştu.')
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingProduct.value = null
  Object.assign(form, {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    isActive: true,
    salesType: 'adet',
    minKg: undefined
  })
}
</script>

<style scoped>
.admin-products {
  padding: 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-add:hover {
  background-color: #3aa876;
}

.search-bar {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  min-width: 260px;
  outline: none;
  transition: border 0.2s;
}

.search-input:focus {
  border-color: #1867C0;
}

.products-table {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.status.active {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status.inactive {
  background-color: #ffebee;
  color: #c62828;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-delete {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-edit {
  background-color: #2196f3;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-edit:hover {
  background-color: #1976d2;
}

.btn-delete:hover {
  background-color: #d32f2f;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: #333;
}

input, textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #42b983;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-cancel:hover {
  background-color: #e9ecef;
}

.btn-submit {
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background-color: #3aa876;
}

.form-row {
  display: flex;
  gap: 1rem;
}
.half-width {
  flex: 1 1 0;
}
@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}

.sales-type-select {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  margin-top: 0.2rem;
}
.sales-type-select:focus {
  border-color: #1867C0;
  box-shadow: 0 0 0 2px #1867c033;
}
.sales-type-select:hover {
  border-color: #1867C0;
}
</style> 