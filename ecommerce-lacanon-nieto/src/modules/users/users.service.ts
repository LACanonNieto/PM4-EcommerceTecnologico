import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';

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

  async getUserBy(id: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: {
          order: true,
        },
      });
      if (!user) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }
      const { password, order, ...safeUser } = user;
      return {
        ...safeUser,
        orders: order.map((o) => ({
          id: o.id,
          date: o.date,
        })),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener el usuario');
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`Usuario con id ${id} no existe`);
      }
      await this.usersRepository.update({ id }, updateUserDto);
      return await this.usersRepository.findOneBy({ id });
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  async deleteUser(id: string) {
    try {
      const result = await this.usersRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Usuario con id ${id} no existe`);
      }
      return { message: `Usuario ${id} eliminado correctamente` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
    throw new InternalServerErrorException('Error al eliminar el usuario');
  }
}
