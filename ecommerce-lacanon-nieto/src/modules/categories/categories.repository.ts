import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Categories)
    private readonly repository: Repository<Categories>,
  ) {}

  async getCategories(): Promise<Categories[]> {
    return await this.repository.find();
  }
  async addCategories(categories: Partial<Categories>[]): Promise<void> {
    //void la promesa no devuelve datos
    await this.repository.upsert(categories, ['name']);
  }
}
