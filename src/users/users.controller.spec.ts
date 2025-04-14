import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { UserDto } from './dto/user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const testUser: UserDto = {
    name: '홍길동',
    email: 'hong@test.com',
    age: 30
  };

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
    it('모든 필드가 제공되면 사용자를 생성해야 합니다', () => {
      const result = controller.create(testUser);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.name).toBe(testUser.name);
      expect(result.email).toBe(testUser.email);
      expect(result.age).toBe(testUser.age);
    });

    it('필수 필드가 누락되면 BadRequestException을 발생시켜야 합니다', () => {
      const invalidDto = {
        name: '홍길동',
        email: 'hong@test.com'
      } as UserDto;

      expect(() => controller.create(invalidDto))
        .toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('모든 사용자 목록을 반환해야 합니다', () => {
      const created = controller.create(testUser);
      const result = controller.findAll();

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContainEqual(created);
    });
  });

  describe('findOne', () => {
    it('ID로 사용자를 찾아야 합니다', () => {
      const created = controller.create(testUser);
      const result = controller.findOne(created.id.toString());

      expect(result).toBeDefined();
      expect(result).toEqual(created);
    });

    it('존재하지 않는 ID로 조회시 NotFoundException을 발생시켜야 합니다', () => {
      expect(() => controller.findOne('999'))
        .toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('사용자 정보를 성공적으로 업데이트해야 합니다', () => {
      const created = controller.create(testUser);
      const updateDto: UserDto = {
        name: '홍길순'
      };

      const result = controller.update(created.id.toString(), updateDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
      expect(result.name).toBe(updateDto.name);
      expect(result.email).toBe(created.email);
      expect(result.age).toBe(created.age);
    });

    it('존재하지 않는 ID로 업데이트 시도시 NotFoundException을 발생시켜야 합니다', () => {
      const updateDto: UserDto = {
        name: '홍길순'
      };

      expect(() => controller.update('999', updateDto))
        .toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('사용자를 성공적으로 삭제해야 합니다', () => {
      const created = controller.create(testUser);
      const result = controller.delete(created.id.toString());

      expect(result).toEqual({ success: true });
      expect(() => controller.findOne(created.id.toString()))
        .toThrow(NotFoundException);
    });

    it('존재하지 않는 ID로 삭제 시도시 NotFoundException을 발생시켜야 합니다', () => {
      expect(() => controller.delete('999'))
        .toThrow(NotFoundException);
    });
  });
});
