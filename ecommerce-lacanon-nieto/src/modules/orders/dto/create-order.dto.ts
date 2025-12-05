import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: ' ',
    description: 'Aca va el Id del usuario',
  })
  @IsNotEmpty()
  @IsUUID('4')
  userId: string;

  @ApiProperty({
    example: '',
    description: 'Aca van los productos agregados',
  })
  @IsArray()
  @ArrayMinSize(1)
  products: { id: string }[];
}
