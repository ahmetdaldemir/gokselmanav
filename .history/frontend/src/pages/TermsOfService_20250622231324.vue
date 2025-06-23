<template>
  <div class="terms-of-service">
    <h1>Kullanım Koşulları</h1>
    
    <div class="content">
      <section>
        <h2>1. Genel Hükümler</h2>
        <p>Bu kullanım koşulları, Göksel Manav web sitesini kullanırken geçerli olan kuralları belirler. Siteyi kullanarak bu koşulları kabul etmiş sayılırsınız.</p>
      </section>

      <section>
        <h2>2. Hizmet Kapsamı</h2>
        <p>Göksel Manav olarak aşağıdaki hizmetleri sunarız:</p>
        <ul>
          <li>Online manav ürünleri satışı</li>
          <li>Ev teslimatı hizmeti</li>
          <li>Müşteri hizmetleri desteği</li>
          <li>Online ödeme seçenekleri</li>
        </ul>
      </section>

      <section>
        <h2>3. Üyelik ve Hesap</h2>
        <p>Hizmetlerimizden yararlanmak için:</p>
        <ul>
          <li>18 yaşından büyük olmanız gerekir</li>
          <li>Doğru ve güncel bilgiler vermeniz gerekir</li>
          <li>Hesap güvenliğinizden siz sorumlusunuz</li>
          <li>Hesabınızı başkalarına devredemezsiniz</li>
        </ul>
      </section>

      <section>
        <h2>4. Sipariş ve Ödeme</h2>
        <p>Sipariş süreci:</p>
        <ul>
          <li>Siparişleriniz onaylandıktan sonra işleme alınır</li>
          <li>Ödeme güvenli şekilde yapılır</li>
          <li>Fiyatlar KDV dahil olarak gösterilir</li>
          <li>Kargo ücreti ayrıca hesaplanır</li>
        </ul>
      </section>

      <section>
        <h2>5. Teslimat</h2>
        <p>Teslimat koşulları:</p>
        <ul>
          <li>Belirtilen adrese teslimat yapılır</li>
          <li>Teslimat süreleri değişkenlik gösterebilir</li>
          <li>Müşteri teslimat sırasında evde olmalıdır</li>
          <li>Ürünler soğuk zincirde korunur</li>
        </ul>
      </section>

      <section>
        <h2>6. İade ve Değişim</h2>
        <p>İade koşulları:</p>
        <ul>
          <li>Ürün tesliminden itibaren 24 saat içinde bildirim</li>
          <li>Hasarlı veya bozuk ürünler için tam iade</li>
          <li>Kalite sorunları için değişim</li>
          <li>Müşteri hatası durumunda iade yapılmaz</li>
        </ul>
      </section>

      <section>
        <h2>7. Sorumluluk Sınırları</h2>
        <p>Göksel Manav'ın sorumlulukları:</p>
        <ul>
          <li>Hizmet kalitesini korumak</li>
          <li>Kişisel verileri korumak</li>
          <li>Güvenli ödeme sağlamak</li>
          <li>Müşteri memnuniyetini sağlamak</li>
        </ul>
      </section>

      <section>
        <h2>8. Fikri Mülkiyet</h2>
        <p>Web sitesindeki tüm içerik Göksel Manav'a aittir:</p>
        <ul>
          <li>Logo ve marka hakları</li>
          <li>Ürün görselleri</li>
          <li>Site tasarımı</li>
          <li>İçerik ve metinler</li>
        </ul>
      </section>

      <section>
        <h2>9. Değişiklikler</h2>
        <p>Bu kullanım koşulları güncellenebilir. Önemli değişiklikler olduğunda sizi bilgilendireceğiz.</p>
      </section>

      <section>
        <h2>10. İletişim</h2>
        <p>Kullanım koşullarıyla ilgili sorularınız için:</p>
        <p><strong>E-posta:</strong> info@gokselmanav.com</p>
        <p><strong>Telefon:</strong> +90 555 123 45 67</p>
        <p><strong>Son güncelleme:</strong> 22 Haziran 2024</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Terms of service component
</script>

<style scoped>
.terms-of-service {
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
  line-height: 1.6;
}

section {
  margin-bottom: 2rem;
}

h2 {
  color: #42b983;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

p {
  margin-bottom: 1rem;
  color: #333;
}

ul {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

li {
  margin-bottom: 0.5rem;
  color: #555;
}

strong {
  color: #2c3e50;
}

@media (max-width: 768px) {
  .terms-of-service {
    padding: 1rem;
    margin: 0.5rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  h2 {
    font-size: 1.2rem;
  }
}
</style> 