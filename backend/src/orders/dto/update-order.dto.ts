import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsEnum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  paymentType?: string;

  @IsNumber()
  @IsOptional()
  paidAmount?: number;

  @IsNumber()
  @IsOptional()
  remainingAmount?: number;

  @IsString()
  @IsOptional()
  paymentStatus?: string;

  @IsString()
  @IsOptional()
  note?: string;
} 