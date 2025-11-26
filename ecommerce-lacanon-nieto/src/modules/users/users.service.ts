import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      const newUser: Users = this.usersRepository.create(user);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        //columna debe ser unica 23505 unique violation postgressql
        throw new ConflictException('El usuario ya existe');
      }
      throw new InternalServerErrorException('Error al crear el usuario');
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

  async updateUser(id: string, data: Partial<Users>) {
    try {
      const result = await this.usersRepository.update(id, data);
      // cuantas filas se actualizaron
      if (result.affected === 0) {
        throw new NotFoundException(`Usuario con id ${id} no existe`);
      }
      //retorno el usuario actualizado
      return await this.usersRepository.findOne({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '23505') {
        throw new ConflictException('El usuario ya existe con esos datos');
      }
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
      // Error de FKey constraint (si hay órdenes asociadas, por ejemplo)
      if (error.code === '23503') {
        throw new ConflictException(
          'No se puede eliminar el usuario porque tiene órdenes asociadas',
        );
      }
      throw new InternalServerErrorException('Error al eliminar el usuario');
    }
  }
}
