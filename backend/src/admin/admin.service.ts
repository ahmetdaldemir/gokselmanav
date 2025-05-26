import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find();
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  async create(adminData: Partial<Admin>): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const admin = this.adminRepository.create({
      ...adminData,
      password: hashedPassword,
    });
    return this.adminRepository.save(admin);
  }

  async update(id: number, adminData: Partial<Admin>): Promise<Admin> {
    if (adminData.password) {
      adminData.password = await bcrypt.hash(adminData.password, 10);
    }
    await this.adminRepository.update(id, adminData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.adminRepository.delete(id);
  }
} 