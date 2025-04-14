import { Controller, Get, Post, Body, Param, Delete, Put, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { User } from './interfaces/user.interface';
import {
  ApiCreateUser,
  ApiFindAllUsers,
  ApiFindOneUser,
  ApiUpdateUser,
  ApiDeleteUser
} from '../decorators/api-users.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreateUser()
  create(@Body() createUserDto: UserDto): User {
    if (!createUserDto.name || !createUserDto.email || !createUserDto.age) {
      throw new BadRequestException('모든 필드가 필요합니다.');
    }
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiFindAllUsers()
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiFindOneUser()
  findOne(@Param('id') id: string): User {
    const user = this.usersService.findOne(Number(id));
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Put(':id')
  @ApiUpdateUser()
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UserDto
  ): User {
    const user = this.usersService.update(Number(id), updateUserDto);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Delete(':id')
  @ApiDeleteUser()
  delete(@Param('id') id: string): { success: boolean } {
    const result = this.usersService.delete(Number(id));
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { success: true };
  }
}
