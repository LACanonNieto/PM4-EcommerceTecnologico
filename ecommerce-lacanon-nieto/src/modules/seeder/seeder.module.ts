import { Module } from '@nestjs/common';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsModule } from '../products/products.module';
import { SeederService } from './seeder.service';

@Module({
  imports: [CategoriesModule, ProductsModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
