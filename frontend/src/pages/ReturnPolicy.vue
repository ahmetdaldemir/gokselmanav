<template>
  <div class="return-policy">
    <h1>İade ve Değişim Politikası</h1>
    
    <div class="content">
      <section>
        <h2>1. Genel İade Koşulları</h2>
        <p>Göksel Manav olarak müşteri memnuniyetini en üst düzeyde tutmak için kapsamlı bir iade ve değişim politikası sunuyoruz.</p>
      </section>

      <section>
        <h2>2. İade Süresi</h2>
        <p>Ürün tesliminden itibaren <strong>24 saat</strong> içinde iade talebinde bulunmanız gerekmektedir. Bu süre sonrasında iade kabul edilmez.</p>
      </section>

      <section>
        <h2>3. İade Edilebilir Ürünler</h2>
        <p>Aşağıdaki durumlarda ürün iadesi kabul edilir:</p>
        <ul>
          <li><strong>Hasarlı Ürünler:</strong> Teslimat sırasında zarar gören ürünler</li>
          <li><strong>Kalite Sorunları:</strong> Tazelik, kalite veya kullanım sorunları</li>
          <li><strong>Yanlış Ürün:</strong> Sipariş ettiğinizden farklı ürün teslim edilmesi</li>
          <li><strong>Eksik Ürün:</strong> Siparişinizde eksik ürün bulunması</li>
        </ul>
      </section>

      <section>
        <h2>4. İade Edilemeyen Ürünler</h2>
        <p>Aşağıdaki durumlarda iade kabul edilmez:</p>
        <ul>
          <li>Müşteri hatası nedeniyle zarar gören ürünler</li>
          <li>24 saat süresi geçtikten sonra bildirilen sorunlar</li>
          <li>Ambalajı açılmış ve kullanılmış ürünler</li>
          <li>Soğuk zinciri bozulmuş ürünler</li>
          <li>Özel sipariş ürünleri</li>
        </ul>
      </section>

      <section>
        <h2>5. İade Süreci</h2>
        <p>İade süreci şu şekilde işler:</p>
        <ol>
          <li><strong>Bildirim:</strong> Sorunu 24 saat içinde müşteri hizmetlerimize bildirin</li>
          <li><strong>Değerlendirme:</strong> Durum değerlendirilir ve onay verilir</li>
          <li><strong>Toplama:</strong> Ürün adresinizden toplanır (ücretsiz)</li>
          <li><strong>İade:</strong> Ürün iade edilir veya değişim yapılır</li>
          <li><strong>Ödeme İadesi:</strong> Gerekirse ödeme iadesi yapılır</li>
        </ol>
      </section>

      <section>
        <h2>6. Değişim Politikası</h2>
        <p>Değişim koşulları:</p>
        <ul>
          <li>Aynı ürünün farklı boyutu ile değişim</li>
          <li>Benzer kalitede alternatif ürün önerisi</li>
          <li>Değişim ürünü stokta mevcut olmalıdır</li>
          <li>Değişim ücretsizdir</li>
        </ul>
      </section>

      <section>
        <h2>7. Ödeme İadesi</h2>
        <p>Ödeme iadesi şu şekilde yapılır:</p>
        <ul>
          <li><strong>Kredi/Banka Kartı:</strong> 3-5 iş günü içinde hesabınıza iade edilir</li>
          <li><strong>Kapıda Ödeme:</strong> Banka hesabınıza transfer edilir</li>
          <li><strong>Online Bankacılık:</strong> Aynı hesaba iade edilir</li>
        </ul>
      </section>

      <section>
        <h2>8. İade Formu</h2>
        <p>İade talebinde bulunurken şu bilgileri vermeniz gerekir:</p>
        <ul>
          <li>Sipariş numarası</li>
          <li>Ürün adı ve miktarı</li>
          <li>İade nedeni</li>
          <li>İletişim bilgileri</li>
          <li>Ürün fotoğrafı (varsa)</li>
        </ul>
      </section>

      <section>
        <h2>9. Özel Durumlar</h2>
        <p>Bazı özel durumlar için farklı kurallar geçerli olabilir:</p>
        <ul>
          <li><strong>Toplu Siparişler:</strong> Kurumsal müşteriler için özel koşullar</li>
          <li><strong>Sezonsal Ürünler:</strong> Mevsimlik ürünler için kısıtlı iade</li>
          <li><strong>Promosyon Ürünleri:</strong> İndirimli ürünler için özel koşullar</li>
        </ul>
      </section>

      <section>
        <h2>10. İletişim</h2>
        <p>İade ve değişim ile ilgili sorularınız için:</p>
        <p><strong>Telefon:</strong> +90 555 123 45 67</p>
        <p><strong>E-posta:</strong> iade@gokselmanav.com</p>
        <p><strong>Çalışma Saatleri:</strong> 08:00 - 22:00 (Her gün)</p>
        <p><strong>Son güncelleme:</strong> 22 Haziran 2024</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Return policy component
</script>

<style scoped>
.return-policy {
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

ul, ol {
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
  .return-policy {
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