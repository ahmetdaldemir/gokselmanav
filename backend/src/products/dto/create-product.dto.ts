import { IsString, IsNumber, IsUrl, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsUrl()
  image: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;
} 