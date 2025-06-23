import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async create(createSettingDto: CreateSettingDto): Promise<Setting> {
    const setting = this.settingRepository.create(createSettingDto);
    return this.settingRepository.save(setting);
  }

  async findAll(): Promise<Setting[]> {
    return this.settingRepository.find();
  }

  async findOne(id: number): Promise<Setting> {
    const setting = await this.settingRepository.findOne({ where: { id } });
    if (!setting) {
      throw new NotFoundException(`Setting with ID ${id} not found`);
    }
    return setting;
  }

  async findByKey(key: string): Promise<Setting> {
    const setting = await this.settingRepository.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting with key ${key} not found`);
    }
    return setting;
  }

  async findSocialMediaSettings(): Promise<Setting[]> {
    const socialMediaKeys = ['Facebook', 'Twitter', 'Instagram'];
    return this.settingRepository.find({
      where: socialMediaKeys.map(key => ({ key })),
    });
  }

  async update(id: number, updateSettingDto: UpdateSettingDto): Promise<Setting> {
    const setting = await this.findOne(id);
    Object.assign(setting, updateSettingDto);
    return this.settingRepository.save(setting);
  }

  async remove(id: number): Promise<void> {
    const setting = await this.findOne(id);
    await this.settingRepository.remove(setting);
  }
} 