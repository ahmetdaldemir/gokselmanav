import { DataSource } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Category } from '../category/entities/category.entity';

class FixCategoryIds {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST || '185.209.228.189',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'gokselmanav_user',
      password: process.env.DB_PASSWORD || 'gokselmanav_password_2024',
      database: process.env.DB_NAME || 'gokselmanav_db',
      entities: [Product, Category],
      synchronize: false,
      logging: true,
    });
  }

  async connect() {
    try {
      await this.dataSource.initialize();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    await this.dataSource.destroy();
    console.log('Database disconnected');
  }

  async fixCategoryIds() {
    const productRepository = this.dataSource.getRepository(Product);
    const categoryRepository = this.dataSource.getRepository(Category);

    try {
      // Önce varsayılan kategori oluştur
      let defaultCategory = await categoryRepository.findOne({
        where: { name: 'Diğer' }
      });

      if (!defaultCategory) {
        defaultCategory = categoryRepository.create({
          name: 'Diğer',
          description: 'Diğer kategoriler',
          slug: 'diger',
          isActive: true
        });
        await categoryRepository.save(defaultCategory);
        console.log('Default category created');
      }

      // categoryId'si NULL olan ürünleri bul
      const productsWithNullCategory = await productRepository
        .createQueryBuilder('product')
        .where('product.categoryId IS NULL')
        .getMany();

      console.log(`Found ${productsWithNullCategory.length} products with NULL categoryId`);

      // Bu ürünlerin categoryId'sini varsayılan kategori ile güncelle
      for (const product of productsWithNullCategory) {
        product.categoryId = defaultCategory.id;
        await productRepository.save(product);
        console.log(`Updated product: ${product.name}`);
      }

      console.log('All products updated successfully!');
    } catch (error) {
      console.error('Error fixing category IDs:', error);
    }
  }

  async run() {
    try {
      await this.connect();
      await this.fixCategoryIds();
    } catch (error) {
      console.error('Script failed:', error);
    } finally {
      await this.disconnect();
    }
  }
}

// Script'i çalıştır
if (require.main === module) {
  const fixer = new FixCategoryIds();
  fixer.run();
}

export default FixCategoryIds; 