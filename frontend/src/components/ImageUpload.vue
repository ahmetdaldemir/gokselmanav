<template>
  <div class="image-upload">
    <div
      class="upload-area"
      :class="{ 'dragover': isDragOver, 'has-image': imageUrl }"
      @drop="handleDrop"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        style="display: none"
      />
      
      <div v-if="!imageUrl" class="upload-placeholder">
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Resim yüklemek için tıklayın veya sürükleyin</p>
        <span class="upload-hint">PNG, JPG, JPEG (Max: 5MB)</span>
      </div>
      
      <div v-else class="image-preview">
        <img :src="imageUrl" :alt="'Yüklenen resim'" />
        <div class="image-overlay">
          <button type="button" class="change-btn" @click.stop="triggerFileInput">
            <i class="fas fa-edit"></i>
            Değiştir
          </button>
          <button type="button" class="remove-btn" @click.stop="removeImage">
            <i class="fas fa-trash"></i>
            Kaldır
          </button>
        </div>
      </div>
      
      <div v-if="isUploading" class="upload-progress">
        <div class="spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    </div>
    
    <div v-if="error" class="upload-error">
      <i class="fas fa-exclamation-triangle"></i>
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'

interface Props {
  modelValue?: string
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: ''
})

const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement>()
const imageUrl = ref(props.modelValue)
const isDragOver = ref(false)
const isUploading = ref(false)
const error = ref('')

// Model value değiştiğinde imageUrl'i güncelle
watch(() => props.modelValue, (newValue) => {
  imageUrl.value = newValue
})

// ImageUrl değiştiğinde emit et
watch(imageUrl, (newValue) => {
  emit('update:modelValue', newValue)
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    uploadImage(file)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      uploadImage(file)
    } else {
      error.value = 'Sadece resim dosyaları kabul edilir.'
    }
  }
}

const uploadImage = async (file: File) => {
  // Dosya boyutu kontrolü (5MB)
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'Dosya boyutu 5MB\'dan küçük olmalıdır.'
    return
  }

  // Dosya tipi kontrolü
  if (!file.type.startsWith('image/')) {
    error.value = 'Sadece resim dosyaları kabul edilir.'
    return
  }

  isUploading.value = true
  error.value = ''

  try {
    const formData = new FormData()
    formData.append('image', file)

    const response = await axios.post('/backend/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data.success) {
      imageUrl.value = response.data.imageUrl
    } else {
      error.value = 'Resim yüklenirken bir hata oluştu.'
    }
  } catch (err: any) {
    console.error('Upload error:', err)
    error.value = err.response?.data?.message || 'Resim yüklenirken bir hata oluştu.'
  } finally {
    isUploading.value = false
  }
}

const removeImage = () => {
  imageUrl.value = ''
  error.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.image-upload {
  width: 100%;
}

.upload-area {
  position: relative;
  width: 100%;
  height: 200px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
  overflow: hidden;
}

.upload-area:hover {
  border-color: #42b983;
  background-color: #f0f9f4;
}

.upload-area.dragover {
  border-color: #42b983;
  background-color: #e8f5e9;
  transform: scale(1.02);
}

.upload-area.has-image {
  height: 300px;
}

.upload-placeholder {
  text-align: center;
  color: #666;
}

.upload-placeholder i {
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.upload-placeholder p {
  margin: 0.5rem 0;
  font-weight: 500;
}

.upload-hint {
  font-size: 0.875rem;
  color: #999;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 6px;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.change-btn, .remove-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.change-btn {
  background-color: #2196f3;
  color: white;
}

.change-btn:hover {
  background-color: #1976d2;
}

.remove-btn {
  background-color: #f44336;
  color: white;
}

.remove-btn:hover {
  background-color: #d32f2f;
}

.upload-progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.upload-error {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.upload-error i {
  color: #c62828;
}
</style> 