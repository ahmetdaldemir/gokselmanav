import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: null })
  description: string;

  @Column({ default: null })
  parentId: number;

  @Column({ unique: true })
  slug: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: null })
  image: string;

  @OneToMany(() => Order, order => order.customer)
  orders: Order[];

  @OneToMany(() => Product, product => product.category)
  products: Product[];

  // Alt kategoriler
  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  // Üst kategori
  @ManyToOne(() => Category, category => category.children)
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 