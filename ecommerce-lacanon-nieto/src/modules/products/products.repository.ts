import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: boolean;
  imgUrl: string;
}

@Injectable()
export class ProductsRepository {
  products: Product[] = [
    {
      id: 1,
      name: 'Laptop Lenovo',
      description: 'Laptop 15 pulgadas, 16GB RAM',
      price: 3000,
      stock: true,
      imgUrl: 'https://example.com/laptop.jpg',
    },
    {
      id: 2,
      name: 'Mouse Logitech',
      description: 'Mouse inalámbrico',
      price: 50,
      stock: true,
      imgUrl: 'https://example.com/mouse.jpg',
    },
    {
      id: 2,
      name: 'Mouse Inalámbrico Logitech',
      description: 'Mouse inalámbrico ergonómico, batería de larga duración',
      price: 120,
      stock: true,
      imgUrl: 'https://example.com/mouse.jpg',
    },

    {
      id: 3,
      name: 'Monitor Samsung 24"',
      description: 'Monitor LED Full HD de 24 pulgadas',
      price: 850,
      stock: true,
      imgUrl: 'https://example.com/monitor.jpg',
    },

    {
      id: 4,
      name: 'Teclado Mecánico Redragon',
      description: 'Teclado mecánico retroiluminado, switches blue',
      price: 250,
      stock: false,
      imgUrl: 'https://example.com/teclado.jpg',
    },
  ];
  getProducts() {
    return this.products;
  }

  getById(id: number) {
    return this.products.find((product) => product.id === id);
  }

  saveProduct(product: CreateProductDto) {
    const newProduct: Product = {
      id: this.products[this.products.length - 1].id + 1,
      ...product,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  Update(id: number, data: Partial<Product>) {
    const product = this.products.find((product) => product.id === id);
    const index = this.products.findIndex((product) => product.id === id);
    const updateProduct = {
      ...product,
      ...data,
    };
    this.products[index] = updateProduct as Product;
    return updateProduct;
  }

  delete(id: number) {
    const index = this.products.findIndex((product) => product.id === id);
    this.products.splice(index, 1);
    return 'Producto eliminado correctamente';
  }
}
