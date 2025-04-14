import { IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동'
  })
  name?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({
    description: '이메일 주소',
    example: 'hong@example.com'
  })
  email?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: '나이',
    example: 30
  })
  age?: number;
} 