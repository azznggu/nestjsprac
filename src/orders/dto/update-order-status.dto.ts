import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../interfaces/order.interface';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: '주문 상태',
    enum: OrderStatus,
    example: OrderStatus.COMPLETED
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
} 