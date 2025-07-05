import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsEnum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
  @IsOptional()
  status?: string;
} 