import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Role } from 'src/common/enum/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorators';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('seeder')
  seeder() {
    return this.categoriesService.seeder();
  }

  @ApiOperation({ summary: 'Get All Categories' })
  @Get()
  getCategories() {
    return this.categoriesService.getCategories();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Category' })
  @Post()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  addCategories(@Body() categories: CreateCategoryDto) {
    return this.categoriesService.addCategories(categories);
  }
}
