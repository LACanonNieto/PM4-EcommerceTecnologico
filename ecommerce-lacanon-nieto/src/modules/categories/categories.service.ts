import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import data from '../../data/data.json';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRespository: Repository<Categories>,
  ) {}

  async seeder() {
    try {
      const categoryNames: Set<string> = new Set(
        data.map((product) => product.category),
      );
      const categoriesArray: string[] = Array.from(categoryNames);
      const categories = categoriesArray.map((category) => ({
        name: category,
      }));
      await this.categoriesRespository.upsert(categories, ['name']);
      return {
        message: 'Categories added successfully',
        count: categories.length,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al cargar las categorías');
    }
  }

  async getCategories() {
    try {
      const categories = await this.categoriesRespository.find();
      return categories;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las categorias');
    }
  }

  async addCategories(category: CreateCategoryDto) {
    try {
      const exist = await this.categoriesRespository.findOne({
        where: { name: category.name.trim() },
      });

      if (exist) {
        throw new ConflictException('La categoria ya existe');
      }
      return await this.categoriesRespository.save({
        name: category.name.trim(),
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al cargar las categorías');
    }
  }
}
