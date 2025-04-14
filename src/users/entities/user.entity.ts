import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({
    description: '사용자 ID',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동'
  })
  name: string;

  @ApiProperty({
    description: '이메일 주소',
    example: 'hong@example.com'
  })
  email: string;

  @ApiProperty({
    description: '나이',
    example: 30
  })
  age: number;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
} 