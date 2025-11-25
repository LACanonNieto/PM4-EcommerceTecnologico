import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async getUsers(page: number, limit: number) {
    try {
      let users = await this.usersRepository.find();
      const start = (page - 1) * limit;
      const end = start + limit;

      return (users = users.slice(start, end));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createUser(user: CreateUserDto) {
    const newUser: Users = this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
  }

  async getUserById(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async updateUser(id: string, data: Partial<Users>) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no existe`);
    }
    const updated = Object.assign(user, data);
    return await this.usersRepository.save(updated);
  }

  async deleteUser(id: string) {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con id ${id} no existe`);
    }

    return { message: `Usuario ${id} eliminado correctamente` };
  }
}
