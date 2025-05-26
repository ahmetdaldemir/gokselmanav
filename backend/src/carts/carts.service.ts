import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartItem } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ProductsService } from '../products/products.service';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly productsService: ProductsService,
    private readonly customersService: CustomersService,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const { customerId, items } = createCartDto;

    // Verify customer exists
    const customer = await this.customersService.findOne(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    // Create cart items
    const cartItems: CartItem[] = [];

    for (const item of items) {
      const product = await this.productsService.findOne(item.productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      const cartItem = this.cartItemRepository.create({
        product,
        quantity: item.quantity,
      });

      cartItems.push(cartItem);
    }

    const cart = this.cartRepository.create({
      customer,
      customerId,
      cartItems,
    });

    return this.cartRepository.save(cart);
  }

  async findAll(): Promise<Cart[]> {
    return this.cartRepository.find({
      relations: ['customer', 'cartItems', 'cartItems.product'],
    });
  }

  async findOne(id: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['customer', 'cartItems', 'cartItems.product'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    return cart;
  }

  async findByCustomerId(customerId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { customerId },
      relations: ['customer', 'cartItems', 'cartItems.product'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart for customer with ID ${customerId} not found`);
    }

    return cart;
  }

  async update(id: number, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.findOne(id);
    const { items } = updateCartDto;

    if (items) {
      // Remove existing items
      await this.cartItemRepository.remove(cart.cartItems);

      // Create new items
      const cartItems: CartItem[] = [];

      for (const item of items) {
        const product = await this.productsService.findOne(item.productId);
        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }

        const cartItem = this.cartItemRepository.create({
          product,
          quantity: item.quantity,
        });

        cartItems.push(cartItem);
      }

      cart.cartItems = cartItems;
    }

    return this.cartRepository.save(cart);
  }

  async remove(id: number): Promise<void> {
    const cart = await this.findOne(id);
    await this.cartRepository.remove(cart);
  }
} 