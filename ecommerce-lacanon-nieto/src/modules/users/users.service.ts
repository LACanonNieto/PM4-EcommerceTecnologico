import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UsersRepository } from './users.repository';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getUsers(page: number, limit: number) {
    return this.usersRepository.getUsers(page, limit);
  }

  getUserById(id: number) {
    const user = this.usersRepository.getById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }

  createUser(user: CreateUserDto) {
    return this.usersRepository.CreateUser(user);
  }

  updateUser(id: number, user: Partial<User>) {
    return this.usersRepository.Update(id, user);
  }

  deleteUser(id: number) {
    return this.usersRepository.delete(id);
  }
}
