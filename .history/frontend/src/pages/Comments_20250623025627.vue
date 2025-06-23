<template>
  <div class="comments-page">
    <h1>Müşteri Yorumları</h1>
    
    <div class="content">
      <!-- İstatistikler -->
      <section class="stats-section">
        <div class="stats-card">
          <div class="rating-display">
            <div class="average-rating">
              <span class="rating-number">{{ stats.averageRating }}</span>
              <div class="stars">
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.round(stats.averageRating) }">★</span>
              </div>
            </div>
            <div class="rating-info">
              <p class="total-comments">{{ stats.totalComments }} yorum</p>
              <p class="rating-text">Ortalama puan</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Yorum Ekleme Formu -->
      <section class="comment-form-section">
        <h2>Yorum Yap</h2>
        <form @submit.prevent="submitComment" class="comment-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Adınız Soyadınız *</label>
              <input 
                type="text" 
                id="name" 
                v-model="newComment.name" 
                required
                :disabled="isSubmitting"
              >
            </div>
            <div class="form-group">
              <label for="email">E-posta Adresiniz *</label>
              <input 
                type="email" 
                id="email" 
                v-model="newComment.email" 
                required
                :disabled="isSubmitting"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label>Puanınız *</label>
            <div class="rating-input">
              <span 
                v-for="i in 5" 
                :key="i" 
                class="star-input" 
                :class="{ filled: i <= newComment.rating }"
                @click="newComment.rating = i"
                @mouseenter="hoverRating = i"
                @mouseleave="hoverRating = 0"
              >
                ★
              </span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="comment">Yorumunuz *</label>
            <textarea 
              id="comment" 
              v-model="newComment.comment" 
              rows="4" 
              required
              :disabled="isSubmitting"
              placeholder="Deneyiminizi paylaşın..."
            ></textarea>
          </div>
          
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Gönderiliyor...' : 'Yorumu Gönder' }}
          </button>
        </form>
      </section>

      <!-- Yorumlar Listesi -->
      <section class="comments-list-section">
        <h2>Müşteri Yorumları</h2>
        
        <div v-if="loading" class="loading">
          Yorumlar yükleniyor...
        </div>
        
        <div v-else-if="comments.length === 0" class="no-comments">
          Henüz yorum yapılmamış. İlk yorumu siz yapın!
        </div>
        
        <div v-else class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-header">
              <div class="commenter-info">
                <h3 class="commenter-name">{{ comment.name }}</h3>
                <div class="comment-rating">
                  <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= comment.rating }">★</span>
                </div>
              </div>
              <div class="comment-date">
                {{ formatDate(comment.createdAt) }}
              </div>
            </div>
            <div class="comment-content">
              <p>{{ comment.comment }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Comment {
  id: number
  name: string
  email: string
  comment: string
  rating: number
  createdAt: string
}

interface Stats {
  averageRating: number
  totalComments: number
  ratingDistribution: Record<number, number>
}

const comments = ref<Comment[]>([])
const stats = ref<Stats>({
  averageRating: 0,
  totalComments: 0,
  ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
})
const loading = ref(false)
const isSubmitting = ref(false)
const hoverRating = ref(0)

const newComment = ref({
  name: '',
  email: '',
  comment: '',
  rating: 5
})

onMounted(async () => {
  await loadComments()
  await loadStats()
})

const loadComments = async () => {
  loading.value = true
  try {
    const response = await axios.get('/backend/comments')
    comments.value = response.data
  } catch (error) {
    console.error('Yorumlar yüklenemedi:', error)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await axios.get('/backend/comments/stats')
    stats.value = response.data
  } catch (error) {
    console.error('İstatistikler yüklenemedi:', error)
  }
}

const submitComment = async () => {
  if (!newComment.value.name || !newComment.value.email || !newComment.value.comment) {
    return
  }

  isSubmitting.value = true
  try {
    await axios.post('/backend/comments', newComment.value)
    
    // Formu temizle
    newComment.value = {
      name: '',
      email: '',
      comment: '',
      rating: 5
    }
    
    // Yorumları ve istatistikleri yenile
    await loadComments()
    await loadStats()
    
    alert('Yorumunuz başarıyla gönderildi!')
  } catch (error) {
    console.error('Yorum gönderilemedi:', error)
    alert('Yorum gönderilirken bir hata oluştu. Lütfen tekrar deneyin.')
  } finally {
    isSubmitting.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.comments-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stats-section {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
}

.stats-card {
  text-align: center;
}

.rating-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.average-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-number {
  font-size: 3rem;
  font-weight: bold;
  color: #42b983;
}

.stars {
  display: flex;
  gap: 0.2rem;
}

.star {
  font-size: 1.5rem;
  color: #ddd;
  cursor: default;
}

.star.filled {
  color: #f7b500;
}

.rating-info {
  text-align: left;
}

.total-comments {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.rating-text {
  color: #666;
  margin: 0;
}

.comment-form-section {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 2rem;
}

.comment-form-section h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #42b983;
}

.rating-input {
  display: flex;
  gap: 0.5rem;
}

.star-input {
  font-size: 2rem;
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s;
}

.star-input.filled {
  color: #f7b500;
}

.star-input:hover {
  color: #f7b500;
}

.btn-submit {
  width: 100%;
  padding: 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #3aa876;
}

.btn-submit:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.comments-list-section h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.loading,
.no-comments {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  background: #fafafa;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.commenter-info {
  flex: 1;
}

.commenter-name {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.comment-rating {
  display: flex;
  gap: 0.2rem;
}

.comment-date {
  color: #999;
  font-size: 0.9rem;
}

.comment-content p {
  margin: 0;
  color: #555;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .comments-page {
    padding: 1rem;
    margin: 0.5rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .comment-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .rating-display {
    flex-direction: column;
    gap: 1rem;
  }
}
</style> 