import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID('4')
  userId: string;

  @IsArray()
  @ArrayMinSize(1)
  products: { id: string }[];
}
