import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enum/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get All Users for Page select' })
  @Get()
  @HttpCode(200)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  getUsers(@Query('page') page: string, @Query('limit') limit: string) {
    if (limit && page) {
      return this.usersService.getUsers(+page, +limit);
    }
    return this.usersService.getUsers(1, 5);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Users by ID' })
  @Get(':id')
  @HttpCode(200)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserBy(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update User' })
  @Put(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  updatetUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete User' })
  @Delete(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
