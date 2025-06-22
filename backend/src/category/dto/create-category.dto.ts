import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  parentId: number;

  @IsString()
  slug: string;

  @IsString()
  @IsOptional()
  image: string;
} 