import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entity/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../users/dtos/Login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async signin(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      // validar que vengasn ambos campos
      if (!email || !password) {
        throw new BadRequestException('Email y contraseña requeridas');
      }
      //buscar usuario por email
      const user = await this.usersRepository.findOne({
        where: { email },
      });
      // si no existe el usuario o la contrase;a no es correcta
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Email o Password incorrectos');
      }
      // retorna el usuario sin la contrase;a
      const { password: _, ...userWithOutPassword } = user;
      return {
        message: 'Login exitoso',
        user: userWithOutPassword,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException('Error en el proceso de login');
    }
  }

  getAuth() {
    return 'Esta es una accion que retorna Auth';
  }
}
