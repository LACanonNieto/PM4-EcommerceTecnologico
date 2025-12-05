import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entity/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from '../users/dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(user: CreateUserDto) {
    const findUser = await this.usersRepository.findOneBy({
      email: user.email,
    });
    if (findUser) throw new BadRequestException('Credencial Invalida');

    const hashedPassword = await bcrypt.hash(user.password, 12);
    try {
      const newUser: Users = this.usersRepository.create({
        ...user,
        password: hashedPassword,
      });

      const savedUser = await this.usersRepository.save(newUser);

      const { password, isAdmin, ...userWithOutPassword } = savedUser;
      return {
        message: 'Login exitoso',
        user: userWithOutPassword,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  async signin(Credentials: LoginUserDto) {
    const findUser = await this.usersRepository.findOneBy({
      email: Credentials.email,
    });
    if (!findUser) throw new BadRequestException('Credencial Invalida');
    try {
      const matchingPasswords = await bcrypt.compare(
        Credentials.password,
        findUser.password,
      );

      if (!matchingPasswords)
        throw new BadRequestException('Credenciales Invalidas');

      const payload = {
        id: findUser.id,
        email: findUser.email,
        isAdmin: findUser.isAdmin,
      };

      const token = this.jwtService.sign(payload);

      return { login: true, access_token: token };
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
}
