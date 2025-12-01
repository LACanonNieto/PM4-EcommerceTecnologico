import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LoginUserDto } from '../users/dtos/Login-user.dto';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { LoginUserDto } from '../users/dtos/Login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  Create(@Body() user: CreateUserDto) {
    return this.authService.createUser(user);
  }

  @Post('signin')
  signin(@Body() Credentials: LoginUserDto) {
    return this.authService.signin(Credentials);
  }

  @Get()
  getAuth() {
    return this.authService.getAuth();
  }
}
