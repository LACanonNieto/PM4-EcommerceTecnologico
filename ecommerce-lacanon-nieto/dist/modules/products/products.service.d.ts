import { Categories } from '../categories/entities/category.entity';
import { Products } from './entity/products.entity';
import { Repository } from 'typeorm';
export declare class ProductsService {
    private readonly productsRepository;
    private readonly categoriesRepository;
    constructor(productsRepository: Repository<Products>, categoriesRepository: Repository<Categories>);
    seeder(): Promise<string>;
}
