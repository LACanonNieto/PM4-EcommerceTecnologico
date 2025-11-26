import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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

  async seeder() {
    try {
      const categoryNames: Set<string> = new Set(
        data.map((product) => product.category),
      ); // estructura que no permite repetidos y recorre cada data y no repite si ya esta la categoria

      const categoriesArray: string[] = Array.from(categoryNames); //me convierte el set en un arreglo de string

      const categories = categoriesArray.map((category) => ({
        name: category,
      })); // se convierte a un arreglo de objetos

      await this.categoriesRespository.upsert(categories, ['name']); //actualiza o/y crea con esto ya no se duplican los elementos
      return {
        message: 'Categories added successfully',
        count: categories.length,
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Algunas categorías ya existen');
      }
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

  async addCategories(categories: { name: string }[]) {
    try {
      //validar que no hayan categorias vacias
      const validCategories = categories.filter(
        (category) => category.name && category.name.trim() !== '',
      ); // trim elimina espacios al inicio y al final de un string

      //aca se valida si tenemos al menos una de las categorias validas
      if (validCategories.length === 0) {
        throw new ConflictException('No hay categorias validas para agregar');
      }
      //inseta o actualiza las categorias por nombre
      await this.categoriesRespository.upsert(validCategories, ['name']);
      return {
        message: 'Categories added successfully',
        count: validCategories.length,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error.code === '23505') {
        throw new ConflictException('Algunas categorías ya existen');
      }
      throw new InternalServerErrorException('Error al cargar las categorías');
    }
  }
}
