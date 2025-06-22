# Migros Crawler Script

Bu script, Migros web sitesinden "manav" araması ile ürünleri çeker ve veritabanınıza ekler.

## Kullanım

### 1. Veritabanı Bağlantısı
Script'i çalıştırmadan önce veritabanı bağlantı bilgilerinizi kontrol edin. Varsayılan değerler:

- Host: localhost
- Port: 5432
- Username: postgres
- Password: password
- Database: gokselmanav

Bu değerleri değiştirmek için environment variables kullanabilirsiniz:
- DB_HOST
- DB_PORT
- DB_USERNAME
- DB_PASSWORD
- DB_NAME

### 2. Script'i Çalıştırma

```bash
# Backend klasöründe
npm run crawler
```

### 3. Ne Yapar?

1. Migros API'sine bağlanır ve "manav" araması yapar
2. Bulunan ürünleri çeker
3. Her ürün için:
   - Aynı isimde ürün var mı kontrol eder
   - Yoksa veritabanına ekler
   - Varsa atlar (duplicate önleme)
4. İşlem sonuçlarını konsola yazdırır

### 4. Özellikler

- **Duplicate Önleme**: Aynı isimde ürünler eklenmez
- **Hata Yönetimi**: Her ürün için ayrı hata yönetimi
- **Logging**: Detaylı konsol logları
- **Güvenli Bağlantı**: Timeout ve header ayarları

### 5. Çıktı Örneği

```
Database connected successfully
Fetching products from Migros...
Found 125 products from Migros
Saving products to database...
Saved product: Patates Yeni Mahsul Kg
Saved product: Domates Kg
Product "Elma Kg" already exists, skipping...
...
Crawling completed successfully!
Database disconnected
```

## Not

Bu script sadece bir kez çalıştırılmalıdır. Tekrar çalıştırırsanız, aynı ürünler tekrar eklenmeyecektir (isim kontrolü sayesinde). 