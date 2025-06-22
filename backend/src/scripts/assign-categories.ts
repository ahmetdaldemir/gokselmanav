import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductsService } from '../products/products.service';
import { CategoryService } from '../category/category.service';

async function assignCategories() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const productsService = app.get(ProductsService);
  const categoryService = app.get(CategoryService);

  try {
    // Tüm ürünleri ve kategorileri al
    const products = await productsService.findAll();
    const categories = await categoryService.findAll();

    console.log(`Toplam ${products.length} ürün bulundu`);
    console.log(`Toplam ${categories.length} kategori bulundu`);

    // Kategori mapping'i
    const categoryMapping: { [key: string]: number } = {
      // Meyveler
      'muz': 9, // Meyve
      'elma': 9, // Meyve
      'portakal': 12, // Narenciye
      'limon': 12, // Narenciye
      'karpuz': 11, // Kavun ve Karpuz
      'kavun': 11, // Kavun ve Karpuz
      'şeftali': 13, // Mevsim Meyveleri
      'kayısı': 13, // Mevsim Meyveleri
      'kiraz': 13, // Mevsim Meyveleri
      'üzüm': 13, // Mevsim Meyveleri
      'ananas': 10, // Egzotik Meyveler
      'avokado': 10, // Egzotik Meyveler
      'kivi': 10, // Egzotik Meyveler
      'mango': 10, // Egzotik Meyveler
      'hindistan cevizi': 10, // Egzotik Meyveler
      'ceviz': 14, // Kabuklu Yemişler
      'fındık': 14, // Kabuklu Yemişler
      'badem': 14, // Kabuklu Yemişler
      'yer fıstığı': 14, // Kabuklu Yemişler
      'incir': 13, // Mevsim Meyveleri
      'erik': 13, // Mevsim Meyveleri
      'armut': 13, // Mevsim Meyveleri
      'böğürtlen': 13, // Mevsim Meyveleri
      'yaban mersini': 13, // Mevsim Meyveleri
      'altın çilek': 10, // Egzotik Meyveler
      'demirhindi': 10, // Egzotik Meyveler

      // Sebzeler
      'domates': 5, // Mevsim Sebzeleri
      'patates': 7, // Patates, Soğan, Sarımsak
      'soğan': 7, // Patates, Soğan, Sarımsak
      'sarımsak': 7, // Patates, Soğan, Sarımsak
      'hıyar': 5, // Mevsim Sebzeleri
      'biber': 5, // Mevsim Sebzeleri
      'patlıcan': 5, // Mevsim Sebzeleri
      'kabak': 5, // Mevsim Sebzeleri
      'havuç': 5, // Mevsim Sebzeleri
      'pancar': 5, // Mevsim Sebzeleri
      'brokoli': 5, // Mevsim Sebzeleri
      'karnabahar': 5, // Mevsim Sebzeleri
      'lahana': 5, // Mevsim Sebzeleri
      'marul': 6, // Otlar, Yeşillikler
      'roka': 6, // Otlar, Yeşillikler
      'maydanoz': 6, // Otlar, Yeşillikler
      'dereotu': 6, // Otlar, Yeşillikler
      'nane': 6, // Otlar, Yeşillikler
      'fesleğen': 6, // Otlar, Yeşillikler
      'reyhan': 6, // Otlar, Yeşillikler
      'kuzu kulağı': 6, // Otlar, Yeşillikler
      'ıspanak': 5, // Mevsim Sebzeleri
      'fasulye': 5, // Mevsim Sebzeleri
      'bezelye': 5, // Mevsim Sebzeleri
      'bamya': 5, // Mevsim Sebzeleri
      'enginar': 5, // Mevsim Sebzeleri
      'kuşkonmaz': 5, // Mevsim Sebzeleri
      'mantar': 5, // Mevsim Sebzeleri
      'zencefil': 3, // Egzotik Sebzeler
      'asma yaprağı': 5, // Mevsim Sebzeleri
      'mısır': 5, // Mevsim Sebzeleri
    };

    let updatedCount = 0;

    for (const product of products) {
      const productName = product.name.toLowerCase();
      let assignedCategoryId: number | null = null;

      // Kategori mapping'inde ara
      for (const [keyword, categoryId] of Object.entries(categoryMapping)) {
        if (productName.includes(keyword)) {
          assignedCategoryId = categoryId;
          break;
        }
      }

      // Eğer kategori bulunamadıysa, genel kategoriye ata
      if (!assignedCategoryId) {
        // Meyve içeren ürünler
        if (productName.includes('muz') || productName.includes('elma') || 
            productName.includes('portakal') || productName.includes('limon') ||
            productName.includes('karpuz') || productName.includes('kavun') ||
            productName.includes('şeftali') || productName.includes('kayısı') ||
            productName.includes('kiraz') || productName.includes('üzüm') ||
            productName.includes('ananas') || productName.includes('avokado') ||
            productName.includes('kivi') || productName.includes('mango') ||
            productName.includes('hindistan') || productName.includes('ceviz') ||
            productName.includes('fındık') || productName.includes('badem') ||
            productName.includes('fıstık') || productName.includes('incir') ||
            productName.includes('erik') || productName.includes('armut') ||
            productName.includes('böğürtlen') || productName.includes('mersini') ||
            productName.includes('çilek') || productName.includes('demirhindi')) {
          assignedCategoryId = 9; // Meyve
        }
        // Sebze içeren ürünler
        else if (productName.includes('domates') || productName.includes('patates') ||
                 productName.includes('soğan') || productName.includes('sarımsak') ||
                 productName.includes('hıyar') || productName.includes('biber') ||
                 productName.includes('patlıcan') || productName.includes('kabak') ||
                 productName.includes('havuç') || productName.includes('pancar') ||
                 productName.includes('brokoli') || productName.includes('karnabahar') ||
                 productName.includes('lahana') || productName.includes('marul') ||
                 productName.includes('roka') || productName.includes('maydanoz') ||
                 productName.includes('dereotu') || productName.includes('nane') ||
                 productName.includes('fesleğen') || productName.includes('reyhan') ||
                 productName.includes('kuzu') || productName.includes('ıspanak') ||
                 productName.includes('fasulye') || productName.includes('bezelye') ||
                 productName.includes('bamya') || productName.includes('enginar') ||
                 productName.includes('kuşkonmaz') || productName.includes('mantar') ||
                 productName.includes('zencefil') || productName.includes('asma') ||
                 productName.includes('mısır')) {
          assignedCategoryId = 2; // Sebze
        }
      }

      // Ürünü güncelle
      if (assignedCategoryId && product.categoryId !== assignedCategoryId) {
        await productsService.update(product.id, { categoryId: assignedCategoryId });
        updatedCount++;
        console.log(`Ürün "${product.name}" -> Kategori ID: ${assignedCategoryId}`);
      }
    }

    console.log(`\nToplam ${updatedCount} ürün güncellendi`);

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await app.close();
  }
}

assignCategories(); 