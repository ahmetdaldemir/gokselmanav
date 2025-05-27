<template>
  <div class="admin-customers">
    <div class="page-header">
      <h1>Müşteri Yönetimi</h1>
    </div>

    <div class="customers-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad</th>
            <th>Soyad</th>
            <th>E-posta</th>
            <th>Telefon</th>
            <th>Durum</th>
            <th>Kayıt Tarihi</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in customers" :key="customer.id">
            <td>{{ customer.id }}</td>
            <td>{{ customer.firstName }}</td>
            <td>{{ customer.lastName }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.phone || '-' }}</td>
            <td>
              <span :class="['status', customer.isActive ? 'active' : 'inactive']">
                {{ customer.isActive ? 'Aktif' : 'Pasif' }}
              </span>
            </td>
            <td>{{ formatDate(customer.createdAt) }}</td>
            <td>
              <div class="actions">
                <button class="btn-view" @click="viewCustomer(customer)">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn-edit" @click="editCustomer(customer)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" @click="deleteCustomer(customer.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- View Customer Modal -->
    <div v-if="showViewModal" class="modal">
      <div class="modal-content">
        <h2>Müşteri Detayları</h2>
        <div v-if="selectedCustomer" class="customer-details">
          <div class="detail-group">
            <label>Ad Soyad</label>
            <p>{{ selectedCustomer.firstName }} {{ selectedCustomer.lastName }}</p>
          </div>
          <div class="detail-group">
            <label>E-posta</label>
            <p>{{ selectedCustomer.email }}</p>
          </div>
          <div class="detail-group">
            <label>Telefon</label>
            <p>{{ selectedCustomer.phone || '-' }}</p>
          </div>
          <div class="detail-group">
            <label>Adres</label>
            <p>{{ selectedCustomer.address || '-' }}</p>
          </div>
          <div class="detail-group">
            <label>Kayıt Tarihi</label>
            <p>{{ formatDate(selectedCustomer.createdAt) }}</p>
          </div>
          <div class="detail-group">
            <label>Son Güncelleme</label>
            <p>{{ formatDate(selectedCustomer.updatedAt) }}</p>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-close" @click="closeViewModal">Kapat</button>
        </div>
      </div>
    </div>

    <!-- Edit Customer Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h2>Müşteri Düzenle</h2>
        <form @submit.prevent="handleSubmit" class="customer-form">
          <div class="form-group">
            <label for="firstName">Ad</label>
            <input 
              type="text" 
              id="firstName" 
              v-model="form.firstName" 
              required
            >
          </div>
          <div class="form-group">
            <label for="lastName">Soyad</label>
            <input 
              type="text" 
              id="lastName" 
              v-model="form.lastName" 
              required
            >
          </div>
          <div class="form-group">
            <label for="email">E-posta</label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email" 
              required
            >
          </div>
          <div class="form-group">
            <label for="phone">Telefon</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="form.phone"
            >
          </div>
          <div class="form-group">
            <label for="address">Adres</label>
            <textarea 
              id="address" 
              v-model="form.address" 
              rows="3"
            ></textarea>
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
            <button type="button" class="btn-cancel" @click="closeEditModal">
              İptal
            </button>
            <button type="submit" class="btn-submit">
              Güncelle
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

interface Customer {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const customers = ref<Customer[]>([])

const fetchCustomers = async () => {
  const response = await axios.get('/api/customers')
  customers.value = response.data
}

onMounted(fetchCustomers)

const showViewModal = ref(false)
const showEditModal = ref(false)
const selectedCustomer = ref<Customer | null>(null)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  isActive: true
})

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const viewCustomer = (customer: Customer) => {
  selectedCustomer.value = customer
  showViewModal.value = true
}

const editCustomer = (customer: Customer) => {
  selectedCustomer.value = customer
  Object.assign(form, customer)
  showEditModal.value = true
}

const deleteCustomer = async (id: number) => {
  if (confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
    try {
      await axios.delete(`/api/customers/${id}`)
      await fetchCustomers()
    } catch (error) {
      alert('Müşteri silinirken bir hata oluştu.')
    }
  }
}

const handleSubmit = async () => {
  try {
    if (selectedCustomer.value) {
      await axios.patch(`/api/customers/${selectedCustomer.value.id}`, form)
      await fetchCustomers()
    }
    closeEditModal()
  } catch (error) {
    alert('Müşteri kaydedilirken bir hata oluştu.')
  }
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedCustomer.value = null
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedCustomer.value = null
  Object.assign(form, {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    isActive: true
  })
}
</script>

<style scoped>
.admin-customers {
  padding: 1rem;
}

.page-header {
  margin-bottom: 2rem;
}

.customers-table {
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

.btn-view, .btn-edit, .btn-delete {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-view {
  background-color: #2196f3;
  color: white;
}

.btn-edit {
  background-color: #ff9800;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-view:hover {
  background-color: #1976d2;
}

.btn-edit:hover {
  background-color: #f57c00;
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

.customer-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-group label {
  font-weight: 500;
  color: #666;
}

.detail-group p {
  margin: 0;
  color: #333;
}

.customer-form {
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

.form-actions, .modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel, .btn-close {
  padding: 0.75rem 1.5rem;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-cancel:hover, .btn-close:hover {
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