import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', () => {
      const dto: CreateUserDto = {
        name: '홍길동',
        email: 'hong@example.com',
        age: 30,
      };

      const user = service.create(dto);

      expect(user).toEqual({
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
      
      service.create(dto);
      const users = service.findAll();

      expect(users).toBeInstanceOf(Array);
      expect(users).toHaveLength(1);
      expect(users[0]).toEqual({
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
      
      service.create(dto);
      const user = service.findOne(1);

      expect(user).toEqual({
        id: 1,
        ...dto,
      });
    });

    it('should return undefined for non-existent user', () => {
      const user = service.findOne(999);
      expect(user).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete a user', () => {
      const dto: CreateUserDto = {
        name: '홍길동',
        email: 'hong@example.com',
        age: 30,
      };
      
      service.create(dto);
      const result = service.delete(1);

      expect(result).toBe(true);
      expect(service.findOne(1)).toBeUndefined();
    });

    it('should return false when trying to delete non-existent user', () => {
      const result = service.delete(999);
      expect(result).toBe(false);
    });
  });
});
