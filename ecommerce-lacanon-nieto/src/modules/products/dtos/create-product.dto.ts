import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Monitor Gamer 27 pulgadas',
    description: 'Nombre del producto',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: 'Monitor IPS 144hz con resolución 2K ideal para gaming y diseño.',
    description: 'Descripcion del Producto',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  description: string;

  @ApiProperty({
    example: 300,
    description: 'Costo del Producto',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    example: 1,
    description: 'stock del producto',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(1)
  stock: number;

  @ApiProperty({
    example: '',
    description: 'Cargar Imagen',
  })
  @IsString()
  @MaxLength(500)
  imgUrl: string;

  @ApiProperty({
    example: 'fb1b1ab1-6ea8-4dfe-a917-1a9c3cca88fd',
    description: 'Debe contener el UUID de la categoria',
  })
  @IsNotEmpty()
  @IsUUID('4')
  categoryId: string;
}
