import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create(createCommentDto);
    return this.commentRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findActive(): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      take: 10, // Son 10 yorumu getir
    });
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findOne(id);
    Object.assign(comment, updateCommentDto);
    return this.commentRepository.save(comment);
  }

  async remove(id: number): Promise<void> {
    const comment = await this.findOne(id);
    comment.isActive = false;
    await this.commentRepository.save(comment);
  }

  async getRatingStats(): Promise<{ averageRating: number; totalComments: number; ratingDistribution: Record<number, number> }> {
    const comments = await this.findAll();
    
    if (comments.length === 0) {
      return {
        averageRating: 0,
        totalComments: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }

    const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
    const averageRating = totalRating / comments.length;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    comments.forEach(comment => {
      ratingDistribution[comment.rating]++;
    });

    return {
      averageRating: Math.round(averageRating * 10) / 10, // 1 ondalık basamak
      totalComments: comments.length,
      ratingDistribution
    };
  }
} 