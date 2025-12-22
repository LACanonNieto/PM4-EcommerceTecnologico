import { Injectable, OnModuleInit } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  async onModuleInit() {
    await this.categoriesService.seeder();
    await this.productsService.seeder();

    return 'Precarga de Datos Completa';
  }
}
