import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Categories } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('seeder')
  seeder() {
    return this.categoriesService.seeder();
  }

  @Get()
  getCategories() {
    return this.categoriesService.getCategories();
  }

  @Post()
  addCategories(@Body() categories: { name: string }[]) {
    return this.categoriesService.addCategories(categories);
  }
}
