import { CreateUserDto } from './dtos/create-user.dto';
import { Users } from './entity/users.entity';
import { Repository } from 'typeorm';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<Users>);
    getUsers(page: number, limit: number): Promise<Users[]>;
    createUser(user: CreateUserDto): Promise<Users>;
    getUserById(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: number;
        country: string;
        address: string;
        city: string;
        isAdmin: boolean;
        order: import("../orders/entities/order.entity").Orders[];
    }>;
    updateUser(id: string, data: Partial<Users>): Promise<Users & Partial<Users>>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
}
