<template>
  <div class="corporate">
    <div class="container">
      <h1>Kurumsal</h1>
      
      <section class="about-section">
        <h2>Hakkımızda</h2>
        <p>
          Biz, müşterilerimize en kaliteli ürünleri en uygun fiyatlarla sunmayı hedefleyen bir e-ticaret platformuyuz.
          Müşteri memnuniyetini ön planda tutarak, güvenilir ve hızlı alışveriş deneyimi sunuyoruz.
        </p>
      </section>

      <section class="mission-section">
        <h2>Misyonumuz</h2>
        <p>
          Müşterilerimize en iyi alışveriş deneyimini sunmak, kaliteli ürünleri uygun fiyatlarla ulaştırmak
          ve sürdürülebilir bir e-ticaret ekosistemi oluşturmak.
        </p>
      </section>

      <section class="vision-section">
        <h2>Vizyonumuz</h2>
        <p>
          Türkiye'nin önde gelen e-ticaret platformlarından biri olmak ve müşterilerimize
          her zaman en iyi hizmeti sunmak.
        </p>
      </section>

      <section class="values-section">
        <h2>Değerlerimiz</h2>
        <ul>
          <li>Müşteri Odaklılık</li>
          <li>Kalite</li>
          <li>Güvenilirlik</li>
          <li>Yenilikçilik</li>
          <li>Sürdürülebilirlik</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic will be added here
</script>

<style scoped>
.corporate {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

section {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

p {
  color: #666;
  line-height: 1.6;
  font-size: 1.1rem;
}

.values-section ul {
  list-style: none;
  padding: 0;
}

.values-section li {
  color: #666;
  font-size: 1.1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.values-section li:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .corporate {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  section {
    padding: 1.5rem;
  }
}
</style> 