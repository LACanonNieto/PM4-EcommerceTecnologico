import { CreateProductDto } from './dtos/create-product.dto';
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: boolean;
    imgUrl: string;
}
export declare class ProductsRepository {
    products: Product[];
    getProducts(): Product[];
    getById(id: number): Product | undefined;
    saveProduct(product: CreateProductDto): Product;
    Update(id: number, data: Partial<Product>): {
        id?: number | undefined;
        name?: string | undefined;
        description?: string | undefined;
        price?: number | undefined;
        stock?: boolean | undefined;
        imgUrl?: string | undefined;
    };
    delete(id: number): string;
}
