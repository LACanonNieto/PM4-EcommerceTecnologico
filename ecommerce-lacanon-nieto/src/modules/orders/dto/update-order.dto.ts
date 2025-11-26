import { IsEnum, IsOptional } from 'class-validator';

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  SHIPPED = 'shipped',
}

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus, {
    message: 'El estado debe ser: pending, completed, cancelled o shipped',
  })
  status?: string;
}
