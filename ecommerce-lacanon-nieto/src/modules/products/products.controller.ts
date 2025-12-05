import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CreateProductDto } from './dtos/create-product.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enum/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateProductDto } from './dtos/Update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('seeder')
  seeder() {
    return this.productsService.seeder();
  }
  @Get()
  @HttpCode(200)
  getProducts() {
    return this.productsService.getProducts();
  }

  @Get(':id')
  @HttpCode(200)
  getProductBy(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.getProductBy(id);
  }

  @ApiBearerAuth()
  @Post()
  @HttpCode(201)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  CreateProduct(@Body() product: CreateProductDto) {
    return this.productsService.createProduct(product);
  }

  @ApiBearerAuth()
  @Put(':id')
  @HttpCode(200)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, data);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(200)
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.deleteProduct(id);
  }
}
