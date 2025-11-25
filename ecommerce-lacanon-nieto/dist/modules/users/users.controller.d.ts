import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUsers(page: string, limit: string): Promise<import("./entity/users.entity").Users[]>;
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
    Create(user: CreateUserDto): Promise<import("./entity/users.entity").Users>;
    updatetUser(id: string, user: Partial<CreateUserDto>): Promise<import("./entity/users.entity").Users & Partial<import("./entity/users.entity").Users>>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
}
