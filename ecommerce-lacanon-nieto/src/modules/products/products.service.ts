import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from '../categories/entities/category.entity';
import data from '../../data/data.json';
import { Products } from './entity/products.entity';
import { Repository } from 'typeorm';
import { Users } from '../users/entity/users.entity';
import { CreateProductDto } from './dtos/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  async seeder() {
    try {
      //obtener todas las categorias
      const categories: Categories[] = await this.categoriesRepository.find();
      if (!categories || categories.length === 0) {
        throw new NotFoundException(
          'No hay categorias disponibles para asociar al producto',
        );
      }
      //mapear el producto con sus categorias
      const newProducts: Products[] = data.map((product) => {
        const category: Categories | undefined = categories.find(
          (category) => product.category === category.name,
        ); // recorrer data y por cada producto voy a extraer la categoria y me salga el nombre y si es el mismo me lokeo

        if (!category) {
          throw new NotFoundException(
            `Categoría "${product.category}" no encontrada para el producto "${product.name}"`,
          );
        }
        //crear instancias del producto
        const newProduct = new Products();
        newProduct.name = product.name;
        newProduct.description = product.description;
        newProduct.price = product.price;
        newProduct.imgUrl = product?.imgUrl;
        newProduct.stock = product.stock;
        newProduct.category = category!; // creo una instancia que tenga los datos que quiero y en la categoria quiero que quede el objeto que cree para categories {id, name}

        return newProduct;
      });
      //inserta o actualiza productos
      await this.productsRepository.upsert(newProducts, ['name']);
      return {
        message: 'Products added successfully',
        count: newProducts.length,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '23505') {
        throw new ConflictException('Algunos productos ya existen');
      }
      throw new InternalServerErrorException(
        'Error al cargar productos iniciales',
      );
    }
  }
  async getProducts() {
    try {
      const products = await this.productsRepository.find({
        relations: {
          category: true,
        },
      });
      return products;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los productos');
    }
  }
  async getProductBy(id: string) {
    try {
      const product = await this.productsRepository.findOne({
        where: { id },
        relations: {
          category: true,
        },
      });
      if (!product) {
        throw new NotFoundException(`Producto con id ${id} no encontrado`);
      }
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener el producto');
    }
  }

  async createProduct(product: CreateProductDto) {
    try {
      const category = await this.categoriesRepository.findOne({
        where: { id: product.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          'Categoria con id ${product.categoryId} no encontrada',
        );
      }
      const newProduct: Products = this.productsRepository.create({
        ...product,
        category: category,
      });
      return await this.productsRepository.save(newProduct);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '23505') {
        //columna debe ser unica 23505 unique violation postgressql
        throw new ConflictException('El producto ya existe');
      }
      throw new InternalServerErrorException('Error al crear el producto');
    }
  }

  async updateProduct(id: string, data: Partial<Products>) {
    try {
      const result = await this.productsRepository.update(id, data);
      // cuantas filas se actualizaron
      if (result.affected === 0) {
        throw new NotFoundException(`Producto con id ${id} no existe`);
      }
      //retorno el producto actualizado
      return await this.productsRepository.findOne({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '23505') {
        throw new ConflictException('El producto ya existe con esos datos');
      }
      throw new InternalServerErrorException('Error al actualizar el producto');
    }
  }
  async deleteProduct(id: string) {
    try {
      const result = await this.productsRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Producto con id ${id} no existe`);
      }

      return { message: `Producto ${id} eliminado correctamente` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Error de FKey constraint (si hay órdenes asociadas, por ejemplo)
      if (error.code === '23503') {
        throw new ConflictException(
          'No se puede eliminar el producto porque tiene órdenes asociadas',
        );
      }
      throw new InternalServerErrorException('Error al eliminar el producto');
    }
  }
}
