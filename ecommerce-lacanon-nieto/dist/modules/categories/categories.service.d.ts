import { Categories } from './entities/category.entity.js';
import { Repository } from 'typeorm';
export declare class CategoriesService {
    private readonly categoriesRespository;
    constructor(categoriesRespository: Repository<Categories>);
    seeder(): string;
}
