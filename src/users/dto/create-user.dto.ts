import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동'
  })
  readonly name: string;

  @ApiProperty({
    description: '이메일 주소',
    example: 'hong@example.com'
  })
  readonly email: string;

  @ApiProperty({
    description: '나이',
    example: 30,
    minimum: 0
  })
  readonly age: number;
} 