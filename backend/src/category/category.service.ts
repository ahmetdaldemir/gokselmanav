import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private uploadService: UploadService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create({
      ...createCategoryDto,
    });
    return this.categoryRepository.save(category);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  // Ana kategorileri getir (parent_id null olanlar)
  findMainCategories() {
    return this.categoryRepository.find({
      where: { parentId: IsNull(), isActive: true },
      order: { name: 'ASC' },
    });
  }

  // Belirli bir kategorinin alt kategorilerini getir
  findSubCategories(parentId: number) {
    return this.categoryRepository.find({
      where: { parentId, isActive: true },
      order: { name: 'ASC' },
    });
  }

  // Tüm alt kategorileri getir (parent_id null olmayanlar)
  findAllSubCategories() {
    return this.categoryRepository.find({
      where: { parentId: Not(IsNull()), isActive: true },
      order: { name: 'ASC' },
    });
  }

  // Hiyerarşik kategori yapısını getir
  findHierarchicalCategories() {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.children', 'children')
      .where('category.parentId IS NULL')
      .andWhere('category.isActive = :isActive', { isActive: true })
      .orderBy('category.name', 'ASC')
      .addOrderBy('children.name', 'ASC')
      .getMany();
  }

  findOne(id: number) {
    return this.categoryRepository.findOneBy({ id });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    // Eski resmi sil
    const oldCategory = await this.findOne(id);
    if (
      oldCategory &&
      oldCategory.image &&
      oldCategory.image !== updateCategoryDto.image
    ) {
      await this.uploadService.deleteImage(oldCategory.image);
    }

    await this.categoryRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (category) {
      // Resmi sil
      if (category.image) {
        await this.uploadService.deleteImage(category.image);
      }
      return this.categoryRepository.remove(category);
    }
    return null;
  }
} 