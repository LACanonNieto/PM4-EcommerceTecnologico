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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { CreateProductDto } from './dtos/create-product.dto';

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

  @Post()
  @HttpCode(201)
  CreateProduct(@Body() product: CreateProductDto) {
    return this.productsService.createProduct(product);
  }

  @Put(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() product: Partial<CreateProductDto>,
  ) {
    return this.productsService.updateProduct(id, product);
  }

  @Delete(':id')
  @HttpCode(200)
  deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.deleteProduct(id);
  }
}
