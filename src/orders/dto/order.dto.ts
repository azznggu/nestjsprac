import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min, IsNotEmpty } from 'class-validator';

export class OrderDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 1
  })
  @IsNumber()
  @Min(1)
  readonly userId: number;

  @ApiProperty({
    description: '상품명',
    example: '맥북 프로 16인치'
  })
  @IsString()
  @IsNotEmpty()
  readonly productName: string;

  @ApiProperty({
    description: '주문 수량',
    example: 1,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  readonly quantity: number;

  @ApiProperty({
    description: '총 주문 금액',
    example: 3600000
  })
  @IsNumber()
  @Min(0)
  readonly totalAmount: number;
} 