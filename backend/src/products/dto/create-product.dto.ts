import { IsString, IsNumber, IsUrl, IsOptional, Min, IsIn } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  categoryId: number;

  @IsUrl()
  image: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsString()
  @IsIn(['kg', 'adet', 'gram', 'kasa', 'dilim', 'paket', 'diğer'])
  salesType: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  minKg?: number;
} 