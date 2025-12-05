import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../users/dtos/create-user.dto';

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
}
