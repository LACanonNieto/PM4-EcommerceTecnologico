import { UsersService } from './users.service';
import { User } from './users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUsers(page: string, limit: string): {
        id: number;
        email: string;
        name: string;
        address: string;
        phone: string;
        country?: string | undefined;
        city?: string | undefined;
    }[];
    getUserById(id: string): {
        id: number;
        email: string;
        name: string;
        address: string;
        phone: string;
        country?: string | undefined;
        city?: string | undefined;
    };
    Create(user: CreateUserDto): User | null;
    updatetUser(id: string, user: Partial<User>): {
        id: number;
        email: string;
        name: string;
        password: string;
        address: string;
        phone: string;
        country?: string | undefined;
        city?: string | undefined;
    } | null;
    deleteUser(id: string): number | null;
}
