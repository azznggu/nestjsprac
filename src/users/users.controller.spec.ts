import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', () => {
      const dto: CreateUserDto = {
        name: '홍길동',
        email: 'hong@example.com',
        age: 30,
      };

      const result = controller.create(dto);

      expect(result).toEqual({
        id: 1,
        ...dto,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', () => {
      const dto: CreateUserDto = {
        name: '홍길동',
        email: 'hong@example.com',
        age: 30,
      };
      
      controller.create(dto);
      const result = controller.findAll();

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 1,
        ...dto,
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', () => {
      const dto: CreateUserDto = {
        name: '홍길동',
        email: 'hong@example.com',
        age: 30,
      };
      
      controller.create(dto);
      const result = controller.findOne('1');

      expect(result).toEqual({
        id: 1,
        ...dto,
      });
    });

    it('should throw NotFoundException for non-existent user', () => {
      expect(() => {
        controller.findOne('999');
      }).toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a user', () => {
      const dto: CreateUserDto = {
        name: '홍길동',
        email: 'hong@example.com',
        age: 30,
      };
      
      controller.create(dto);
      const result = controller.delete('1');

      expect(result).toEqual({ success: true });
      expect(() => {
        controller.findOne('1');
      }).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when trying to delete non-existent user', () => {
      expect(() => {
        controller.delete('999');
      }).toThrow(NotFoundException);
    });
  });
});
