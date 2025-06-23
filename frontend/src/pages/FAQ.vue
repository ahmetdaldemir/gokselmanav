<template>
  <div class="faq">
    <h1>Sıkça Sorulan Sorular</h1>
    
    <div class="content">
      <div class="faq-item" v-for="(item, index) in faqItems" :key="index">
        <div class="faq-question" @click="toggleFaq(index)">
          <h3>{{ item.question }}</h3>
          <span class="toggle-icon">{{ item.isOpen ? '−' : '+' }}</span>
        </div>
        <div class="faq-answer" :class="{ 'open': item.isOpen }">
          <p>{{ item.answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const faqItems = ref([
  {
    question: 'Sipariş vermek için üye olmam gerekiyor mu?',
    answer: 'Evet, sipariş verebilmek için üye olmanız gerekmektedir. Üyelik ücretsizdir ve sadece birkaç dakika sürer.',
    isOpen: false
  },
  {
    question: 'Minimum sipariş tutarı var mı?',
    answer: 'Evet, minimum sipariş tutarımız 100 TL\'dir. Bu tutarın altındaki siparişler için teslimat ücreti alınır.',
    isOpen: false
  },
  {
    question: 'Teslimat süresi ne kadar?',
    answer: 'Teslimat süresi genellikle 2-4 saat arasındadır. Yoğun dönemlerde bu süre uzayabilir. Siparişiniz onaylandıktan sonra size tahmini teslimat süresi bildirilir.',
    isOpen: false
  },
  {
    question: 'Hangi bölgelere teslimat yapıyorsunuz?',
    answer: 'Şu anda İstanbul\'un belirli bölgelerine teslimat yapmaktayız. Teslimat bölgelerimizi web sitemizden kontrol edebilirsiniz.',
    isOpen: false
  },
  {
    question: 'Ödeme seçenekleri nelerdir?',
    answer: 'Kredi kartı, banka kartı, kapıda ödeme ve online bankacılık seçeneklerini sunuyoruz. Tüm ödemeler güvenli şekilde işlenir.',
    isOpen: false
  },
  {
    question: 'Ürün iadesi nasıl yapılır?',
    answer: 'Ürün tesliminden itibaren 24 saat içinde hasar veya kalite sorunu bildirmeniz gerekir. Müşteri hizmetlerimizle iletişime geçerek iade sürecini başlatabilirsiniz.',
    isOpen: false
  },
  {
    question: 'Ürünler taze mi?',
    answer: 'Evet, tüm ürünlerimiz günlük olarak tedarik edilir ve soğuk zincirde korunarak size ulaştırılır. Kalite standartlarımız çok yüksektir.',
    isOpen: false
  },
  {
    question: 'Siparişimi iptal edebilir miyim?',
    answer: 'Siparişiniz hazırlanmaya başlanmadan önce iptal edebilirsiniz. İptal için müşteri hizmetlerimizle iletişime geçin.',
    isOpen: false
  },
  {
    question: 'Kargo ücreti ne kadar?',
    answer: '100 TL altındaki siparişler için 18,99 TL kargo ücreti alınır. 500 TL üzeri siparişlerde kargo ücretsizdir.',
    isOpen: false
  },
  {
    question: 'Hangi saatlerde sipariş verebilirim?',
    answer: '7/24 online sipariş verebilirsiniz. Ancak teslimat saatleri 08:00-22:00 arasındadır.',
    isOpen: false
  },
  {
    question: 'Ürün bulunamazsa ne olur?',
    answer: 'Eğer sipariş ettiğiniz ürün stokta yoksa, size alternatif ürün önerilir veya ürün iptal edilerek ödeme iadesi yapılır.',
    isOpen: false
  },
  {
    question: 'Müşteri hizmetlerine nasıl ulaşabilirim?',
    answer: 'Müşteri hizmetlerimize telefon, e-posta veya web sitemizdeki iletişim formu üzerinden ulaşabilirsiniz. Çalışma saatlerimiz 08:00-22:00 arasındadır.',
    isOpen: false
  }
])

const toggleFaq = (index: number) => {
  faqItems.value[index].isOpen = !faqItems.value[index].isOpen
}
</script>

<style scoped>
.faq {
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
  gap: 1rem;
}

.faq-item {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s;
}

.faq-question:hover {
  background: #e9ecef;
}

.faq-question h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 500;
}

.toggle-icon {
  font-size: 1.5rem;
  font-weight: bold;
  color: #42b983;
  min-width: 20px;
  text-align: center;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  background: white;
}

.faq-answer.open {
  max-height: 200px;
}

.faq-answer p {
  margin: 0;
  padding: 1.5rem;
  color: #555;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .faq {
    padding: 1rem;
    margin: 0.5rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .faq-question {
    padding: 1rem;
  }
  
  .faq-question h3 {
    font-size: 1rem;
  }
  
  .faq-answer p {
    padding: 1rem;
  }
}
</style> 