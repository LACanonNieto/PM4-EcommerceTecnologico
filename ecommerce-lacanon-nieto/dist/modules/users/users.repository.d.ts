import { CreateUserDto } from './dtos/create-user.dto';
export interface User {
    id: number;
    email: string;
    name: string;
    password: string;
    address: string;
    phone: string;
    country?: string | undefined;
    city?: string | undefined;
}
export declare class UsersRepository {
    users: User[];
    private validateCreate;
    private validateUpdate;
    getUsers(page: number, limit: number): {
        id: number;
        email: string;
        name: string;
        address: string;
        phone: string;
        country?: string | undefined;
        city?: string | undefined;
    }[];
    getById(id: number): User | undefined;
    CreateUser(user: CreateUserDto): User | null;
    Update(id: number, data: Partial<User>): {
        id: number;
        email: string;
        name: string;
        password: string;
        address: string;
        phone: string;
        country?: string | undefined;
        city?: string | undefined;
    } | null;
    delete(id: number): number | null;
}
