import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  PayloadTooLargeException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entity/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../users/dtos/Login-user.dto';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  getAuth() {
    return 'Esta es una accion que retorna Auth';
  }

  async createUser(user: CreateUserDto) {
    const findUser = await this.usersRepository.findOneBy({
      email: user.email,
    });
    if (findUser) throw new BadRequestException('Credencial Invalida');

    // encriptar contrase;a  de 10 a 20 es lo correcto
    const hashedPassword = await bcrypt.hash(user.password, 12);
    try {
      const newUser: Users = this.usersRepository.create({
        ...user,
        password: hashedPassword,
      });
      //creo una constante de la entidad guardada y desde alli desestructuro para poder quitar el password
      const savedUser = await this.usersRepository.save(newUser);

      const { password: _, ...userWithOutPassword } = savedUser;
      return {
        message: 'Login exitoso',
        user: userWithOutPassword,
      };
    } catch (error) {
      if (error.code === '23505') {
        //columna debe ser unica 23505 unique violation postgressql
        throw new ConflictException('El usuario ya existe');
      }
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
