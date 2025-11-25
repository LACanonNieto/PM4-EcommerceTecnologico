import { Injectable } from '@nestjs/common';
import data from '../../data/data.json';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from './entities/category.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRespository: Repository<Categories>,
  ) {} // se inyecta con decorador el repositorio virtual  de una entidad especifica como lo es categorias

  seeder() {
    const categoryNames: Set<string> = new Set(
      data.map((product) => product.category),
    ); // estructura que no permite repetidos y recorre cada data y no repite si ya esta la categoria

    const categoriesArray: string[] = Array.from(categoryNames); //me convierte el set en un arreglo de string

    const categories = categoriesArray.map((category) => ({
      name: category,
    })); // se convierte a un arreglo de objetos

    this.categoriesRespository.upsert(categories, ['name']);
    return 'Categories Added'; //actualiza o/y crea con esto ya no se duplican los elementos
  }
}
