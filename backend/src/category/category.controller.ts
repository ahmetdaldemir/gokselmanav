import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('main')
  findMainCategories() {
    return this.categoryService.findMainCategories();
  }

  @Get('hierarchical')
  findHierarchicalCategories() {
    return this.categoryService.findHierarchicalCategories();
  }

  @Get('sub-categories')
  findAllSubCategories() {
    return this.categoryService.findAllSubCategories();
  }

  @Get('sub/:parentId')
  findSubCategories(@Param('parentId') parentId: string) {
    return this.categoryService.findSubCategories(+parentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
} 