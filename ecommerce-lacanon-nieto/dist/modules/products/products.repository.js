"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsRepository = void 0;
const common_1 = require("@nestjs/common");
let ProductsRepository = class ProductsRepository {
    products = [
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
    getById(id) {
        return this.products.find((product) => product.id === id);
    }
    saveProduct(product) {
        const newProduct = {
            id: this.products[this.products.length - 1].id + 1,
            ...product,
        };
        this.products.push(newProduct);
        return newProduct;
    }
    Update(id, data) {
        const product = this.products.find((product) => product.id === id);
        const index = this.products.findIndex((product) => product.id === id);
        const updateProduct = {
            ...product,
            ...data,
        };
        this.products[index] = updateProduct;
        return updateProduct;
    }
    delete(id) {
        const index = this.products.findIndex((product) => product.id === id);
        this.products.splice(index, 1);
        return 'Producto eliminado correctamente';
    }
};
exports.ProductsRepository = ProductsRepository;
exports.ProductsRepository = ProductsRepository = __decorate([
    (0, common_1.Injectable)()
], ProductsRepository);
//# sourceMappingURL=products.repository.js.map