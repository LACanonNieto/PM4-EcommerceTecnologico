import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from './entities/category.entity';
import { CategoriesRepository } from './categories.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Categories])], // para hacer la importacion cuando es un repositorio inyectado
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesRepository],
})
export class CategoriesModule {}
