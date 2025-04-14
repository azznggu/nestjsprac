import { Controller, Get, Post, Body, Param, Delete, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { ApiCreateUser, ApiDeleteUser, ApiGetUser, ApiGetUsers } from './decorators/api-docs.decorator';
import { UserEntity } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreateUser()
  create(@Body() createUserDto: CreateUserDto): UserEntity {
    const user = this.usersService.create(createUserDto);
    return new UserEntity(user);
  }

  @Get()
  @ApiGetUsers()
  findAll(): UserEntity[] {
    const users = this.usersService.findAll();
    return users.map(user => new UserEntity(user));
  }

  @Get(':id')
  @ApiGetUser()
  findOne(@Param('id') id: string): UserEntity {
    const user = this.usersService.findOne(Number(id));
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return new UserEntity(user);
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
