import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from '../categories/entities/category.entity';
import data from '../../data/data.json';
import { Products } from './entity/products.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/Update-product.dto';

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
      const categories: Categories[] = await this.categoriesRepository.find();
      if (!categories || categories.length === 0) {
        throw new NotFoundException(
          'No hay categorias disponibles para asociar al producto',
        );
      }

      const newProducts: Products[] = data.map((product) => {
        const category: Categories | undefined = categories.find(
          (category) => product.category === category.name,
        );

        if (!category) {
          throw new NotFoundException(
            `Categoría "${product.category}" no encontrada para el producto "${product.name}"`,
          );
        }

        const newProduct = new Products();
        newProduct.name = product.name;
        newProduct.description = product.description;
        newProduct.price = product.price;
        newProduct.imgUrl = product?.imgUrl;
        newProduct.stock = product.stock;
        newProduct.category = category!;

        return newProduct;
      });

      await this.productsRepository.upsert(newProducts, ['name']);
      return {
        message: 'Products added successfully',
        count: newProducts.length,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
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
      throw new InternalServerErrorException('Error al crear el producto');
    }
  }

  async updateProduct(id: string, data: UpdateProductDto) {
    try {
      const result = await this.productsRepository.update(id, data);

      if (result.affected === 0) {
        throw new NotFoundException(`Producto con id ${id} no existe`);
      }

      return await this.productsRepository.findOne({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
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
    }
    throw new InternalServerErrorException('Error al eliminar el producto');
  }
}
