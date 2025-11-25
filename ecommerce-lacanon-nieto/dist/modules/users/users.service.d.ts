import { User, UsersRepository } from './users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    getUsers(page: number, limit: number): {
        id: number;
        email: string;
        name: string;
        address: string;
        phone: string;
        country?: string | undefined;
        city?: string | undefined;
    }[];
    getUserById(id: number): {
        id: number;
        email: string;
        name: string;
        address: string;
        phone: string;
        country?: string | undefined;
        city?: string | undefined;
    };
    createUser(user: CreateUserDto): User | null;
    updateUser(id: number, user: Partial<User>): {
        id: number;
        email: string;
        name: string;
        password: string;
        address: string;
        phone: string;
        country?: string | undefined;
        city?: string | undefined;
    } | null;
    deleteUser(id: number): number | null;
}
