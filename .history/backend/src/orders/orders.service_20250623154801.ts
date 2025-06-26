import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItem } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly productsService: ProductsService,
    private readonly customersService: CustomersService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { customerId, items, ...orderData } = createOrderDto;

    // Verify customer exists
    const customer = await this.customersService.findOne(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    // Create order items
    const orderItems: OrderItem[] = [];
    for (const item of items) {
      const product = await this.productsService.findOne(item.productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }
      const orderItem = this.orderItemRepository.create({
        product,
        quantity: item.quantity,
        price: product.price,
      });
      orderItems.push(orderItem);
    }

    const order = this.orderRepository.create({
      ...orderData,
      customer,
      customerId,
      orderItems,
      totalAmount: createOrderDto.totalAmount, // Use total from DTO
    });

    const savedOrder = await this.orderRepository.save(order);

    // After saving the order, associate orderItems with it
    for (const orderItem of orderItems) {
      orderItem.order = savedOrder;
      await this.orderItemRepository.save(orderItem);
    }

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['customer', 'orderItems', 'orderItems.product'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    const { items, ...orderData } = updateOrderDto;

    if (items) {
      // Remove existing items
      await this.orderItemRepository.remove(order.orderItems);

      // Create new items
      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      for (const item of items) {
        const product = await this.productsService.findOne(item.productId);
        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }

        const orderItem = this.orderItemRepository.create({
          product,
          quantity: item.quantity,
          price: product.price,
        });

        totalAmount += orderItem.price * orderItem.quantity;
        orderItems.push(orderItem);
      }

      order.orderItems = orderItems;
      order.totalAmount = totalAmount;
    }

    Object.assign(order, orderData);
    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }
} 