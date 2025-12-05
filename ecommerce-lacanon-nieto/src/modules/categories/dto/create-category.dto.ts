import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Monitor',
    description: 'Nombre unico de la categoria',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
