<template>
  <div class="admin-categories">
    <div class="page-header">
      <h1>Kategori Yönetimi</h1>
      <button class="btn-add" @click="showAddModal = true">
        <i class="fas fa-plus"></i>
        Yeni Kategori
      </button>
    </div>

    <div class="categories-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Resim</th>
            <th>Kategori Adı</th>
            <th>Açıklama</th>
            <th>Slug</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.id }}</td>
            <td>
              <img 
                v-if="category.image" 
                :src="category.image" 
                :alt="category.name" 
                class="category-image"
              >
              <div v-else class="no-image">Resim Yok</div>
            </td>
            <td>{{ category.name }}</td>
            <td>{{ truncateDescription(category.description) }}</td>
            <td>{{ category.slug }}</td>
            <td>
              <span :class="['status', category.isActive ? 'active' : 'inactive']">
                {{ category.isActive ? 'Aktif' : 'Pasif' }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button class="btn-edit" @click="editCategory(category)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" @click="deleteCategory(category.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Category Modal -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h2>{{ editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori' }}</h2>
        <form @submit.prevent="handleSubmit" class="category-form">
          <div class="form-group">
            <label for="name">Kategori Adı</label>
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
              rows="3"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="slug">Slug</label>
            <input 
              type="text" 
              id="slug" 
              v-model="form.slug" 
              required
              placeholder="kategori-adi"
            >
          </div>
          <div class="form-group">
            <label for="image">Kategori Resmi</label>
            <ImageUpload v-model="form.image" />
          </div>
          <div class="form-group">
            <label for="parentId">Üst Kategori</label>
            <select id="parentId" v-model="form.parentId">
              <option value="">Ana Kategori</option>
              <template v-for="category in categories" :key="category.id">
                <option 
                  v-if="!editingCategory || category.id !== editingCategory.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </template>
            </select>
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
              {{ editingCategory ? 'Güncelle' : 'Ekle' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import ImageUpload from '@/components/ImageUpload.vue'

interface Category {
  id: number
  name: string
  description: string
  slug: string
  image: string
  parentId: number | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const categories = ref<Category[]>([])

const fetchCategories = async () => {
  try {
    const response = await axios.get('/backend/categories')
    categories.value = response.data
  } catch (error) {
    console.error('Kategoriler alınamadı:', error)
    alert('Kategoriler yüklenirken bir hata oluştu.')
  }
}

onMounted(fetchCategories)

const showAddModal = ref(false)
const editingCategory = ref<Category | null>(null)

const form = reactive({
  name: '',
  description: '',
  slug: '',
  image: '',
  parentId: null as number | null,
  isActive: true
})

const editCategory = (category: Category) => {
  editingCategory.value = category
  Object.assign(form, {
    name: category.name,
    description: category.description || '',
    slug: category.slug,
    image: category.image || '',
    parentId: category.parentId,
    isActive: category.isActive
  })
  showAddModal.value = true
}

const deleteCategory = async (id: number) => {
  if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
    try {
      await axios.delete(`/backend/categories/${id}`)
      await fetchCategories()
      alert('Kategori başarıyla silindi.')
    } catch (error) {
      console.error('Kategori silinirken hata:', error)
      alert('Kategori silinirken bir hata oluştu.')
    }
  }
}

const handleSubmit = async () => {
  try {
    const submitData = {
      ...form,
      parentId: form.parentId || null
    }

    if (editingCategory.value) {
      await axios.patch(`/backend/categories/${editingCategory.value.id}`, submitData)
      alert('Kategori başarıyla güncellendi.')
    } else {
      await axios.post('/backend/categories', submitData)
      alert('Kategori başarıyla eklendi.')
    }
    
    await fetchCategories()
    closeModal()
  } catch (error) {
    console.error('Kategori kaydedilirken hata:', error)
    alert('Kategori kaydedilirken bir hata oluştu.')
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingCategory.value = null
  Object.assign(form, {
    name: '',
    description: '',
    slug: '',
    image: '',
    parentId: null,
    isActive: true
  })
}

const truncateDescription = (description: string) => {
  if (!description) return '-'
  return description.length > 50 ? description.substring(0, 50) + '...' : description
}
</script>

<style scoped>
.admin-categories {
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

.categories-table {
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

.category-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.no-image {
  width: 50px;
  height: 50px;
  background-color: #f8f9fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #666;
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
  max-height: 90vh;
  overflow-y: auto;
}

.category-form {
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

input, textarea, select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus, textarea:focus, select:focus {
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
</style> 