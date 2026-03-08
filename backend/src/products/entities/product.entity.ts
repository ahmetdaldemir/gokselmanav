import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Category } from '../../category/entities/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  image: string;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => Category, category => category.products)
  category: Category;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  stock: number;

  @Column({
    type: 'enum',
    enum: ['kg', 'adet', 'gram', 'kasa', 'dilim', 'paket', 'diğer'],
    default: 'adet',
  })
  salesType: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  minKg?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 