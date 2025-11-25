import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from '../categories/entities/category.entity';
import data from '../../data/data.json';
import { Products } from './entity/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,

    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  async seeder() {
    const categories: Categories[] = await this.categoriesRepository.find(); // recorrer de manera asincronoca todas las categorias tener un arreglo

    const newProducts: Products[] = data.map((product) => {
      const category: Categories | undefined = categories.find(
        (category) => product.category === category.name,
      ); // recorrer data y por cada producto voy a extraer la categoria y me salga el nombre y si es el mismo me lokeo

      const newProduct = new Products();
      newProduct.name = product.name;
      newProduct.description = product.description;
      newProduct.price = product.price;
      newProduct.imgUrl = product?.imgUrl;
      newProduct.stock = product.stock;
      newProduct.category = category!; // creo una instancia que tenga los datos que quiero y en la categoria quiero que quede el objeto que cree para categories {id, name}

      return newProduct;
    });

    await this.productsRepository.upsert(newProducts, ['name']);
    return 'Products added';
  }
}
